export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

export const HTTP_STATUS_CODES = {
  200: 'OK',
  201: 'Created',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
} as const;

export const MOCK_PRIORITIES = {
  0: '最低',
  1: '低',
  2: '中',
  3: '高',
  4: '最高',
} as const;

export const SCENARIO_TAGS = [
  'normal',
  'error',
  'boundary',
  'performance',
  'security',
  'integration',
] as const;

export const API_ENDPOINTS = {
  MOCKS: '/api/mocks',
  SCENARIOS: '/api/scenarios',
  HEALTH: '/health',
} as const;

export const WEBSOCKET_EVENTS = {
  REQUEST_LOG: 'request:log',
  MOCK_CHANGE: 'mock:change',
  SCENARIO_SWITCH: 'scenario:switched',
  METRICS_UPDATE: 'metrics:update',
  ALERT: 'alert',
} as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 20,
} as const;