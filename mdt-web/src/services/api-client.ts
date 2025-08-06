import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { message } from 'antd';
import { logger } from '../utils/logger';

interface RetryConfig {
  retries?: number;
  retryDelay?: number;
  retryCondition?: (error: AxiosError) => boolean;
}

interface ApiClientConfig extends AxiosRequestConfig {
  enableRetry?: boolean;
  retryConfig?: RetryConfig;
  showErrorMessage?: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private defaultRetryConfig: RetryConfig = {
    retries: 3,
    retryDelay: 1000,
    retryCondition: (error) => {
      // 重试条件：网络错误或 5xx 错误
      return !error.response || (error.response.status >= 500 && error.response.status < 600);
    }
  };

  constructor(config?: ApiClientConfig) {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      },
      ...config
    });

    this.setupInterceptors(config);
  }

  private setupInterceptors(config?: ApiClientConfig) {
    // 请求拦截器
    this.client.interceptors.request.use(
      (reqConfig) => {
        // 添加认证token
        const token = localStorage.getItem('auth_token');
        if (token && reqConfig.headers) {
          reqConfig.headers.Authorization = `Bearer ${token}`;
        }

        // 添加请求ID用于追踪
        reqConfig.headers['X-Request-ID'] = this.generateRequestId();
        
        logger.debug('API Request:', {
          method: reqConfig.method,
          url: reqConfig.url,
          params: reqConfig.params,
          data: reqConfig.data
        });

        return reqConfig;
      },
      (error) => {
        logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data
        });
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        
        // 错误日志
        logger.error('API Error:', {
          status: error.response?.status,
          url: originalRequest?.url,
          message: error.message,
          data: error.response?.data
        });

        // 处理 401 错误
        if (error.response?.status === 401) {
          this.handleUnauthorized();
          return Promise.reject(error);
        }

        // 重试逻辑
        if (config?.enableRetry !== false && !originalRequest._retry) {
          const retryConfig = { ...this.defaultRetryConfig, ...config?.retryConfig };
          
          if (this.shouldRetry(error, originalRequest, retryConfig)) {
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            
            await this.delay(retryConfig.retryDelay! * originalRequest._retryCount);
            
            logger.info(`Retrying request (${originalRequest._retryCount}/${retryConfig.retries}):`, originalRequest.url);
            
            return this.client(originalRequest);
          }
        }

        // 显示错误消息
        if (config?.showErrorMessage !== false) {
          this.showErrorMessage(error);
        }

        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: AxiosError, request: any, config: RetryConfig): boolean {
    const retryCount = request._retryCount || 0;
    
    if (retryCount >= config.retries!) {
      return false;
    }

    if (config.retryCondition) {
      return config.retryCondition(error);
    }

    return false;
  }

  private handleUnauthorized() {
    message.error('认证已过期，请重新登录');
    localStorage.removeItem('auth_token');
    // TODO: 跳转到登录页面
    // window.location.href = '/login';
  }

  private showErrorMessage(error: AxiosError) {
    let errorMessage = '请求失败';

    if (error.response?.data) {
      const data = error.response.data as any;
      if (data.error?.message) {
        errorMessage = data.error.message;
      } else if (data.message) {
        errorMessage = data.message;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时，请稍后重试';
    } else if (!error.response) {
      errorMessage = '网络错误，请检查网络连接';
    }

    message.error(errorMessage);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // 公共方法
  async get<T = any>(url: string, config?: ApiClientConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: ApiClientConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

// 创建默认实例
export const apiClient = new ApiClient();

// 创建不显示错误消息的实例（用于后台轮询等场景）
export const silentApiClient = new ApiClient({ showErrorMessage: false });

// 导出类以便创建自定义实例
export default ApiClient;