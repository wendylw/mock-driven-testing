import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { ApiResponse } from './types/common';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    const errorMsg = error.response?.data?.message || error.message || '请求失败';
    message.error(errorMsg);
    return Promise.reject(error);
  }
);

export default api;