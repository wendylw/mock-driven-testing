/**
 * Test setup for beep-v1-webapp
 * Import this file in your Jest setup
 */

// Import the generated mocks
import './api-mocks';

// Global test utilities
global.mockHelpers = {
  // Reset all mocks
  resetMocks: () => {
    jest.clearAllMocks();
  },
  
  // Wait for async operations
  waitForAsync: () => new Promise(resolve => setTimeout(resolve, 0)),
  
  // Mock localStorage
  mockLocalStorage: () => {
    const storage = {};
    global.localStorage = {
      getItem: (key) => storage[key] || null,
      setItem: (key, value) => { storage[key] = value; },
      removeItem: (key) => { delete storage[key]; },
      clear: () => { Object.keys(storage).forEach(key => delete storage[key]); }
    };
  }
};

// Setup before all tests
beforeAll(() => {
  global.mockHelpers.mockLocalStorage();
});
