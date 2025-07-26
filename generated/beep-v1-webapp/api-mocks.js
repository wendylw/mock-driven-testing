/**
 * Auto-generated API mocks for beep-v1-webapp
 * Generated on: 2025-07-26T04:19:44.264Z
 * Total endpoints: 154
 */

import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock handlers for all API endpoints
export const handlers = [
  rest.get('/api/cart', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-rnsea665v",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cart/apply-cashback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-c7lzgvfbo",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cart/applyPromoCode', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-1zsyoid50",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cart/applyVoucher', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-sp9j9oii7",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cart/checkInventory', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-e5joy6jue",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cart/pax', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-7kp44s56u",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cart/removePromoCode', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-lbrzfqpn8",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cart/unApplyVoucher', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-eevom4yqx",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cart/unapply-cashback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-05f7iihq6",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cashback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "amount": 15.5,
                  "currency": "MYR",
                  "expiryDate": "2025-08-25T04:19:44.264Z",
                  "status": "active"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cashback/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "amount": 15.5,
                  "currency": "MYR",
                  "expiryDate": "2025-08-25T04:19:44.264Z",
                  "status": "active"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cashback/business', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "amount": 15.5,
                  "currency": "MYR",
                  "expiryDate": "2025-08-25T04:19:44.264Z",
                  "status": "active"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cashback/hash/${hash}/decode', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "amount": 15.5,
                  "currency": "MYR",
                  "expiryDate": "2025-08-25T04:19:44.264Z",
                  "status": "active"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cashback/hash/*/decode', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "amount": 15.5,
                  "currency": "MYR",
                  "expiryDate": "2025-08-25T04:19:44.264Z",
                  "status": "active"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/cashback/history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "amount": 15.5,
                  "currency": "MYR",
                  "expiryDate": "2025-08-25T04:19:44.264Z",
                  "status": "active"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/${consumerId}/address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 860,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/${consumerId}/address/${addressId}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 762,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/${consumerId}/address/${id}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 425,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/${consumerId}/favorites/stores/${storeId}/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 454,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/${consumerId}/store/${storeId}/address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 846,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/${consumerId}/store/${storeId}/address/${savedAddressId}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 786,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/${consumerId}/transactions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 962,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/${consumerId}/vouchers', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 314,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/${userId}/paymentMethods', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 49,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/*/address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 589,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/*/address/*', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 224,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/*/customer', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 623,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/*/favorites/stores/*/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 719,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/*/paymentMethods', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 343,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/*/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 865,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/*/store/*/address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 612,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/*/store/*/address/*', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 837,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/*/transactions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 741,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/consumers/*/vouchers', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 827,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/feedback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/files/${fileType}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/AddOrUpdateShoppingCartItem', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/CoreBusiness', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/CoreStores', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/CreateOrder', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/EmptyShoppingCart', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/OnlineCategory', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/OnlineStoreInfo', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/Order', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/ProductDetail', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/RemoveShoppingCartItem', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/gql/Tables', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/login/guest', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/ordering/stores/${foodCourtId}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "ORD-1753503584264",
                  "status": "pending",
                  "items": [],
                  "total": 299.99,
                  "createdAt": "2025-07-26T04:19:44.264Z"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/ordering/stores/${store.id}?a=redirectTo', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "ORD-1753503584264",
                  "status": "pending",
                  "items": [],
                  "total": 299.99,
                  "createdAt": "2025-07-26T04:19:44.264Z"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/ordering/stores/${storeId}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "ORD-1753503584264",
                  "status": "pending",
                  "items": [],
                  "total": 299.99,
                  "createdAt": "2025-07-26T04:19:44.264Z"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/ordering/stores/${storeId}?a=redirectTo', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "ORD-1753503584264",
                  "status": "pending",
                  "items": [],
                  "total": 299.99,
                  "createdAt": "2025-07-26T04:19:44.264Z"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/ordering/stores/*', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "ORD-1753503584264",
                  "status": "pending",
                  "items": [],
                  "total": 299.99,
                  "createdAt": "2025-07-26T04:19:44.264Z"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/ordering/stores/selected?h=${h}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "ORD-1753503584264",
                  "status": "pending",
                  "items": [],
                  "total": 299.99,
                  "createdAt": "2025-07-26T04:19:44.264Z"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/ping', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/products/vouchers', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": 266,
                        "name": "Sample Product",
                        "description": "This is a test product",
                        "price": 99.99,
                        "stock": 100,
                        "category": "Electronics"
                  },
                  {
                        "id": 688,
                        "name": "Sample Product",
                        "description": "This is a test product",
                        "price": 99.99,
                        "stock": 100,
                        "category": "Electronics"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/s3-post-policy/${action}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/shrink', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/storage/location-history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/stores/collection?countryCode=${countryCode}&urlPath=${urlPath}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 30,
                  "name": "Test Store",
                  "address": "123 Test Street",
                  "rating": 4.5,
                  "isOpen": true,
                  "deliveryTime": "30-45 mins"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/stores/collections', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 67,
                  "name": "Test Store",
                  "address": "123 Test Street",
                  "rating": 4.5,
                  "isOpen": true,
                  "deliveryTime": "30-45 mins"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/stores/search${queryString}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 52,
                  "name": "Test Store",
                  "address": "123 Test Street",
                  "rating": 4.5,
                  "isOpen": true,
                  "deliveryTime": "30-45 mins"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/stores/search/options', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 55,
                  "name": "Test Store",
                  "address": "123 Test Street",
                  "rating": 4.5,
                  "isOpen": true,
                  "deliveryTime": "30-45 mins"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/stores/search?lat=${coords.lat}&lng=${coords.lng}&page=${page}&pageSize=${pageSize}&shippingType=delivery&countryCode=${countryCode}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 3,
                  "name": "Test Store",
                  "address": "123 Test Street",
                  "rating": 4.5,
                  "isOpen": true,
                  "deliveryTime": "30-45 mins"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/transactions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/transactions/${orderId}/review', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "ORD-1753503584264",
                  "status": "pending",
                  "items": [],
                  "total": 299.99,
                  "createdAt": "2025-07-26T04:19:44.264Z"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/transactions/${orderId}/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "ORD-1753503584264",
                  "status": "pending",
                  "items": [],
                  "total": 299.99,
                  "createdAt": "2025-07-26T04:19:44.264Z"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/transactions/${receiptNumber}/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/transactions/*/review', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/transactions/*/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/transactions/*/status/cancel', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/transactions/timeslots?shippingType=${deliveryType}&fulfillDate=${selectedDay.toISOString()}&storeId=${storeId}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 26,
                  "name": "Test Store",
                  "address": "123 Test Street",
                  "rating": 4.5,
                  "isOpen": true,
                  "deliveryTime": "30-45 mins"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/transactions/timeslots?shippingType=${shippingType}&fulfillDate=${fulfillDate}&storeId=${storeId}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 12,
                  "name": "Test Store",
                  "address": "123 Test Street",
                  "rating": 4.5,
                  "isOpen": true,
                  "deliveryTime": "30-45 mins"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/alcohol/consent/acknowledge', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/cart', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-5as8z3byb",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/cart/items', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-sp1w8hd0i",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/cart/items/${itemId}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-zguu18fgx",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/cart/items/*', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-qy2si2r37",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/cart/pax', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-rliejs5gf",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/cart/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-bh4fi8pu4",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/cart/submission', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-mhvg0u039",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/cart/submission/${submissionId}/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-137pof2vh",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/cart/submission/*/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-z96bgthka",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/cart:query', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "CART-qdnmlets6",
                  "items": [
                        {
                              "productId": 1,
                              "name": "Test Product",
                              "quantity": 2,
                              "price": 29.99
                        },
                        {
                              "productId": 2,
                              "name": "Another Product",
                              "quantity": 1,
                              "price": 49.99
                        }
                  ],
                  "subtotal": 109.97,
                  "tax": 10.99,
                  "total": 120.96
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/${consumerId}/customer', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 678,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/${consumerId}/customers', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 549,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/${consumerId}/memberships', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 184,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/${consumerId}/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 665,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/${consumerId}/unique-promos', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 807,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/${consumerId}/unique-promos/${uniquePromotionCodeId}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 756,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/${consumerId}/unique-promos/available-count', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 420,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/${consumerId}/unique-promos/banners', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 216,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/*/customer', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 651,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/*/customers', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 910,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/*/memberships', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 322,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/*/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 71,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/*/unique-promos', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 496,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/*/unique-promos/available-count', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 362,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/consumers/*/unique-promos/banners', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 208,
                  "name": "Test User",
                  "email": "test@storehub.com",
                  "phone": "+60123456789"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/e-invoices', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/e-invoices/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/e-invoices/submission-details', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/food-courts/${foodCourtId}/stores', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 38,
                  "name": "Test Store",
                  "address": "123 Test Street",
                  "rating": 4.5,
                  "isOpen": true,
                  "deliveryTime": "30-45 mins"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/food-courts/*/stores', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 56,
                  "name": "Test Store",
                  "address": "123 Test Street",
                  "rating": 4.5,
                  "isOpen": true,
                  "deliveryTime": "30-45 mins"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/loyalty-change-logs', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/mae/login-code', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/memberships', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/merchants/${business}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/merchants/${business}/campaigns/birthday-campaign', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/merchants/${business}/rewards-settings/customize', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/offers', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/offers/${id}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/otp', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/otp/check-phone', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/points/history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/points/rewards', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/points/rewards/${rewardSettingId}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/rewards-sets/${id}/redeem', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/share-info-requests/${requestId}', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/share-info-requests/${requestId}/confirmation', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/share-info-requests/*', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/share-info-requests/*/confirmation', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/storage/selected-address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 1,
                  "line1": "123 Test Street",
                  "city": "Kuala Lumpur",
                  "state": "WP",
                  "postcode": "50000",
                  "country": "Malaysia"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/store-credits/history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": 0,
                  "name": "Test Store",
                  "address": "123 Test Street",
                  "rating": 4.5,
                  "isOpen": true,
                  "deliveryTime": "30-45 mins"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${orderId}/change-shipping-type', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "ORD-1753503584264",
                  "status": "pending",
                  "items": [],
                  "total": 299.99,
                  "createdAt": "2025-07-26T04:19:44.264Z"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${orderId}/status/cancel', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "id": "ORD-1753503584264",
                  "status": "pending",
                  "items": [],
                  "total": 299.99,
                  "createdAt": "2025-07-26T04:19:44.264Z"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/apply-cashback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "amount": 15.5,
                  "currency": "MYR",
                  "expiryDate": "2025-08-25T04:19:44.264Z",
                  "status": "active"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/apply-promotions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/apply-voucher', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "VOUCH-lvn0yr5wi",
                        "code": "SAVE20",
                        "discount": 20,
                        "type": "percentage",
                        "minSpend": 100,
                        "expiryDate": "2025-08-02T04:19:44.264Z"
                  },
                  {
                        "id": "VOUCH-jhnin232m",
                        "code": "SAVE20",
                        "discount": 20,
                        "type": "percentage",
                        "minSpend": 100,
                        "expiryDate": "2025-08-02T04:19:44.264Z"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/calculation', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/remove-cashback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "amount": 15.5,
                  "currency": "MYR",
                  "expiryDate": "2025-08-25T04:19:44.264Z",
                  "status": "active"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/remove-promotions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/remove-voucher', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "VOUCH-f8ex4pnfw",
                        "code": "SAVE20",
                        "discount": 20,
                        "type": "percentage",
                        "minSpend": 100,
                        "expiryDate": "2025-08-02T04:19:44.264Z"
                  },
                  {
                        "id": "VOUCH-ki3sehh3l",
                        "code": "SAVE20",
                        "discount": 20,
                        "type": "percentage",
                        "minSpend": 100,
                        "expiryDate": "2025-08-02T04:19:44.264Z"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/rewards', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/rewards-estimation', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/${receiptNumber}/submission', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/apply-cashback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "amount": 15.5,
                  "currency": "MYR",
                  "expiryDate": "2025-08-25T04:19:44.264Z",
                  "status": "active"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/apply-promotions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/apply-voucher', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "VOUCH-6cq8i34la",
                        "code": "SAVE20",
                        "discount": 20,
                        "type": "percentage",
                        "minSpend": 100,
                        "expiryDate": "2025-08-02T04:19:44.264Z"
                  },
                  {
                        "id": "VOUCH-tzawxiamk",
                        "code": "SAVE20",
                        "discount": 20,
                        "type": "percentage",
                        "minSpend": 100,
                        "expiryDate": "2025-08-02T04:19:44.264Z"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/calculation', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/change-shipping-type', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/remove-cashback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": {
                  "amount": 15.5,
                  "currency": "MYR",
                  "expiryDate": "2025-08-25T04:19:44.264Z",
                  "status": "active"
            },
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/remove-promotions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/remove-voucher', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "VOUCH-qx0ti52t3",
                        "code": "SAVE20",
                        "discount": 20,
                        "type": "percentage",
                        "minSpend": 100,
                        "expiryDate": "2025-08-02T04:19:44.264Z"
                  },
                  {
                        "id": "VOUCH-3or5c6e3r",
                        "code": "SAVE20",
                        "discount": 20,
                        "type": "percentage",
                        "minSpend": 100,
                        "expiryDate": "2025-08-02T04:19:44.264Z"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/rewards', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/status/cancel', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584264",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.264Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/transactions/*/submission', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": [
                  {
                        "id": "TXN-1753503584265",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.265Z",
                        "description": "Purchase at Test Store"
                  },
                  {
                        "id": "TXN-1753503584265",
                        "amount": 150,
                        "status": "completed",
                        "date": "2025-07-26T04:19:44.265Z",
                        "description": "Purchase at Test Store"
                  }
            ],
            "message": "Mock response generated"
      })
    );
  }),

  rest.get('/api/v3/urls/validation', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
            "success": true,
            "data": null,
            "message": "Mock response generated"
      })
    );
  }),
];

// Setup MSW server
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());

// Helper function to override specific endpoints
export const mockEndpoint = (method, endpoint, response, status = 200) => {
  server.use(
    rest[method](endpoint, (req, res, ctx) => {
      return res(ctx.status(status), ctx.json(response));
    })
  );
};

// Helper to mock error responses
export const mockError = (endpoint, status = 500, message = 'Internal Server Error') => {
  server.use(
    rest.get(endpoint, (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json({ success: false, error: message })
      );
    })
  );
};
