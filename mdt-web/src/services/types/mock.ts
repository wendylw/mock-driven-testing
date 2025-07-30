export interface Mock {
  id: string;
  name: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  urlPattern?: string;
  headers?: Record<string, string>;
  query?: Record<string, any>;
  body?: any;
  response: {
    status: number;
    headers?: Record<string, string>;
    body: any;
    delay?: number;
  };
  priority: number;
  active: boolean;
  scenarioId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMockRequest {
  name: string;
  description?: string;
  method: Mock['method'];
  url: string;
  urlPattern?: string;
  headers?: Record<string, string>;
  query?: Record<string, any>;
  body?: any;
  response: Mock['response'];
  priority?: number;
  active?: boolean;
  scenarioId?: string;
}

export interface UpdateMockRequest extends Partial<CreateMockRequest> {}

export interface MockListResponse {
  mocks: Mock[];
  total: number;
}

export interface MockStats {
  total: number;
  active: number;
  byMethod: Record<string, number>;
  byStatus: Record<string, number>;
}