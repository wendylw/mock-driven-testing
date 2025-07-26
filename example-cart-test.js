/**
 * Example test file showing how to use the generated mocks
 * Copy this to your beep-v1-webapp project to test
 */

// This would be in a test file like: src/components/Cart/__tests__/Cart.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mockEndpoint } from '../../../../generated/beep-v1-webapp/api-mocks';
import Cart from '../Cart'; // Your actual component
import { store } from '../../../store'; // Your Redux store

describe('Cart Component with Mocks', () => {
  it('should display cart items from mocked API', async () => {
    // The mock is already set up to return cart data
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    // Wait for the cart to load
    await waitFor(() => {
      // Based on the mock data structure
      expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
      expect(screen.getByText(/109.97/)).toBeInTheDocument(); // subtotal from mock
    });
  });

  it('should handle empty cart', async () => {
    // Override the default mock for this specific test
    mockEndpoint('get', '/api/cart', {
      success: true,
      data: {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0
      }
    });

    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock an error response
    mockEndpoint('get', '/api/cart', null, 500);

    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });
});