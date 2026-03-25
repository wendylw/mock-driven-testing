import api from './api';
import { 
  BaselineStatus, 
  DiagnosticResult, 
  SuggestionsResult,
  AnalysisResult,
  BaselineListItem 
} from './types/baseline';

// 添加认证token（临时使用硬编码，实际应从登录获取）
const getAuthHeaders = () => ({
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTAwMSIsInVzZXJuYW1lIjoiZGV2ZWxvcGVyIiwicm9sZSI6ImRldmVsb3BlciIsImlhdCI6MTYwOTQ1OTIwMH0.fake-jwt-token'
  }
});

class BaselineService {
  /**
   * 获取基准列表
   */
  async getBaselines(): Promise<BaselineListItem[]> {
    const response = await api.get<any, any>('/baselines', getAuthHeaders());
    return response.data || response; // Handle interceptor returning data directly
  }

  /**
   * 获取基准状态
   */
  async getBaselineStatus(baselineId: string): Promise<BaselineStatus> {
    const response = await api.get<any, any>(`/baselines/${baselineId}/status`, getAuthHeaders());
    return response.data || response;
  }

  /**
   * 获取问题诊断
   */
  async getDiagnostic(baselineId: string): Promise<DiagnosticResult> {
    const response = await api.get<any, any>(`/baselines/${baselineId}/diagnostic`, getAuthHeaders());
    return response.data || response;
  }

  /**
   * 获取智能建议
   */
  async getSuggestions(baselineId: string): Promise<SuggestionsResult> {
    const response = await api.get<any, any>(`/baselines/${baselineId}/suggestions`, getAuthHeaders());
    return response.data || response;
  }

  /**
   * 处理智能建议交互
   */
  async handleSuggestionInteraction(
    baselineId: string, 
    sessionId: string, 
    action: string, 
    context?: any
  ): Promise<any> {
    const response = await api.post<any, any>(
      `/baselines/${baselineId}/suggestions/interact`,
      { sessionId, action, context },
      getAuthHeaders()
    );
    return response.data || response;
  }

  /**
   * 应用建议
   */
  async applySuggestion(baselineId: string, suggestionId: string): Promise<void> {
    await api.post(
      `/baselines/${baselineId}/suggestions/${suggestionId}/apply`,
      {},
      getAuthHeaders()
    );
  }

  /**
   * 触发基准分析
   */
  async triggerAnalysis(baselineId: string, force: boolean = false): Promise<any> {
    const response = await api.post<any, any>(
      `/baselines/${baselineId}/analyze`,
      { force },
      getAuthHeaders()
    );
    return response.data || response;
  }

  /**
   * 获取分析历史
   */
  async getAnalysisHistory(baselineId: string, limit: number = 10): Promise<AnalysisResult[]> {
    const response = await api.get<any, any>(
      `/baselines/${baselineId}/analyze/history?limit=${limit}`,
      getAuthHeaders()
    );
    return response.data || response;
  }

  /**
   * 批量获取基准状态
   */
  async getBatchStatuses(baselineIds: string[]): Promise<Record<string, BaselineStatus>> {
    const promises = baselineIds.map(id => 
      this.getBaselineStatus(id).catch(() => null)
    );
    
    const results = await Promise.all(promises);
    const statusMap: Record<string, BaselineStatus> = {};
    
    baselineIds.forEach((id, index) => {
      if (results[index]) {
        statusMap[id] = results[index]!;
      }
    });
    
    return statusMap;
  }
}

export const baselineService = new BaselineService();