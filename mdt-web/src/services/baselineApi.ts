import axios, { AxiosInstance } from 'axios';
import { message } from 'antd';

// API响应类型定义
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// 基准状态响应
interface StatusResponse {
  baselineId: string;
  component: string;
  status: string;
  statusLabel: string;
  statusDetail: {
    type: string;
    label: string;
    hasDetail: boolean;
    detailTitle?: string;
    detailMessage?: string;
  };
  metrics: {
    usageCount: number;
    lastUpdated: string;
    snapshotCount: number;
    size: number;
  };
}

// 诊断响应
interface DiagnosticResponse {
  summary: {
    criticalCount: number;
    warningCount: number;
    infoCount: number;
    fixableCount: number;
  };
  problems: Array<{
    id: string;
    severity: 'critical' | 'warning' | 'info';
    category: string;
    impact: string;
    affectedScenarios: string;
    reproduction: string;
    frequency: string;
    evidence: any;
    rootCause: any;
    quickFix?: any;
  }>;
}

// 建议响应
interface SuggestionsResponse {
  visualSuggestions: any[];
  codeSuggestions: any[];
  interactiveSuggestions: any;
  progressiveLearning: any;
}

// 分析响应
interface AnalyzeResponse {
  analysisId: string;
  status: string;
  estimatedTime: string;
  progress: number;
}

class BaselineApiService {
  private api: AxiosInstance;
  private useRemoteApi: boolean;

  constructor() {
    // 判断是否使用远程API
    this.useRemoteApi = import.meta.env.VITE_USE_REMOTE_API === 'true' || false;
    
    // 创建axios实例
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        // 添加认证token
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // 处理未授权
          message.error('认证失败，请重新登录');
          // TODO: 跳转到登录页面
        } else if (error.response?.data?.error) {
          // 显示服务器错误信息
          const serverError = error.response.data.error;
          message.error(serverError.message || '请求失败');
        } else if (error.code === 'ECONNABORTED') {
          message.error('请求超时，请稍后重试');
        } else {
          message.error('网络错误，请检查网络连接');
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 获取基准列表
   */
  async getBaselines(): Promise<ApiResponse<any[]>> {
    if (!this.useRemoteApi) {
      // 使用本地Mock数据
      const response = await fetch('/baselines.json');
      const data = await response.json();
      return data;
    }

    const response = await this.api.get<ApiResponse>('/baselines');
    return response.data;
  }

  /**
   * 获取基准状态
   */
  async getStatus(baselineId: string): Promise<ApiResponse<StatusResponse>> {
    const response = await this.api.get<ApiResponse<StatusResponse>>(`/baselines/${baselineId}/status`);
    return response.data;
  }

  /**
   * 获取诊断数据
   */
  async getDiagnostic(baselineId: string): Promise<ApiResponse<DiagnosticResponse>> {
    const response = await this.api.get<ApiResponse<DiagnosticResponse>>(`/baselines/${baselineId}/diagnostic`);
    return response.data || response;
  }

  /**
   * 获取建议数据
   */
  async getSuggestions(baselineId: string): Promise<ApiResponse<SuggestionsResponse>> {
    const response = await this.api.get<ApiResponse<SuggestionsResponse>>(`/baselines/${baselineId}/suggestions`);
    return response.data;
  }

  /**
   * 触发分析
   */
  async triggerAnalysis(baselineId: string, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<ApiResponse<AnalyzeResponse>> {
    const response = await this.api.post<ApiResponse<AnalyzeResponse>>(
      `/baselines/${baselineId}/analyze`,
      { priority }
    );
    return response.data;
  }

  /**
   * 获取分析进度
   */
  async getAnalysisProgress(analysisId: string): Promise<ApiResponse<any>> {
    const response = await this.api.get<ApiResponse>(`/analysis/${analysisId}/progress`);
    return response.data;
  }

  /**
   * 交互式建议
   */
  async interactWithSuggestion(
    baselineId: string,
    sessionId: string,
    action: string,
    context: any
  ): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse>(
      `/baselines/${baselineId}/suggestions/interact`,
      { sessionId, action, context }
    );
    return response.data;
  }
}

// 导出单例
export default new BaselineApiService();