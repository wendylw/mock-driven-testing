import api from './api';
import {
  Mock,
  CreateMockRequest,
  UpdateMockRequest,
  MockListResponse,
  MockStats,
} from './types/mock';
import { TableParams } from './types/common';

export class MockService {
  async getMocks(params?: TableParams) {
    return api.get<MockListResponse>('/api/mocks', { params });
  }

  async getMockById(id: string) {
    return api.get<Mock>(`/api/mocks/${id}`);
  }

  async createMock(data: CreateMockRequest) {
    return api.post<Mock>('/api/mocks', data);
  }

  async updateMock(id: string, data: UpdateMockRequest) {
    return api.put<Mock>(`/api/mocks/${id}`, data);
  }

  async deleteMock(id: string) {
    return api.delete(`/api/mocks/${id}`);
  }

  async deleteAllMocks() {
    return api.delete('/api/mocks');
  }

  async exportMocks() {
    return api.get('/api/mocks/export');
  }

  async importMocks(data: any) {
    return api.post('/api/mocks/import', data);
  }

  async getMockStats() {
    return api.get<MockStats>('/api/mocks/stats');
  }
}

export const mockService = new MockService();