export interface Scenario {
  id: string;
  name: string;
  description: string;
  tags: string[];
  active: boolean;
  parent?: string;
  variables: Record<string, any>;
  mocks: ScenarioMock[];
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioMock {
  mockId: string;
  overrides?: {
    response?: {
      status?: number;
      headers?: Record<string, string>;
      body?: any;
      delay?: number;
    };
  };
}

export interface CreateScenarioRequest {
  name: string;
  description?: string;
  tags?: string[];
  parent?: string;
  variables?: Record<string, any>;
  mocks?: ScenarioMock[];
}

export interface UpdateScenarioRequest extends Partial<CreateScenarioRequest> {}

export interface ScenarioListResponse {
  scenarios: Scenario[];
  total: number;
}

export interface ScenarioStats {
  total: number;
  activeScenario?: string;
  tagDistribution: Record<string, number>;
  withParent: number;
  withMocks: number;
}