import api from './api';
import {
  Scenario,
  CreateScenarioRequest,
  UpdateScenarioRequest,
  ScenarioListResponse,
  ScenarioStats,
} from './types/scenario';
import { TableParams } from './types/common';

export class ScenarioService {
  async getScenarios(params?: TableParams) {
    const query = new URLSearchParams();
    
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString());
    
    const endpoint = `/api/scenarios${query.toString() ? '?' + query.toString() : ''}`;
    return api.get<ScenarioListResponse>(endpoint);
  }

  async getScenarioById(id: string) {
    return api.get<Scenario>(`/api/scenarios/${id}`);
  }

  async getFullScenario(id: string) {
    return api.get<Scenario>(`/api/scenarios/${id}/full`);
  }

  async getActiveScenario() {
    return api.get<Scenario>('/api/scenarios/active');
  }

  async createScenario(data: CreateScenarioRequest) {
    return api.post<Scenario>('/api/scenarios', data);
  }

  async createFromTemplate(templatePath: string, customizations?: any) {
    return api.post<Scenario>('/api/scenarios/from-template', {
      templatePath,
      customizations,
    });
  }

  async updateScenario(id: string, data: UpdateScenarioRequest) {
    return api.put<Scenario>(`/api/scenarios/${id}`, data);
  }

  async deleteScenario(id: string) {
    return api.delete(`/api/scenarios/${id}`);
  }

  async activateScenario(id: string) {
    return api.post<Scenario>(`/api/scenarios/${id}/activate`);
  }

  async cloneScenario(id: string, newName?: string) {
    return api.post<Scenario>(`/api/scenarios/${id}/clone`, { name: newName });
  }

  async searchScenarios(query: string) {
    return api.get<ScenarioListResponse>(`/api/scenarios/search?q=${encodeURIComponent(query)}`);
  }

  async getScenariosByTag(tag: string) {
    return api.get<ScenarioListResponse>(`/api/scenarios/tag/${tag}`);
  }

  async getScenarioStats() {
    return api.get<ScenarioStats>('/api/scenarios/stats');
  }

  async getTemplates() {
    return api.get('/api/scenarios/templates');
  }
}

export const scenarioService = new ScenarioService();