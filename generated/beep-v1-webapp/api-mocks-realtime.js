/**
 * 实时捕获的 API Mock - 基于真实的 beep-v1-webapp API 响应
 * 自动生成时间: 2025-07-28T03:20:39.113Z
 * 已捕获 11 个端点，共 22 次调用
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
                        "quantityOnHand": 987,
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
                        "quantityOnHand": 987,
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
                    "hash": "U2FsdGVkX19DQRAZo6hT4cHD8PQc7M%2F3LyheyRpd5GbhLqqzeTnufXB5Gr9i8Qc5"
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
                    "hash": "U2FsdGVkX1%2BWEhJ2rB3pxrYvz2ytws0KPltNpMdmiF9xE%2BvBMpta2im4JfWkbbBJ"
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
                    "hash": "U2FsdGVkX1%2BmPmn3TXeDisCoHZOpZY54ord9%2FLsoUqIXI28MUpTEh3cm5Yj7b5ib"
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
                    "hash": "U2FsdGVkX1%2BpI3xowGFb6nD5CUMlCZKNvDStvpqgOnnOI%2BPist8ZH8Xg7ackqlVH"
                }
            ]
        }
    }
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
            "lastPurchaseDate": "2025-07-27T11:34:26.890+08:00",
            "totalSpent": 263.15,
            "totalTransactions": 9
        },
        "storeCreditInfo": {
            "storeCreditsBalance": 1.6099999999999999,
            "storeCreditsSpent": 8.25,
            "cashbackClaimCount": 1,
            "lastCashbackClaimDate": "2025-07-27T11:34:35.801+08:00",
            "cashbackExpirationDate": "2025-10-26T00:00:00.000+08:00"
        },
        "createdTime": "2025-02-25T14:56:30.462+08:00",
        "modifiedTime": "2025-07-28T00:34:35.372+08:00",
        "source": "BeepQR",
        "availablePointsBalance": 8798,
        "customerTier": {
            "id": "673c348ec30f7680c89f4c70",
            "name": "platinum",
            "level": 4,
            "totalSpent": 263.15,
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
  }),

  rest.get('/api/cart', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
})
    );
  })
];
