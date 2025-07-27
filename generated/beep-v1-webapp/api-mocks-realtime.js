/**
 * 实时捕获的 API Mock - 基于真实的 beep-v1-webapp API 响应
 * 自动生成时间: 2025-07-26T11:03:08.656Z
 * 已捕获 48 个端点，共 166 次调用
 * 
 * 使用方法:
 * import { handlers } from './api-mocks-realtime';
 * const worker = setupWorker(...handlers);
 */

import { rest } from 'msw';

export const handlers = [
  rest.post('/api/gql/OnlineCategory', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "data": {
        "onlineCategory": [
            {
                "id": "b4a8947ab841eccd36f370f8e95027bc",
                "isEnabled": true,
                "isBestSeller": true,
                "name": "Best Seller",
                "products": [
                    {
                        "id": "67287c47e097f800076d2c77",
                        "title": "Mocha",
                        "displayPrice": 25,
                        "originalDisplayPrice": null,
                        "trackInventory": false,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287c47e097f800076d2c77/bf3a71bd-cc82-4d91-e702-aa7975a16a81"
                        ],
                        "stock": 1,
                        "quantityOnHand": null,
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [],
                        "isFeaturedProduct": true,
                        "stockStatus": "notTrackInventory",
                        "descriptionPlainText": ""
                    },
                    {
                        "id": "67287951e097f800076d1bb5",
                        "title": "Espresso",
                        "displayPrice": 8,
                        "originalDisplayPrice": 8,
                        "trackInventory": false,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287951e097f800076d1bb5/4f399064-24d5-4366-eb00-914184e88543"
                        ],
                        "stock": 1,
                        "quantityOnHand": null,
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [],
                        "isFeaturedProduct": true,
                        "stockStatus": "notTrackInventory",
                        "descriptionPlainText": ""
                    },
                    {
                        "id": "67220fa7e097f8000711b674",
                        "title": "Tiramisù",
                        "displayPrice": 35,
                        "originalDisplayPrice": 45,
                        "trackInventory": true,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b674/379de89c-b2db-4469-b6ca-d8b0247dd087"
                        ],
                        "stock": 1,
                        "quantityOnHand": 988,
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [
                            {
                                "id": "6763a937c89b5e000779a118",
                                "name": "Size",
                                "allowMultiQty": false,
                                "enableSelectionAmountLimit": null,
                                "minSelectionAmount": null,
                                "maxSelectionAmount": null,
                                "variationType": "SingleChoice",
                                "optionValues": [
                                    {
                                        "markedSoldOut": false,
                                        "id": "6763a937c89b5e000779a116",
                                        "value": "Normal"
                                    },
                                    {
                                        "markedSoldOut": false,
                                        "id": "6763a937c89b5e000779a117",
                                        "value": "Large"
                                    }
                                ]
                            },
                            {
                                "id": "67220fa7e097f8000711b677",
                                "name": "Extra add-ons",
                                "allowMultiQty": false,
                                "enableSelectionAmountLimit": false,
                                "minSelectionAmount": 0,
                                "maxSelectionAmount": null,
                                "variationType": "MultipleChoice",
                                "optionValues": [
                                    {
                                        "markedSoldOut": false,
                                        "id": "67220fa7e097f8000711b678",
                                        "value": "Extra patty"
                                    }
                                ]
                            }
                        ],
                        "isFeaturedProduct": true,
                        "stockStatus": "inStock",
                        "descriptionPlainText": ""
                    }
                ]
            },
            {
                "id": "67287e10e097f800076d2fad",
                "name": "Classic Coffee",
                "isEnabled": true,
                "products": [
                    {
                        "id": "67287c47e097f800076d2c77",
                        "title": "Mocha",
                        "displayPrice": 25,
                        "originalDisplayPrice": null,
                        "trackInventory": false,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287c47e097f800076d2c77/bf3a71bd-cc82-4d91-e702-aa7975a16a81"
                        ],
                        "stock": 1,
                        "quantityOnHand": null,
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [],
                        "isFeaturedProduct": true,
                        "stockStatus": "notTrackInventory",
                        "descriptionPlainText": ""
                    },
                    {
                        "id": "67287c09e097f800076d2b8d",
                        "title": "Flat White",
                        "displayPrice": 20,
                        "originalDisplayPrice": null,
                        "trackInventory": false,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287c09e097f800076d2b8d/853913f1-1a8d-4d2e-f412-9fd3aa9d9f7b"
                        ],
                        "stock": 1,
                        "quantityOnHand": null,
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [],
                        "isFeaturedProduct": false,
                        "stockStatus": "notTrackInventory",
                        "descriptionPlainText": ""
                    },
                    {
                        "id": "67220fa7e097f8000711b673",
                        "title": "Latte",
                        "displayPrice": 12,
                        "originalDisplayPrice": null,
                        "trackInventory": false,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b673/b2b19ab9-6410-4324-b69e-394173f6c38f"
                        ],
                        "stock": 1,
                        "quantityOnHand": null,
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [
                            {
                                "id": "67220fa7e097f8000711b681",
                                "name": "Temperature",
                                "allowMultiQty": false,
                                "enableSelectionAmountLimit": null,
                                "minSelectionAmount": null,
                                "maxSelectionAmount": null,
                                "variationType": "SingleChoice",
                                "optionValues": [
                                    {
                                        "markedSoldOut": false,
                                        "id": "67220fa7e097f8000711b682",
                                        "value": "Hot"
                                    },
                                    {
                                        "markedSoldOut": false,
                                        "id": "67220fa7e097f8000711b683",
                                        "value": "Cold"
                                    }
                                ]
                            },
                            {
                                "id": "67220fa7e097f8000711b684",
                                "name": "Size",
                                "allowMultiQty": false,
                                "enableSelectionAmountLimit": null,
                                "minSelectionAmount": null,
                                "maxSelectionAmount": null,
                                "variationType": "SingleChoice",
                                "optionValues": [
                                    {
                                        "markedSoldOut": false,
                                        "id": "67220fa7e097f8000711b685",
                                        "value": "S"
                                    },
                                    {
                                        "markedSoldOut": false,
                                        "id": "67220fa7e097f8000711b686",
                                        "value": "M"
                                    },
                                    {
                                        "markedSoldOut": false,
                                        "id": "67220fa7e097f8000711b687",
                                        "value": "L"
                                    }
                                ]
                            },
                            {
                                "id": "67220fa7e097f8000711b688",
                                "name": "Add-ons",
                                "allowMultiQty": false,
                                "enableSelectionAmountLimit": false,
                                "minSelectionAmount": 0,
                                "maxSelectionAmount": null,
                                "variationType": "MultipleChoice",
                                "optionValues": [
                                    {
                                        "markedSoldOut": false,
                                        "id": "67220fa7e097f8000711b689",
                                        "value": "Extra espresso shot"
                                    },
                                    {
                                        "markedSoldOut": false,
                                        "id": "67220fa7e097f8000711b68a",
                                        "value": "Flavor shot"
                                    },
                                    {
                                        "markedSoldOut": false,
                                        "id": "67220fa7e097f8000711b68b",
                                        "value": "Whipped cream topping"
                                    }
                                ]
                            }
                        ],
                        "isFeaturedProduct": false,
                        "stockStatus": "notTrackInventory",
                        "descriptionPlainText": ""
                    },
                    {
                        "id": "67220fa7e097f8000711b675",
                        "title": "Ice Americano",
                        "displayPrice": 12,
                        "originalDisplayPrice": 10,
                        "trackInventory": true,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b675/d13296bd-a381-4abb-bcc4-cedcfce45eef"
                        ],
                        "stock": 1,
                        "quantityOnHand": 100,
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [],
                        "isFeaturedProduct": false,
                        "stockStatus": "inStock",
                        "descriptionPlainText": ""
                    },
                    {
                        "id": "67287951e097f800076d1bb5",
                        "title": "Espresso",
                        "displayPrice": 8,
                        "originalDisplayPrice": 8,
                        "trackInventory": false,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287951e097f800076d1bb5/4f399064-24d5-4366-eb00-914184e88543"
                        ],
                        "stock": 1,
                        "quantityOnHand": null,
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [],
                        "isFeaturedProduct": true,
                        "stockStatus": "notTrackInventory",
                        "descriptionPlainText": ""
                    }
                ]
            },
            {
                "id": "676926074682030007a45f8a",
                "name": "Bean",
                "isEnabled": true,
                "products": []
            },
            {
                "id": "67692b324682030007a46d39",
                "name": "Dessert",
                "isEnabled": true,
                "products": [
                    {
                        "id": "67220fa7e097f8000711b674",
                        "title": "Tiramisù",
                        "displayPrice": 35,
                        "originalDisplayPrice": 45,
                        "trackInventory": true,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b674/379de89c-b2db-4469-b6ca-d8b0247dd087"
                        ],
                        "stock": 1,
                        "quantityOnHand": 988,
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [
                            {
                                "id": "6763a937c89b5e000779a118",
                                "name": "Size",
                                "allowMultiQty": false,
                                "enableSelectionAmountLimit": null,
                                "minSelectionAmount": null,
                                "maxSelectionAmount": null,
                                "variationType": "SingleChoice",
                                "optionValues": [
                                    {
                                        "markedSoldOut": false,
                                        "id": "6763a937c89b5e000779a116",
                                        "value": "Normal"
                                    },
                                    {
                                        "markedSoldOut": false,
                                        "id": "6763a937c89b5e000779a117",
                                        "value": "Large"
                                    }
                                ]
                            },
                            {
                                "id": "67220fa7e097f8000711b677",
                                "name": "Extra add-ons",
                                "allowMultiQty": false,
                                "enableSelectionAmountLimit": false,
                                "minSelectionAmount": 0,
                                "maxSelectionAmount": null,
                                "variationType": "MultipleChoice",
                                "optionValues": [
                                    {
                                        "markedSoldOut": false,
                                        "id": "67220fa7e097f8000711b678",
                                        "value": "Extra patty"
                                    }
                                ]
                            }
                        ],
                        "isFeaturedProduct": true,
                        "stockStatus": "inStock",
                        "descriptionPlainText": ""
                    },
                    {
                        "id": "67692ad64682030007a46bf4",
                        "title": "Affogato",
                        "displayPrice": 40,
                        "originalDisplayPrice": 35,
                        "trackInventory": true,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67692ad64682030007a46bf4/48fdc89b-7fad-45e5-8650-d9952542c18f"
                        ],
                        "stock": 1,
                        "quantityOnHand": null,
                        "markedSoldOut": false,
                        "inventoryType": "Composite",
                        "variations": [],
                        "isFeaturedProduct": false,
                        "stockStatus": "inStock",
                        "descriptionPlainText": ""
                    },
                    {
                        "id": "676929f04682030007a4687c",
                        "title": "Gelato",
                        "displayPrice": 20,
                        "originalDisplayPrice": null,
                        "trackInventory": true,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/676929f04682030007a4687c/afbba3f6-150d-4a16-b68d-b689b44499c8",
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/676929f04682030007a4687c/cd591193-c29f-4c35-f595-24c7e095ada6"
                        ],
                        "stock": 1,
                        "quantityOnHand": 2000,
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [],
                        "isFeaturedProduct": false,
                        "stockStatus": "inStock",
                        "descriptionPlainText": ""
                    }
                ]
            }
        ]
    },
    "error": null
})
    );
  }),

  rest.get('/api/ping', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "login": true,
    "consumerId": "5d285b152734781c0fcadee2"
})
    );
  }),

  rest.post('/api/gql/OnlineStoreInfo', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "data": {
        "onlineStoreInfo": {
            "id": "67220fa8a2b284a465794eaf",
            "storeName": "Coffee Bean (Webstore)",
            "beepBrandName": "Bean",
            "logo": "https://d16kpilgrxu9w6.cloudfront.net/coffee/online-store/appearance/image/logo/logo_fcd4e7ea-6946-4f33-d2e0-ddd8e5e1f4cb",
            "favicon": "https://d16kpilgrxu9w6.cloudfront.net/coffee/online-store/appearance/image/favicon/favicon_b9d856a6-e469-4c7d-dc8d-c14e7916c93a",
            "locale": "MS-MY",
            "currency": "MYR",
            "currencySymbol": "RM",
            "country": "MY",
            "state": null,
            "street": null,
            "analyticTools": [],
            "businessType": "cafe"
        }
    }
})
    );
  }),

  rest.post('/api/gql/CoreBusiness', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "data": {
        "business": {
            "name": "coffee",
            "timezone": "Asia/Kuala_Lumpur",
            "enablePax": true,
            "isQROrderingEnabled": true,
            "enableServiceCharge": false,
            "enableCashback": true,
            "enableTakeaway": true,
            "takeawayCharge": 0.2,
            "serviceChargeRate": null,
            "serviceChargeTax": "",
            "subscriptionStatus": "Active",
            "planId": "medium_annually",
            "addonIds": [
                "sh-engage-annually",
                "sh-membership-annually"
            ],
            "defaultLoyaltyRatio": 20,
            "country": "MY",
            "displayBusinessName": "coffee",
            "qrOrderingSettings": {
                "searchingTags": [],
                "marketingTags": [],
                "minimumConsumption": 0.5,
                "useStorehubLogistics": true,
                "disableGuestLogin": false,
                "enableDelivery": true,
                "enableDeliveryLiveOnline": true,
                "enableLiveOnline": true,
                "enablePreOrder": true,
                "disableTodayPreOrder": false,
                "validDays": [
                    2,
                    3,
                    4,
                    5,
                    6
                ],
                "validTimeFrom": "10:00",
                "validTimeTo": "22:00",
                "deliveryRadius": 20,
                "defaultShippingZone": {
                    "id": "67220fa8e097f8000711b6b6",
                    "distance": 20,
                    "defaultShippingZoneMethod": {
                        "id": "67220fa8e097f8000711b6b7",
                        "rate": 0,
                        "enableConditionalFreeShipping": true,
                        "freeShippingMinAmount": "30"
                    }
                },
                "sellAlcohol": true,
                "breakTimeFrom": null,
                "breakTimeTo": null,
                "vacations": null,
                "pauseModeSettings": {
                    "shippingTypes": [],
                    "endingAt": null
                },
                "enablePayLater": false,
                "disableTodayDeliveryPreOrder": false,
                "disableOnDemandOrder": false,
                "enablePerTimeSlotLimitForPreOrder": false,
                "maxPreOrdersPerTimeSlot": null
            },
            "stores": [
                {
                    "id": "67220fa7e097f8000711b668",
                    "name": "Coffee's Cafe (Pay First)",
                    "phone": "60165000000",
                    "isOnline": true,
                    "isDeleted": null,
                    "street1": "Kuala Lumpur City Centre",
                    "street2": "",
                    "city": "Kuala Lumpur",
                    "state": "Wilayah Persekutuan Kuala Lumpur",
                    "country": "MY",
                    "receiptTemplateData": {
                        "taxName": null
                    },
                    "location": {
                        "longitude": 101.7121664,
                        "latitude": 3.158248200000001
                    },
                    "fulfillmentOptions": [
                        "Delivery",
                        "Pickup"
                    ],
                    "reviewInfo": null,
                    "qrOrderingSettings": {
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6
                        ],
                        "validTimeFrom": "10:00",
                        "validTimeTo": "22:00",
                        "breakTimeFrom": null,
                        "breakTimeTo": null,
                        "vacations": null,
                        "pauseModeSettings": {
                            "shippingTypes": [],
                            "endingAt": null
                        },
                        "enablePreOrder": true,
                        "enablePayLater": false,
                        "disableTodayPreOrder": false,
                        "disableTodayDeliveryPreOrder": false,
                        "disableOnDemandOrder": false,
                        "enablePerTimeSlotLimitForPreOrder": false,
                        "maxPreOrdersPerTimeSlot": null,
                        "pauseModeEnabled": false
                    },
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Pay First)"
                }
            ],
            "allowAnonymousQROrdering": false,
            "multipleStores": true,
            "promotions": [
                {
                    "id": "624ba82271147a645251f450",
                    "promotionCode": "BEEPDISCOUNT",
                    "discountType": "percentage",
                    "discountValue": 100,
                    "appliedSources": [
                        8,
                        7,
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "app",
                        "tngMiniProgram",
                        "web"
                    ],
                    "maxDiscountAmount": 0,
                    "minOrderAmount": 1,
                    "requireFirstPurchase": false
                },
                {
                    "id": "624ba86e71147a90c351f454",
                    "promotionCode": "FREESHIPPING",
                    "discountType": "freeShipping",
                    "discountValue": 0,
                    "appliedSources": [
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "web"
                    ],
                    "maxDiscountAmount": 20,
                    "minOrderAmount": 10,
                    "requireFirstPurchase": false
                }
            ],
            "timezoneOffset": 480
        }
    }
})
    );
  }),

  rest.post('/api/gql/AddOrUpdateShoppingCartItem', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "data": {
        "addOrUpdateShoppingCartItem": {
            "shoppingCartItem": {
                "id": "8bcbd4966d7cf1672c8e90d4fe032f7a",
                "business": "coffee",
                "quantity": 1
            }
        }
    }
})
    );
  }),

  rest.post('/api/gql/CreateOrder', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "data": {
        "orders": [
            {
                "id": "9e30cea8-ca6e-4985-8854-e7eab06bc9f5",
                "pax": 1,
                "total": 11.95,
                "orderId": "851312428829293",
                "status": "created",
                "tableId": null,
                "pickUpId": "0002",
                "storeId": "673d54420e5c2300079412a1",
                "isPreOrder": false,
                "expectDeliveryDateFrom": null,
                "paymentMethod": "Online"
            }
        ]
    },
    "error": null
})
    );
  }),

  rest.get('/api/v3/merchants/coffee', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "name": "coffee",
        "enableCashback": true,
        "claimCashbackCountPerDay": 20,
        "logo": "https://d16kpilgrxu9w6.cloudfront.net/coffee/online-store/appearance/image/logo/logo_fcd4e7ea-6946-4f33-d2e0-ddd8e5e1f4cb",
        "displayName": "Bean",
        "country": "MY",
        "locale": "MS-MY",
        "currency": "MYR",
        "isQROrderingEnabled": true,
        "membershipEnabled": true,
        "qrOrderingSettings": {
            "enableDelivery": true
        },
        "pointsEnabled": true,
        "enableLoyalty": true,
        "pointsExpirationDuration": {
            "durationNumber": 6,
            "durationUnit": "months"
        }
    },
    "extra": null
})
    );
  }),

  rest.get('/api/cashback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "status": "Invalid",
    "cashback": "0.59",
    "defaultLoyaltyRatio": 20,
    "displayBusinessName": "coffee",
    "country": "MY",
    "currency": "MYR",
    "store": {
        "country": "MALAYSIA",
        "city": "Butterworth"
    },
    "locale": "MS-MY",
    "currencySymbol": "RM"
})
    );
  }),

  rest.get('/api/v3/points/history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": [
        {
            "id": "688496e07642be30d9618c61",
            "merchantName": "coffee",
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "type": "earn",
            "changeAmount": 1250,
            "eventTime": "2025-07-26T16:50:39.855+08:00"
        },
        {
            "id": "688490e37642be1d94618b9a",
            "merchantName": "coffee",
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "type": "earn",
            "changeAmount": 2800,
            "eventTime": "2025-07-26T16:25:07.091+08:00"
        },
        {
            "id": "688481ec7642bed4ba618a84",
            "merchantName": "coffee",
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "type": "spend",
            "changeAmount": -1,
            "eventTime": "2025-07-26T15:21:16.981+08:00"
        },
        {
            "id": "68847ed47642bed99f6189a8",
            "merchantName": "coffee",
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "type": "earn",
            "changeAmount": 900,
            "eventTime": "2025-07-26T15:08:03.961+08:00"
        },
        {
            "id": "686244500294fc530ce1fc0a",
            "merchantName": "coffee",
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "type": "earn",
            "changeAmount": 750,
            "eventTime": "2025-06-30T16:01:20.537+08:00"
        },
        {
            "id": "68623acf0294fc92d9e1fb6b",
            "merchantName": "coffee",
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "type": "earn",
            "changeAmount": 1200,
            "eventTime": "2025-06-30T15:20:47.199+08:00"
        },
        {
            "id": "680f2205d74ba87ad7e99ab5",
            "merchantName": "coffee",
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "type": "earn",
            "changeAmount": 500,
            "eventTime": "2025-04-28T14:36:52.517+08:00"
        },
        {
            "id": "6809b29c0543d8100f21466b",
            "merchantName": "coffee",
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "type": "spend",
            "changeAmount": -1,
            "eventTime": "2025-04-24T11:40:12.041+08:00"
        },
        {
            "id": "6809b2830543d846b521462b",
            "merchantName": "coffee",
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "type": "earn",
            "changeAmount": 400,
            "eventTime": "2025-04-24T11:39:46.693+08:00"
        }
    ],
    "extra": null
})
    );
  }),

  rest.post('/api/gql/CoreStores', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "data": {
        "business": {
            "name": "coffee",
            "timezone": "Asia/Kuala_Lumpur",
            "enablePax": true,
            "qrOrderingSettings": {
                "minimumConsumption": 0.5,
                "useStorehubLogistics": true,
                "enableDelivery": true,
                "enableLiveOnline": true,
                "enableDeliveryLiveOnline": true,
                "enablePreOrder": null,
                "disableTodayPreOrder": null,
                "validDays": [
                    2,
                    3,
                    4,
                    5,
                    6
                ],
                "validTimeFrom": "10:00",
                "validTimeTo": "22:00",
                "deliveryRadius": null
            },
            "stores": [
                {
                    "id": "67220fa7e097f8000711b668",
                    "name": "Coffee's Cafe (Pay First)",
                    "isOnline": true,
                    "isDeleted": null,
                    "enableDigital": false,
                    "street1": "Kuala Lumpur City Centre",
                    "street2": "",
                    "city": "Kuala Lumpur",
                    "state": "Wilayah Persekutuan Kuala Lumpur",
                    "country": "MY",
                    "location": {
                        "longitude": 101.7121664,
                        "latitude": 3.158248200000001
                    },
                    "fulfillmentOptions": [
                        "Delivery",
                        "Pickup"
                    ],
                    "distance": null,
                    "deliveryFee": null,
                    "qrOrderingSettings": {
                        "minimumConsumption": 0.5,
                        "useStorehubLogistics": true,
                        "enableDelivery": true,
                        "enableLiveOnline": true,
                        "enableDeliveryLiveOnline": true,
                        "enablePreOrder": true,
                        "disableTodayPreOrder": false,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6
                        ],
                        "validTimeFrom": "10:00",
                        "validTimeTo": "22:00",
                        "deliveryRadius": null,
                        "breakTimeFrom": null,
                        "breakTimeTo": null,
                        "vacations": null,
                        "pauseModeSettings": {
                            "shippingTypes": [],
                            "endingAt": null
                        },
                        "enablePayLater": false,
                        "disableTodayDeliveryPreOrder": false,
                        "disableOnDemandOrder": false,
                        "enablePerTimeSlotLimitForPreOrder": false,
                        "maxPreOrdersPerTimeSlot": null,
                        "pauseModeEnabled": false
                    },
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Pay First)",
                    "hash": "U2FsdGVkX1%2BVxKUkvv2ajX37wpHmfL5g%2BftkY4wCdzWEhKC65i744n4t4jFH8FCj"
                },
                {
                    "id": "67286735e097f800076806a9",
                    "name": "Coffee's Cafe (Pay Later)",
                    "isOnline": true,
                    "isDeleted": null,
                    "enableDigital": false,
                    "street1": "1, Jln Imbi, Bukit Bintang",
                    "street2": "",
                    "city": "Kuala Lumpur",
                    "state": "Wilayah Persekutuan Kuala Lumpur",
                    "country": "MY",
                    "location": {
                        "longitude": 101.7096765,
                        "latitude": 3.1423868
                    },
                    "fulfillmentOptions": [
                        "Delivery",
                        "Pickup"
                    ],
                    "distance": null,
                    "deliveryFee": null,
                    "qrOrderingSettings": {
                        "minimumConsumption": 0.5,
                        "useStorehubLogistics": true,
                        "enableDelivery": true,
                        "enableLiveOnline": true,
                        "enableDeliveryLiveOnline": true,
                        "enablePreOrder": false,
                        "disableTodayPreOrder": true,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6
                        ],
                        "validTimeFrom": "10:00",
                        "validTimeTo": "22:00",
                        "deliveryRadius": null,
                        "breakTimeFrom": null,
                        "breakTimeTo": null,
                        "vacations": null,
                        "pauseModeSettings": {
                            "shippingTypes": [],
                            "endingAt": null
                        },
                        "enablePayLater": true,
                        "disableTodayDeliveryPreOrder": true,
                        "disableOnDemandOrder": true,
                        "enablePerTimeSlotLimitForPreOrder": false,
                        "maxPreOrdersPerTimeSlot": null,
                        "pauseModeEnabled": false
                    },
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Pay Later)",
                    "hash": "U2FsdGVkX1%2BRLoTtz%2FMdOO49f2Cg1c3ZU2lYrBvC2ianHvHqBrc6uZLNOmDiwcam"
                },
                {
                    "id": "673d54420e5c2300079412a1",
                    "name": "Coffee Bean (Webstore)",
                    "isOnline": true,
                    "isDeleted": null,
                    "enableDigital": false,
                    "street1": "6, Jalan Pantai",
                    "street2": "",
                    "city": "Butterworth",
                    "state": "Pulau Pinang",
                    "country": "MALAYSIA",
                    "location": {
                        "longitude": 100.3653178,
                        "latitude": 5.394979699999999
                    },
                    "fulfillmentOptions": [
                        "Delivery"
                    ],
                    "distance": null,
                    "deliveryFee": null,
                    "qrOrderingSettings": {
                        "minimumConsumption": 0.5,
                        "useStorehubLogistics": true,
                        "enableDelivery": true,
                        "enableLiveOnline": true,
                        "enableDeliveryLiveOnline": true,
                        "enablePreOrder": false,
                        "disableTodayPreOrder": true,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeFrom": "10:00",
                        "validTimeTo": "22:00",
                        "deliveryRadius": null,
                        "breakTimeFrom": null,
                        "breakTimeTo": null,
                        "vacations": null,
                        "pauseModeSettings": {
                            "shippingTypes": [],
                            "endingAt": null
                        },
                        "enablePayLater": false,
                        "disableTodayDeliveryPreOrder": true,
                        "disableOnDemandOrder": true,
                        "enablePerTimeSlotLimitForPreOrder": false,
                        "maxPreOrdersPerTimeSlot": null,
                        "pauseModeEnabled": false
                    },
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Webstore)",
                    "hash": "U2FsdGVkX1%2B8meBcQ7cVTDsRHXvLjKePRT1rJNe%2BSiSWUuyYOreawZUaAa99ovUS"
                },
                {
                    "id": "680744152a1d4d0006291cd6",
                    "name": "Coffee's Cafe (Pay At Count Only)",
                    "isOnline": true,
                    "isDeleted": null,
                    "enableDigital": false,
                    "street1": "Kuala Lumpur City Centre",
                    "street2": "",
                    "city": "Kuala Lumpur",
                    "state": "Wilayah Persekutuan Kuala Lumpur",
                    "country": "MY",
                    "location": {
                        "longitude": 101.7122335,
                        "latitude": 3.1572757
                    },
                    "fulfillmentOptions": [
                        "Delivery",
                        "Pickup"
                    ],
                    "distance": null,
                    "deliveryFee": null,
                    "qrOrderingSettings": {
                        "minimumConsumption": 0.5,
                        "useStorehubLogistics": true,
                        "enableDelivery": true,
                        "enableLiveOnline": true,
                        "enableDeliveryLiveOnline": true,
                        "enablePreOrder": false,
                        "disableTodayPreOrder": true,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6
                        ],
                        "validTimeFrom": "10:00",
                        "validTimeTo": "22:00",
                        "deliveryRadius": null,
                        "breakTimeFrom": null,
                        "breakTimeTo": null,
                        "vacations": null,
                        "pauseModeSettings": {
                            "shippingTypes": [],
                            "endingAt": null
                        },
                        "enablePayLater": true,
                        "disableTodayDeliveryPreOrder": true,
                        "disableOnDemandOrder": true,
                        "enablePerTimeSlotLimitForPreOrder": false,
                        "maxPreOrdersPerTimeSlot": null,
                        "pauseModeEnabled": false
                    },
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Pay At Count Only)",
                    "hash": "U2FsdGVkX19MVRPyyLdzxClBRyA3cA4zWhpmOmnIxh4u5Az27HXRLSqEruveQqKz"
                }
            ]
        }
    }
})
    );
  }),

  rest.post('/api/gql/Order', (req, res, ctx) => {
        const body = req.body;
    const paramValue = body?.variables?.productId || 
                      body?.variables?.orderId || 
                      body?.variables?.storeId || 
                      body?.variables?.consumerId ||
                      body?.variables?.id;
    
    // 参数数据映射表
    const paramMap = {
    "851318963385707": {
        "data": {
            "order": {
                "business": "coffee",
                "tax": 0,
                "createdTime": "2025-07-26T16:50:33+08:00",
                "orderId": "851318963385707",
                "status": "accepted",
                "productsManualDiscount": null,
                "subtotal": 25,
                "paymentMethod": "Online",
                "roundedAmount": 0,
                "total": 25.2,
                "storeId": "673d54420e5c2300079412a1",
                "tableId": null,
                "pickUpId": "0001",
                "serviceCharge": 0,
                "shippingType": "takeaway",
                "shippingFee": 0,
                "shippingFeeDiscount": 0,
                "isPreOrder": false,
                "change2Pickup": false,
                "isBeepCancellableOrder": true,
                "originalShippingType": null,
                "expectDeliveryDateFrom": null,
                "expectDeliveryDateTo": null,
                "fulfillDate": "2025-07-26T16:50:33+08:00",
                "delayReason": null,
                "delayDetail": null,
                "contactDetail": {
                    "email": null
                },
                "deliveryInformation": [],
                "storeInfo": {
                    "name": "Coffee Bean (Webstore)",
                    "phone": "+60165000000",
                    "street1": "6, Jalan Pantai",
                    "street2": "",
                    "city": "Butterworth",
                    "state": "Pulau Pinang",
                    "country": "MALAYSIA",
                    "location": {
                        "longitude": 100.3653178,
                        "latitude": 5.394979699999999
                    },
                    "countryCode": "MY",
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Webstore)",
                    "isLowestPrice": false
                },
                "logs": [
                    {
                        "receiptNumber": "851318963385707",
                        "time": "2025-07-26T08:50:40.358Z",
                        "type": "status_updated",
                        "info": [
                            {
                                "key": "status",
                                "value": "accepted"
                            }
                        ],
                        "operatorId": "core-event-consumer",
                        "operatorType": "system"
                    },
                    {
                        "receiptNumber": "851318963385707",
                        "time": "2025-07-26T08:50:39.880Z",
                        "type": "status_updated",
                        "info": [
                            {
                                "key": "status",
                                "value": "paid"
                            }
                        ],
                        "operatorId": "5d285b152734781c0fcadee2",
                        "operatorType": "customer"
                    },
                    {
                        "receiptNumber": "851318963385707",
                        "time": "2025-07-26T08:50:34.201Z",
                        "type": "status_updated",
                        "info": [
                            {
                                "key": "status",
                                "value": "pendingPayment"
                            }
                        ],
                        "operatorId": "ecommerce-consumer",
                        "operatorType": "system"
                    }
                ],
                "loyaltyDiscounts": [],
                "additionalComments": null,
                "items": [
                    {
                        "id": "688496d91b191169228ff106",
                        "title": "Mocha",
                        "productId": "67287c47e097f800076d2c77",
                        "quantity": 1,
                        "unitPrice": 25,
                        "image": "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287c47e097f800076d2c77/bf3a71bd-cc82-4d91-e702-aa7975a16a81",
                        "variationTexts": [],
                        "displayPrice": 25,
                        "itemType": null,
                        "isTakeaway": true,
                        "takeawayCharge": 0.2
                    }
                ],
                "appliedVoucher": null,
                "createdVoucherCodes": [],
                "displayPromotions": [],
                "createdVouchers": [],
                "takeawayCharges": 0.2,
                "fixedFee": 0,
                "isPayLater": false,
                "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
                "eInvoiceRelatedInfo": {
                    "linkType": "notSupported",
                    "link": null
                },
                "paidTime": "2025-07-26T08:50:39.880Z",
                "paymentNames": [
                    "Card Payment (International)"
                ],
                "cancelOperator": null,
                "riderLocations": null,
                "isCancellable": true,
                "timeoutLookingForRider": false,
                "refundShippingFee": null
            }
        }
    },
    "851312428829293": {
        "data": {
            "order": {
                "business": "coffee",
                "tax": 0,
                "createdTime": "2025-07-26T16:56:51+08:00",
                "orderId": "851312428829293",
                "status": "accepted",
                "productsManualDiscount": null,
                "subtotal": 20,
                "paymentMethod": "Online",
                "roundedAmount": 0,
                "total": 11.95,
                "storeId": "673d54420e5c2300079412a1",
                "tableId": null,
                "pickUpId": "0002",
                "serviceCharge": 0,
                "shippingType": "takeaway",
                "shippingFee": 0,
                "shippingFeeDiscount": 0,
                "isPreOrder": false,
                "change2Pickup": false,
                "isBeepCancellableOrder": true,
                "originalShippingType": null,
                "expectDeliveryDateFrom": null,
                "expectDeliveryDateTo": null,
                "fulfillDate": "2025-07-26T16:56:51+08:00",
                "delayReason": null,
                "delayDetail": null,
                "contactDetail": {
                    "email": null
                },
                "deliveryInformation": [],
                "storeInfo": {
                    "name": "Coffee Bean (Webstore)",
                    "phone": "+60165000000",
                    "street1": "6, Jalan Pantai",
                    "street2": "",
                    "city": "Butterworth",
                    "state": "Pulau Pinang",
                    "country": "MALAYSIA",
                    "location": {
                        "longitude": 100.3653178,
                        "latitude": 5.394979699999999
                    },
                    "countryCode": "MY",
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Webstore)",
                    "isLowestPrice": false
                },
                "logs": [
                    {
                        "receiptNumber": "851312428829293",
                        "time": "2025-07-26T08:57:08.884Z",
                        "type": "status_updated",
                        "info": [
                            {
                                "key": "status",
                                "value": "accepted"
                            }
                        ],
                        "operatorId": "core-event-consumer",
                        "operatorType": "system"
                    },
                    {
                        "receiptNumber": "851312428829293",
                        "time": "2025-07-26T08:57:08.646Z",
                        "type": "status_updated",
                        "info": [
                            {
                                "key": "status",
                                "value": "paid"
                            }
                        ],
                        "operatorId": "5d285b152734781c0fcadee2",
                        "operatorType": "customer"
                    },
                    {
                        "receiptNumber": "851312428829293",
                        "time": "2025-07-26T08:56:52.440Z",
                        "type": "status_updated",
                        "info": [
                            {
                                "key": "status",
                                "value": "pendingPayment"
                            }
                        ],
                        "operatorId": "ecommerce-consumer",
                        "operatorType": "system"
                    }
                ],
                "loyaltyDiscounts": [
                    {
                        "loyaltyType": "cashback",
                        "spentValue": 8.25,
                        "displayDiscount": 8.25
                    }
                ],
                "additionalComments": null,
                "items": [
                    {
                        "id": "688498531b191185838ff37e",
                        "title": "Gelato",
                        "productId": "676929f04682030007a4687c",
                        "quantity": 1,
                        "unitPrice": 20,
                        "image": "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/676929f04682030007a4687c/afbba3f6-150d-4a16-b68d-b689b44499c8",
                        "variationTexts": [],
                        "displayPrice": 20,
                        "itemType": null,
                        "isTakeaway": true,
                        "takeawayCharge": 0.2
                    }
                ],
                "appliedVoucher": null,
                "createdVoucherCodes": [],
                "displayPromotions": [],
                "createdVouchers": [],
                "takeawayCharges": 0.2,
                "fixedFee": 0,
                "isPayLater": false,
                "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
                "eInvoiceRelatedInfo": {
                    "linkType": "notSupported",
                    "link": null
                },
                "paidTime": "2025-07-26T08:57:08.646Z",
                "paymentNames": [
                    "Online Banking"
                ],
                "cancelOperator": null,
                "riderLocations": null,
                "isCancellable": true,
                "timeoutLookingForRider": false,
                "refundShippingFee": null
            }
        }
    }
};
    
    // 根据参数查找对应数据，找不到则返回默认数据
    const responseData = paramMap[paramValue] || paramMap['851318963385707'];
    
    return res(
      ctx.status(200),
      ctx.json(responseData)
    );
  }),

  rest.get('/api/v3/alcohol/consent/acknowledge', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "alcoholConsentTime": "2022-01-21T10:46:06.237Z"
    },
    "extra": null
})
    );
  }),

  rest.get('/api/cart', (req, res, ctx) => {
        const url = new URL(req.url.href);
    const paramValue = url.searchParams.get('shippingType') ||
                      url.searchParams.get('business') ||
                      url.searchParams.get('storeId') ||
                      url.searchParams.get('consumerId');
    
    // 参数数据映射表
    const paramMap = {
    "takeaway": {
        "total": 11.95,
        "subtotal": 20,
        "count": 1,
        "discount": 8.25,
        "tax": 0,
        "pax": 0,
        "serviceCharge": 0,
        "serviceChargeTax": 0,
        "shippingFee": 0,
        "shippingFeeDiscount": 0,
        "takeawayCharges": 0.2,
        "fixedFee": 0,
        "loyaltyDiscounts": [
            {
                "displayDiscount": 8.25,
                "spentValue": 8.25,
                "loyaltyType": "cashback"
            }
        ],
        "displayAvailableCashback": 8.25,
        "applyCashback": true,
        "items": [
            {
                "id": "8bcbd4966d7cf1672c8e90d4fe032f7a",
                "productId": "676929f04682030007a4687c",
                "parentProductId": null,
                "title": "Gelato",
                "itemType": null,
                "total": 11.95,
                "taxCode": "67220fa7e097f8000711b67b",
                "taxRate": 0,
                "serviceChargeRate": 0,
                "variationTexts": [],
                "variations": [],
                "trackInventory": true,
                "markedSoldOut": false,
                "inventoryType": "",
                "stock": 1,
                "quantityOnHand": 1000,
                "originalDisplayPrice": null,
                "displayPrice": 20,
                "quantity": 1,
                "image": "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/676929f04682030007a4687c/afbba3f6-150d-4a16-b68d-b689b44499c8",
                "comments": "",
                "isTakeaway": true,
                "takeawayCharge": 0.2,
                "stockStatus": "inStock"
            }
        ],
        "unavailableItems": [],
        "displayPromotions": [],
        "voucher": null,
        "cashback": 8.25,
        "totalCashback": 8.25
    },
    "delivery": {
        "total": 12.5,
        "subtotal": 0,
        "count": 0,
        "discount": 0,
        "tax": 0,
        "pax": 0,
        "serviceCharge": 0,
        "serviceChargeTax": 0,
        "shippingFee": 12.5,
        "shippingFeeDiscount": 0,
        "takeawayCharges": 0,
        "fixedFee": 0,
        "loyaltyDiscounts": null,
        "displayAvailableCashback": null,
        "applyCashback": false,
        "items": [],
        "unavailableItems": [],
        "displayPromotions": [],
        "voucher": null,
        "cashback": 0
    }
};
    
    // 根据参数查找对应数据，找不到则返回默认数据
    const responseData = paramMap[paramValue] || paramMap['takeaway'];
    
    return res(
      ctx.status(200),
      ctx.json(responseData)
    );
  }),

  rest.get('/api/v3/consumers/5d285b152734781c0fcadee2/customer', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "id": "67bd699e6bce9034849e9e0e",
        "business": "coffee",
        "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
        "consumerId": "5d285b152734781c0fcadee2",
        "tags": [
            "SH_Tier_4"
        ],
        "info": {
            "firstName": "Beep",
            "lastName": "User test17",
            "email": "louis.lei@storehub.com",
            "phone": "+60123456789",
            "birthday": "1991-02-25T08:00:00.000+08:00"
        },
        "purchaseInfo": {
            "lastPurchaseDate": "2025-07-26T16:56:51.290+08:00",
            "totalSpent": 242.64999999999998,
            "totalTransactions": 8
        },
        "storeCreditInfo": {
            "storeCreditsBalance": 0.5899999999999999,
            "storeCreditsSpent": 8.25,
            "cashbackClaimCount": 4,
            "lastCashbackClaimDate": "2025-07-26T16:57:09.257+08:00",
            "cashbackExpirationDate": "2025-10-25T00:00:00.000+08:00"
        },
        "createdTime": "2025-02-25T14:56:30.462+08:00",
        "modifiedTime": "2025-07-26T16:57:09.360+08:00",
        "source": "BeepQR",
        "availablePointsBalance": 7798,
        "customerTier": {
            "id": "673c348ec30f7680c89f4c70",
            "name": "platinum",
            "level": 4,
            "totalSpent": 131,
            "startTime": "2025-03-04T12:53:25.216+08:00",
            "nextReviewTime": "2025-10-01T00:00:00.000+08:00",
            "pointsTotalEarned": 0,
            "isNewMember": false
        },
        "rewardsTotal": 0
    },
    "extra": null
})
    );
  }),

  rest.get('/api/v3/consumers/5d285b152734781c0fcadee2/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "id": "5d285b152734781c0fcadee2",
        "phone": "+60123456789",
        "firstName": "Beep",
        "lastName": "User test17",
        "email": "louis.lei@storehub.com",
        "gender": "",
        "birthday": "1991-02-25T00:00:00.000Z",
        "birthdayModifiedTime": "2024-12-17T03:29:28.706Z",
        "notificationSettings": {
            "newsSms": true,
            "newsPush": false,
            "newsEmail": true,
            "promotionalSms": true,
            "promotionalPush": false,
            "promotionalEmail": true
        },
        "birthdayChangeAllowed": true
    },
    "extra": null
})
    );
  }),

  rest.get('/api/v3/storage/selected-address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "addressInfo": {
            "savedAddressId": "6867686997bd965f597f6517",
            "shortName": "Test Address 2",
            "fullName": "Sentul, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
            "coords": {
                "lat": 3.2066139,
                "lng": 101.6820313
            },
            "city": "Kuala Lumpur",
            "postCode": "47800",
            "countryCode": "MY"
        }
    },
    "extra": null
})
    );
  }),

  rest.get('/api/consumers/5d285b152734781c0fcadee2/store/673d54420e5c2300079412a1/address/6867686997bd965f597f6517', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "_id": "6867686997bd965f597f6517",
    "contactName": "Ttest2",
    "contactNumber": "+60123456789",
    "address": "Level 2, Sentul, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
    "addressName": "Test Address 2",
    "comments": "test",
    "addressDetails": "Level 2",
    "deliveryTo": "Sentul, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
    "location": {
        "longitude": 101.6820313,
        "latitude": 3.2066139
    },
    "city": "Kuala Lumpur",
    "countryCode": "MY",
    "postCode": "47800",
    "availableStatus": false
})
    );
  }),

  rest.post('/api/gql/ProductDetail', (req, res, ctx) => {
        const body = req.body;
    const paramValue = body?.variables?.productId || 
                      body?.variables?.orderId || 
                      body?.variables?.storeId || 
                      body?.variables?.consumerId ||
                      body?.variables?.id;
    
    // 参数数据映射表
    const paramMap = {
    "67287c47e097f800076d2c77": {
        "data": {
            "product": {
                "id": "67287c47e097f800076d2c77",
                "title": "Mocha",
                "displayPrice": 25,
                "originalDisplayPrice": null,
                "markedSoldOut": false,
                "unitPrice": 25,
                "onlineUnitPrice": null,
                "inventoryType": "",
                "images": [
                    "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287c47e097f800076d2c77/bf3a71bd-cc82-4d91-e702-aa7975a16a81"
                ],
                "description": "<p><br></p>",
                "stock": 1,
                "quantityOnHand": null,
                "variations": [],
                "trackInventory": false,
                "childrenMap": [],
                "stockStatus": "notTrackInventory"
            }
        }
    },
    "67287951e097f800076d1bb5": {
        "data": {
            "product": {
                "id": "67287951e097f800076d1bb5",
                "title": "Espresso",
                "displayPrice": 8,
                "originalDisplayPrice": null,
                "markedSoldOut": false,
                "unitPrice": 8,
                "onlineUnitPrice": 8,
                "inventoryType": "",
                "images": [
                    "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287951e097f800076d1bb5/4f399064-24d5-4366-eb00-914184e88543"
                ],
                "description": "<p><br></p>",
                "stock": 1,
                "quantityOnHand": null,
                "variations": [],
                "trackInventory": false,
                "childrenMap": [],
                "stockStatus": "notTrackInventory"
            }
        }
    },
    "67287c09e097f800076d2b8d": {
        "data": {
            "product": {
                "id": "67287c09e097f800076d2b8d",
                "title": "Flat White",
                "displayPrice": 20,
                "originalDisplayPrice": null,
                "markedSoldOut": false,
                "unitPrice": 20,
                "onlineUnitPrice": null,
                "inventoryType": "",
                "images": [
                    "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287c09e097f800076d2b8d/853913f1-1a8d-4d2e-f412-9fd3aa9d9f7b"
                ],
                "description": "<p><br></p>",
                "stock": 1,
                "quantityOnHand": null,
                "variations": [],
                "trackInventory": false,
                "childrenMap": [],
                "stockStatus": "notTrackInventory"
            }
        }
    },
    "67220fa7e097f8000711b673": {
        "data": {
            "product": {
                "id": "67220fa7e097f8000711b673",
                "title": "Latte",
                "displayPrice": 12,
                "originalDisplayPrice": null,
                "markedSoldOut": false,
                "unitPrice": 12,
                "onlineUnitPrice": null,
                "inventoryType": "",
                "images": [
                    "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b673/b2b19ab9-6410-4324-b69e-394173f6c38f"
                ],
                "description": "<p><br></p>",
                "stock": 1,
                "quantityOnHand": null,
                "variations": [
                    {
                        "id": "67220fa7e097f8000711b681",
                        "name": "Temperature",
                        "variationType": "SingleChoice",
                        "allowMultiQty": false,
                        "enableSelectionAmountLimit": null,
                        "minSelectionAmount": null,
                        "maxSelectionAmount": null,
                        "isModifier": true,
                        "optionValues": [
                            {
                                "id": "67220fa7e097f8000711b682",
                                "value": "Hot",
                                "priceDiff": 0,
                                "markedSoldOut": false
                            },
                            {
                                "id": "67220fa7e097f8000711b683",
                                "value": "Cold",
                                "priceDiff": 0,
                                "markedSoldOut": false
                            }
                        ]
                    },
                    {
                        "id": "67220fa7e097f8000711b684",
                        "name": "Size",
                        "variationType": "SingleChoice",
                        "allowMultiQty": false,
                        "enableSelectionAmountLimit": null,
                        "minSelectionAmount": null,
                        "maxSelectionAmount": null,
                        "isModifier": true,
                        "optionValues": [
                            {
                                "id": "67220fa7e097f8000711b685",
                                "value": "S",
                                "priceDiff": 0,
                                "markedSoldOut": false
                            },
                            {
                                "id": "67220fa7e097f8000711b686",
                                "value": "M",
                                "priceDiff": 0,
                                "markedSoldOut": false
                            },
                            {
                                "id": "67220fa7e097f8000711b687",
                                "value": "L",
                                "priceDiff": 0,
                                "markedSoldOut": false
                            }
                        ]
                    },
                    {
                        "id": "67220fa7e097f8000711b688",
                        "name": "Add-ons",
                        "variationType": "MultipleChoice",
                        "allowMultiQty": false,
                        "enableSelectionAmountLimit": false,
                        "minSelectionAmount": 0,
                        "maxSelectionAmount": null,
                        "isModifier": true,
                        "optionValues": [
                            {
                                "id": "67220fa7e097f8000711b689",
                                "value": "Extra espresso shot",
                                "priceDiff": 0.75,
                                "markedSoldOut": false
                            },
                            {
                                "id": "67220fa7e097f8000711b68a",
                                "value": "Flavor shot",
                                "priceDiff": 0.5,
                                "markedSoldOut": false
                            },
                            {
                                "id": "67220fa7e097f8000711b68b",
                                "value": "Whipped cream topping",
                                "priceDiff": 1,
                                "markedSoldOut": false
                            }
                        ]
                    }
                ],
                "trackInventory": false,
                "childrenMap": [],
                "stockStatus": "notTrackInventory"
            }
        }
    },
    "67220fa7e097f8000711b675": {
        "data": {
            "product": {
                "id": "67220fa7e097f8000711b675",
                "title": "Ice Americano",
                "displayPrice": 10,
                "originalDisplayPrice": null,
                "markedSoldOut": false,
                "unitPrice": 10,
                "onlineUnitPrice": 10,
                "inventoryType": "",
                "images": [
                    "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b675/d13296bd-a381-4abb-bcc4-cedcfce45eef"
                ],
                "description": "<p><br></p>",
                "stock": -1,
                "quantityOnHand": 0,
                "variations": [],
                "trackInventory": true,
                "childrenMap": [],
                "stockStatus": "outOfStock"
            }
        }
    },
    "67692ad64682030007a46bf4": {
        "data": {
            "product": {
                "id": "67692ad64682030007a46bf4",
                "title": "Affogato",
                "displayPrice": 30,
                "originalDisplayPrice": null,
                "markedSoldOut": false,
                "unitPrice": 30,
                "onlineUnitPrice": 35,
                "inventoryType": "Composite",
                "images": [
                    "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67692ad64682030007a46bf4/48fdc89b-7fad-45e5-8650-d9952542c18f"
                ],
                "description": "<p><br></p>",
                "stock": 1,
                "quantityOnHand": null,
                "variations": [],
                "trackInventory": true,
                "childrenMap": [],
                "stockStatus": "notTrackInventory"
            }
        }
    },
    "676929f04682030007a4687c": {
        "data": {
            "product": {
                "id": "676929f04682030007a4687c",
                "title": "Gelato",
                "displayPrice": 20,
                "originalDisplayPrice": null,
                "markedSoldOut": false,
                "unitPrice": 20,
                "onlineUnitPrice": null,
                "inventoryType": "",
                "images": [
                    "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/676929f04682030007a4687c/afbba3f6-150d-4a16-b68d-b689b44499c8",
                    "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/676929f04682030007a4687c/cd591193-c29f-4c35-f595-24c7e095ada6"
                ],
                "description": "<p><br></p>",
                "stock": 1,
                "quantityOnHand": 1000,
                "variations": [],
                "trackInventory": true,
                "childrenMap": [],
                "stockStatus": "inStock"
            }
        }
    },
    "67220fa7e097f8000711b674": {
        "data": {
            "product": {
                "id": "67220fa7e097f8000711b674",
                "title": "Tiramisù",
                "displayPrice": 35,
                "originalDisplayPrice": null,
                "markedSoldOut": false,
                "unitPrice": 35,
                "onlineUnitPrice": 45,
                "inventoryType": "",
                "images": [
                    "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b674/379de89c-b2db-4469-b6ca-d8b0247dd087"
                ],
                "description": "<p><br></p>",
                "stock": -1,
                "quantityOnHand": 0,
                "variations": [
                    {
                        "id": "6763a937c89b5e000779a118",
                        "name": "Size",
                        "variationType": "SingleChoice",
                        "allowMultiQty": false,
                        "enableSelectionAmountLimit": null,
                        "minSelectionAmount": null,
                        "maxSelectionAmount": null,
                        "isModifier": true,
                        "optionValues": [
                            {
                                "id": "6763a937c89b5e000779a116",
                                "value": "Normal",
                                "priceDiff": 0,
                                "markedSoldOut": false
                            },
                            {
                                "id": "6763a937c89b5e000779a117",
                                "value": "Large",
                                "priceDiff": 10,
                                "markedSoldOut": false
                            }
                        ]
                    },
                    {
                        "id": "67220fa7e097f8000711b677",
                        "name": "Extra add-ons",
                        "variationType": "MultipleChoice",
                        "allowMultiQty": false,
                        "enableSelectionAmountLimit": false,
                        "minSelectionAmount": 0,
                        "maxSelectionAmount": null,
                        "isModifier": true,
                        "optionValues": [
                            {
                                "id": "67220fa7e097f8000711b678",
                                "value": "Extra patty",
                                "priceDiff": 1,
                                "markedSoldOut": false
                            }
                        ]
                    }
                ],
                "trackInventory": true,
                "childrenMap": [],
                "stockStatus": "outOfStock"
            }
        }
    }
};
    
    // 根据参数查找对应数据，找不到则返回默认数据
    const responseData = paramMap[paramValue] || paramMap['67287c47e097f800076d2c77'];
    
    return res(
      ctx.status(200),
      ctx.json(responseData)
    );
  }),

  rest.get('/api/v3/consumers/5d285b152734781c0fcadee2/unique-promos/available-count', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "availableCount": 0
    },
    "extra": null
})
    );
  }),

  rest.post('/api/cart/apply-cashback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "success": true
})
    );
  }),

  rest.get('/api/v3/offers', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": [
        {
            "appliedClientTypes": [],
            "applicableBusiness": [
                "coffee"
            ],
            "productsLimits": [],
            "id": "673c348e19d2ef543f29ed99",
            "name": "Redeem RM5 Off",
            "type": "promotion",
            "discountType": "absolute",
            "discountValue": 5,
            "validFrom": "2025-04-24T03:40:12.080Z",
            "validTo": "2025-10-21T15:59:59.999Z",
            "code": "PR1a02iy",
            "uniquePromotionCodeId": "6809b29c51dce02a63131d27",
            "minSpendAmount": 0,
            "status": "redeemed",
            "storesLimits": null,
            "generalLimits": null,
            "applyToLimits": null,
            "maxDiscountAmount": 0,
            "merchantDisplayName": "Bean"
        },
        {
            "appliedClientTypes": [],
            "applicableBusiness": [
                "coffee"
            ],
            "productsLimits": [],
            "id": "673c348e19d2ef543f29ed99",
            "name": "Redeem RM5 Off",
            "type": "promotion",
            "discountType": "absolute",
            "discountValue": 5,
            "validFrom": "2025-07-26T07:21:17.135Z",
            "validTo": "2026-01-22T15:59:59.999Z",
            "code": "PR1hwgfp",
            "uniquePromotionCodeId": "688481edb74f9ad2ac2afc9c",
            "minSpendAmount": 0,
            "status": "redeemed",
            "storesLimits": null,
            "generalLimits": null,
            "applyToLimits": null,
            "maxDiscountAmount": 0,
            "merchantDisplayName": "Bean"
        },
        {
            "appliedClientTypes": [],
            "applicableBusiness": [
                "coffee"
            ],
            "productsLimits": [],
            "id": "673c348e19d2ef09b629ed91",
            "name": "RM8 Discount Voucher",
            "type": "promotion",
            "discountType": "absolute",
            "discountValue": 8,
            "validFrom": "2025-03-04T04:53:25.511Z",
            "validTo": "2025-03-18T15:59:59.999Z",
            "code": "NM1KJfC7",
            "uniquePromotionCodeId": "67c687455b155fd655b4cd3b",
            "minSpendAmount": 39,
            "status": "expired",
            "storesLimits": null,
            "generalLimits": null,
            "applyToLimits": null,
            "maxDiscountAmount": 0,
            "merchantDisplayName": "Bean"
        },
        {
            "appliedClientTypes": [],
            "applicableBusiness": [
                "coffee"
            ],
            "productsLimits": [],
            "id": "673c375601e95800075cb596",
            "name": "Amount OFF RM10",
            "type": "promotion",
            "discountType": "absolute",
            "discountValue": 10,
            "validFrom": "2025-03-04T04:53:25.512Z",
            "validTo": "2025-03-18T15:59:59.999Z",
            "code": "TEST10oX3Oa",
            "uniquePromotionCodeId": "67c687455b155f663bb4cd3e",
            "minSpendAmount": 0,
            "status": "expired",
            "storesLimits": null,
            "generalLimits": null,
            "applyToLimits": null,
            "maxDiscountAmount": 0,
            "merchantDisplayName": "Bean"
        }
    ],
    "extra": null
})
    );
  }),

  rest.get('/api/v3/offers/673c348e19d2ef543f29ed99', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "id": "673c348e19d2ef543f29ed99",
        "applicableBusiness": [
            "coffee"
        ],
        "status": "redeemed",
        "validFrom": "2025-04-24T03:40:12.080Z",
        "validTo": "2025-10-21T15:59:59.999Z",
        "minSpendAmount": 0,
        "name": "Redeem RM5 Off",
        "code": "PR1a02iy",
        "type": "promotion",
        "discountType": "absolute",
        "discountValue": 5,
        "uniquePromotionCodeId": "6809b29c51dce02a63131d27",
        "productLimits": [],
        "storesLimits": {
            "appliedStores": [
                "All"
            ],
            "applyToOnlineStore": true
        },
        "generalLimits": {
            "appliedClientTypes": [],
            "appliedSources": [
                1,
                2,
                5,
                6,
                7,
                8
            ],
            "requireFirstPurchase": false
        },
        "applyToLimits": {
            "conditions": [],
            "minQuantity": 0,
            "maxQuantity": 0
        },
        "merchantDisplayName": "Bean"
    },
    "extra": null
})
    );
  }),

  rest.get('/api/consumers/5d285b152734781c0fcadee2/paymentMethods', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "paymentMethods": [
        {
            "id": "65b2229d9a6956f9ae0eed38",
            "provider": "Stripe",
            "cardInfo": {
                "maskedNumber": "1111",
                "expirationMonth": "12",
                "expirationYear": "2034",
                "cardType": "visa"
            },
            "cardToken": "pm_1R61VRHkStCWMYPve2kz3HuW",
            "logoUrl": "https://d320csluqc4z2b.cloudfront.net/payment-api/payment-logos/Visa.png",
            "title": "Visa",
            "subTitle": "Ending in 1111"
        }
    ]
})
    );
  }),

  rest.get('/api/transactions/851312428829293/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "status": "pendingPayment",
    "deliveryInformation": []
})
    );
  }),

  rest.get('/api/transactions/851312428829293/review', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "transaction": {
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "receiptNumber": "851312428829293",
            "business": "coffee",
            "displayBusinessName": "coffee",
            "createdTime": "2025-07-26T08:56:51.290Z",
            "total": 11.95,
            "storeId": "673d54420e5c2300079412a1",
            "tableId": null,
            "status": "accepted",
            "shippingType": "takeaway",
            "fulfillDate": "2025-07-26T08:56:51.292Z",
            "paidDate": "2025-07-26T08:57:08.626Z",
            "expectDeliveryDateFrom": null,
            "deliveryInformation": [],
            "items": [
                {
                    "id": null,
                    "discount": 8.25,
                    "quantity": 1,
                    "productId": "676929f04682030007a4687c",
                    "tax": 0,
                    "total": 11.95,
                    "title": "Gelato",
                    "subTotal": 20.2,
                    "unitPrice": 20
                }
            ],
            "store": {
                "city": "Butterworth",
                "country": "MALAYSIA",
                "state": "Pulau Pinang",
                "street1": "6, Jalan Pantai",
                "street2": "",
                "name": "Coffee Bean (Webstore)",
                "beepBrandName": "Bean",
                "beepStoreNameLocationSuffix": "Cafe (Webstore)",
                "storeDisplayName": "Coffee Bean (Webstore)"
            }
        },
        "review": {
            "reviewed": false,
            "reviewable": false,
            "isExpired": false,
            "supportable": true,
            "reviewContent": null,
            "googleReviewUrl": "https://search.google.com/local/writereview?placeid=ChIJjzrTkhvESjARS5b43gZcDUE"
        }
    },
    "extra": null
})
    );
  }),

  rest.get('/api/ordering/stores/673d54420e5c2300079412a1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "redirectTo": "U2FsdGVkX1%2FMzVGdWd%2BcPoFRQKwa4L%2Fw6BTcUr%2FZAz0W2v26H857t8o476KCHGFW"
})
    );
  }),

  rest.post('/api/v3/transactions/851312428829293/rewards', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "enableCashback": true,
        "membershipEnabled": true,
        "pointsEnabled": true,
        "transactionValidation": {
            "status": "Success"
        },
        "joinMembershipResult": {
            "success": true,
            "isNewMember": false
        },
        "points": {
            "status": "Failed_ReachDailyLimit",
            "amount": 0
        },
        "cashback": {
            "amount": 0.59,
            "status": "Claimed_Repeat"
        }
    },
    "extra": null
})
    );
  }),

  rest.get('/api/v3/merchants/coffee/campaigns/birthday-campaign', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "code": 0,
        "isActivated": true
    },
    "extra": null
})
    );
  }),

  rest.get('/api/v3/consumers/5d285b152734781c0fcadee2/unique-promos', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": [
        {
            "type": "promotion",
            "id": "673c348e19d2ef543f29ed99",
            "discountType": "absolute",
            "discountValue": 5,
            "name": "Redeem RM5 Off",
            "appliedSources": [
                "Pickup",
                "Delivery",
                "Takeaway",
                "Dine-in"
            ],
            "code": "PR1",
            "isExpired": false,
            "minLeftTillExpire": 125703,
            "validFrom": "2025-04-24T03:40:12.080Z",
            "validTo": "2025-10-21T15:59:59.999Z",
            "status": "redeemed",
            "applicableBusiness": [
                "coffee"
            ],
            "minSpendAmount": 0,
            "uniquePromotionId": "6809b29c51dce02a63131d27",
            "uniquePromotionCodeId": "6809b29c51dce02a63131d27"
        },
        {
            "type": "promotion",
            "id": "673c348e19d2ef543f29ed99",
            "discountType": "absolute",
            "discountValue": 5,
            "name": "Redeem RM5 Off",
            "appliedSources": [
                "Pickup",
                "Delivery",
                "Takeaway",
                "Dine-in"
            ],
            "code": "PR1",
            "isExpired": false,
            "minLeftTillExpire": 259623,
            "validFrom": "2025-07-26T07:21:17.135Z",
            "validTo": "2026-01-22T15:59:59.999Z",
            "status": "redeemed",
            "applicableBusiness": [
                "coffee"
            ],
            "minSpendAmount": 0,
            "uniquePromotionId": "688481edb74f9ad2ac2afc9c",
            "uniquePromotionCodeId": "688481edb74f9ad2ac2afc9c"
        },
        {
            "type": "promotion",
            "id": "673c375601e95800075cb596",
            "discountType": "absolute",
            "discountValue": 10,
            "name": "Amount OFF RM10",
            "appliedSources": [
                "Delivery",
                "Pickup",
                "Takeaway",
                "Dine-in"
            ],
            "code": "TEST10",
            "isExpired": true,
            "minLeftTillExpire": -186777,
            "validFrom": "2025-03-04T04:53:25.512Z",
            "validTo": "2025-03-18T15:59:59.999Z",
            "status": "expired",
            "applicableBusiness": [
                "coffee"
            ],
            "minSpendAmount": 0,
            "uniquePromotionId": "67c687455b155f663bb4cd3e",
            "uniquePromotionCodeId": "67c687455b155f663bb4cd3e"
        },
        {
            "type": "promotion",
            "id": "673c348e19d2ef09b629ed91",
            "discountType": "absolute",
            "discountValue": 8,
            "name": "RM8 Discount Voucher",
            "appliedSources": [
                "Pickup",
                "Delivery",
                "Takeaway",
                "Dine-in"
            ],
            "code": "NM1",
            "isExpired": true,
            "minLeftTillExpire": -186777,
            "validFrom": "2025-03-04T04:53:25.511Z",
            "validTo": "2025-03-18T15:59:59.999Z",
            "status": "expired",
            "applicableBusiness": [
                "coffee"
            ],
            "minSpendAmount": 39,
            "uniquePromotionId": "67c687455b155fd655b4cd3b",
            "uniquePromotionCodeId": "67c687455b155fd655b4cd3b"
        }
    ],
    "extra": null
})
    );
  }),

  rest.get('/api/v3/memberships', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "businessLogo": "https://d16kpilgrxu9w6.cloudfront.net/coffee/online-store/appearance/image/logo/logo_fcd4e7ea-6946-4f33-d2e0-ddd8e5e1f4cb",
        "businessName": "Bean",
        "logo": "https://d16kpilgrxu9w6.cloudfront.net/coffee/online-store/appearance/image/logo/logo_fcd4e7ea-6946-4f33-d2e0-ddd8e5e1f4cb",
        "displayName": "Bean",
        "country": "MY",
        "membershipEnabled": true,
        "enableCashback": true,
        "businessMembershipTiers": [
            {
                "id": "673c348ec30f76e0759f4c6d",
                "level": 1,
                "name": "member",
                "spendingThreshold": 0,
                "pointsThreshold": 0,
                "pointRate": 1000,
                "benefits": [
                    "Earn 10 Points for every RM1 spent",
                    "Get 5% Cashback for each transaction",
                    "RM8 cash voucher for New Members",
                    "Use Points to redeem freebies and discounts!"
                ]
            },
            {
                "id": "673c348ec30f76fda59f4c6e",
                "level": 2,
                "name": "silver",
                "spendingThreshold": 0,
                "pointsThreshold": 100,
                "pointRate": 2000,
                "benefits": [
                    "Earn 20 Points for every RM1 spent",
                    "Get 5% Cashback for each transaction",
                    "Use Points to redeem freebies and discounts!"
                ]
            },
            {
                "id": "673c348ec30f7604a39f4c6f",
                "level": 3,
                "name": "gold",
                "spendingThreshold": 0,
                "pointsThreshold": 500,
                "pointRate": 3000,
                "benefits": [
                    "Earn 30 Points for every RM1 spent",
                    "Get 5% Cashback for each transaction",
                    "Use Points to redeem freebies and discounts!"
                ]
            },
            {
                "id": "673c348ec30f7680c89f4c70",
                "level": 4,
                "name": "platinum",
                "spendingThreshold": 0,
                "pointsThreshold": 1200,
                "pointRate": 5000,
                "benefits": [
                    "Earn 50 Points for every RM1 spent",
                    "Get 5% Cashback for each transaction",
                    "Use Points to redeem freebies and discounts!"
                ]
            }
        ]
    },
    "extra": null
})
    );
  }),

  rest.get('/api/v3/consumers/5d285b152734781c0fcadee2/unique-promos/banners', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": [],
    "extra": null
})
    );
  }),

  rest.get('/api/v3/points/rewards', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": [
        {
            "type": "promotion",
            "id": "673c348e19d2ef543f29ed99",
            "name": "Redeem RM5 Off",
            "code": "PR1",
            "discountType": "absolute",
            "discountValue": 5,
            "validFrom": "",
            "validTo": "",
            "minSpendAmount": 0,
            "costOfPoints": 1,
            "redeemedStatus": "available",
            "rewardSettingId": "673c348e19d2efca1429ed9d"
        }
    ],
    "extra": null
})
    );
  }),

  rest.get('/api/v3/merchants/coffee/rewards-settings/customize', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "enableCashback": true,
        "cashbackRate": 0.05,
        "membershipEnabled": true,
        "pointsEnabled": true,
        "pointRate": 50,
        "enableLoyalty": true,
        "loyaltyRate": 0.05
    },
    "extra": null
})
    );
  }),

  rest.get('/api/v3/loyalty-change-logs', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": [
        {
            "type": "earned",
            "changeAmount": 0.59,
            "eventTime": "2025-07-26T08:57:09.257Z"
        },
        {
            "type": "expense",
            "changeAmount": -8.25,
            "eventTime": "2025-07-26T08:57:09.257Z"
        },
        {
            "type": "earned",
            "changeAmount": 1.26,
            "eventTime": "2025-07-26T08:50:40.564Z"
        },
        {
            "type": "earned",
            "changeAmount": 2.8,
            "eventTime": "2025-07-26T08:25:08.164Z"
        },
        {
            "type": "earned",
            "changeAmount": 0.92,
            "eventTime": "2025-07-26T07:08:04.961Z"
        },
        {
            "type": "earned",
            "changeAmount": 1.25,
            "eventTime": "2025-06-30T08:01:21.272Z"
        },
        {
            "type": "earned",
            "changeAmount": 2.02,
            "eventTime": "2025-06-30T07:20:47.876Z"
        }
    ],
    "extra": null
})
    );
  }),

  rest.get('/api/ordering/stores/67220fa7e097f8000711b668', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "redirectTo": "U2FsdGVkX19ISyTnaZOPUBt61bmh16FtonO5MHrw068uvFgERg8SlvT52jzQ20%2F1"
})
    );
  }),

  rest.get('/api/consumers/5d285b152734781c0fcadee2/store/67220fa7e097f8000711b668/address/6867686997bd965f597f6517', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "_id": "6867686997bd965f597f6517",
    "contactName": "Ttest2",
    "contactNumber": "+60123456789",
    "address": "Level 2, Sentul, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
    "addressName": "Test Address 2",
    "comments": "test",
    "addressDetails": "Level 2",
    "deliveryTo": "Sentul, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
    "location": {
        "longitude": 101.6820313,
        "latitude": 3.2066139
    },
    "city": "Kuala Lumpur",
    "countryCode": "MY",
    "postCode": "47800",
    "availableStatus": true
})
    );
  })
];
