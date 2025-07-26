/**
 * 实时捕获的 API Mock - 基于真实的 beep-v1-webapp API 响应
 * 自动生成时间: 2025-07-26T07:21:59.519Z
 * 已捕获 54 个端点，共 240 次调用
 * 
 * 使用方法:
 * import { handlers } from './api-mocks-realtime';
 * const worker = setupWorker(...handlers);
 */

import { rest } from 'msw';

export const handlers = [
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
            "fullName": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
            "coords": {
                "lat": 3.1616217,
                "lng": 101.6143277
            },
            "city": "PJ",
            "postCode": "47800",
            "countryCode": "MY"
        }
    },
    "extra": null
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
                        "maxPreOrdersPerTimeSlot": null
                    },
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Pay First)",
                    "hash": "U2FsdGVkX19KwWCUaS2txejjrhtpaULikG7u3pBPGsbMJqH0LbVkmdb2lt2KfQpX"
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
                        "maxPreOrdersPerTimeSlot": null
                    },
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Pay Later)",
                    "hash": "U2FsdGVkX19qX2UcaK75du%2BIqutB8qIT4MsntlYE15aVcMAQaQ2CcjKAxD6OnDVd"
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
                        "maxPreOrdersPerTimeSlot": null
                    },
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Webstore)",
                    "hash": "U2FsdGVkX183gd0SPT4zOMLoOXndXuf9ShrxwH48PlZWvDAmTdSJwkkce9Z2wre2"
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
                        "maxPreOrdersPerTimeSlot": null
                    },
                    "beepBrandName": "Bean",
                    "beepStoreNameLocationSuffix": "Cafe (Pay At Count Only)",
                    "hash": "U2FsdGVkX1%2FNvmTPn127foRhhyoYdtFW8BcmbJ95Y7wWqYbiuynB%2BX3pBvrh4GYZ"
                }
            ]
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

  rest.get('/api/ordering/stores/67220fa7e097f8000711b668', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "redirectTo": "U2FsdGVkX1%2BhwhVxkN7tIIQXLCcNwR2ZasYhDkpyMu90zD9sKboHmk0B3rLMrCdy"
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
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [],
                        "isFeaturedProduct": true,
                        "stockStatus": "notTrackInventory",
                        "descriptionPlainText": ""
                    },
                    {
                        "id": "67220fa7e097f8000711b676",
                        "title": "Coffe Bean (180g)",
                        "displayPrice": 10,
                        "originalDisplayPrice": 79,
                        "trackInventory": true,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b676/246e186a-4e76-435b-e6bf-74ded8ba5b95",
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b676/3293b933-3660-4b00-8a45-12e87d413331"
                        ],
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [],
                        "isFeaturedProduct": true,
                        "stockStatus": "inStock",
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
                "products": [
                    {
                        "id": "67220fa7e097f8000711b676",
                        "title": "Coffe Bean (180g)",
                        "displayPrice": 10,
                        "originalDisplayPrice": 79,
                        "trackInventory": true,
                        "images": [
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b676/246e186a-4e76-435b-e6bf-74ded8ba5b95",
                            "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67220fa7e097f8000711b676/3293b933-3660-4b00-8a45-12e87d413331"
                        ],
                        "markedSoldOut": false,
                        "inventoryType": "",
                        "variations": [],
                        "isFeaturedProduct": true,
                        "stockStatus": "inStock",
                        "descriptionPlainText": ""
                    }
                ]
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

  rest.get('/api/cart', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "total": 18.5,
    "subtotal": 8,
    "count": 1,
    "discount": 5,
    "tax": 0,
    "pax": 0,
    "serviceCharge": 0,
    "serviceChargeTax": 0,
    "shippingFee": 15.5,
    "shippingFeeDiscount": 0,
    "takeawayCharges": 0,
    "fixedFee": 0,
    "loyaltyDiscounts": [],
    "displayAvailableCashback": 3,
    "applyCashback": false,
    "items": [
        {
            "id": "e487d0b3d7907c3e1942a10d387b65a0",
            "productId": "67287951e097f800076d1bb5",
            "parentProductId": null,
            "title": "Espresso",
            "itemType": null,
            "total": 3,
            "taxCode": "67220fa7e097f8000711b67b",
            "taxRate": 0,
            "serviceChargeRate": 0,
            "variationTexts": [],
            "variations": [],
            "trackInventory": false,
            "markedSoldOut": false,
            "inventoryType": "",
            "originalDisplayPrice": 8,
            "displayPrice": 8,
            "quantity": 1,
            "image": "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287951e097f800076d1bb5/4f399064-24d5-4366-eb00-914184e88543",
            "comments": "",
            "isTakeaway": false,
            "takeawayCharge": 0,
            "stockStatus": "notTrackInventory"
        }
    ],
    "unavailableItems": [],
    "displayPromotions": [
        {
            "discount": 5,
            "displayDiscount": 5,
            "discountType": "absolute",
            "promotionCode": "PR1",
            "promotionName": "Redeem RM5 Off",
            "status": "valid"
        }
    ],
    "voucher": null,
    "cashback": 3
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
        "alcoholConsentTime": "2025-07-22T03:22:13.470Z"
    },
    "extra": null
})
    );
  }),

  rest.post('/api/v3/otp', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "status": "SUCCESS"
    },
    "extra": null
})
    );
  }),

  rest.post('/api/v3/otp/check-phone', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "supportWhatsApp": true
    },
    "extra": null
})
    );
  }),

  rest.post('/api/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "webToken": "uxxlt3je_CIT-GRQL1ou1wZWPBDkCdCA",
    "consumerId": "5d285b152734781c0fcadee2",
    "user": {
        "phone": "+60123456789",
        "firstName": "Beep",
        "lastName": "User test17",
        "email": "louis.lei@storehub.com",
        "birthday": "1991-02-25T00:00:00.000Z",
        "isFirstLogin": false
    }
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
            "lastPurchaseDate": "2025-07-26T15:07:59.688+08:00",
            "totalSpent": 149.5,
            "totalTransactions": 5
        },
        "storeCreditInfo": {
            "storeCreditsBalance": 4.19,
            "storeCreditsSpent": 0,
            "cashbackClaimCount": 1,
            "lastCashbackClaimDate": "2025-07-26T15:08:04.961+08:00",
            "cashbackExpirationDate": "2025-10-25T00:00:00.000+08:00"
        },
        "createdTime": "2025-02-25T14:56:30.462+08:00",
        "modifiedTime": "2025-07-26T15:08:05.009+08:00",
        "source": "BeepQR",
        "availablePointsBalance": 3748,
        "customerTier": {
            "id": "673c348ec30f7680c89f4c70",
            "name": "platinum",
            "level": 4,
            "totalSpent": 131,
            "startTime": "2025-03-04T12:53:25.216+08:00",
            "nextReviewTime": "2025-10-01T00:00:00.000+08:00",
            "pointsTotalEarned": 3750,
            "isNewMember": false
        },
        "rewardsTotal": 1
    },
    "extra": null
})
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
        "availableCount": 1
    },
    "extra": null
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
            "status": "active",
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
        "status": "active",
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

  rest.post('/api/cart/applyPromoCode', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "success": true
})
    );
  }),

  rest.get('/api/cart/checkInventory', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "allInStock": true
})
    );
  }),

  rest.get('/api/consumers/5d285b152734781c0fcadee2/store/67220fa7e097f8000711b668/address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
    {
        "_id": "6867686997bd965f597f6517",
        "contactName": "Ttest2",
        "contactNumber": "+60123456789",
        "address": "Level 2, KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "addressName": "Test Address 2",
        "comments": "test",
        "addressDetails": "Level 2",
        "deliveryTo": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6143277,
            "latitude": 3.1616217
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47800",
        "availableStatus": true
    },
    {
        "_id": "6867677697bd96cac67f64e0",
        "contactName": "Ttest",
        "contactNumber": "+60123456789",
        "address": "Level 2, KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "addressName": "Test Address",
        "comments": "test",
        "addressDetails": "Level 2",
        "deliveryTo": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6143277,
            "latitude": 3.1616217
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47800",
        "availableStatus": true
    },
    {
        "_id": "6809b259f414fa75e98a179d",
        "contactName": "Customer on test17",
        "contactNumber": "+60123456789",
        "address": "Level 7, KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "addressName": "KYM",
        "comments": "Drive safe :p",
        "addressDetails": "Level 7",
        "deliveryTo": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6143277,
            "latitude": 3.1616217
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47800",
        "availableStatus": true
    },
    {
        "_id": "65bc83c69f06d43bbd89b626",
        "contactName": "Customer on test17",
        "contactNumber": "+60123456789",
        "address": "Level 7, KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "addressName": "KYM",
        "comments": "Drive safe :p",
        "addressDetails": "Level 7",
        "deliveryTo": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6143277,
            "latitude": 3.1616217
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47800",
        "availableStatus": true
    },
    {
        "_id": "65268504e0b15b92faccb3ab",
        "contactName": "test",
        "contactNumber": "+60123456789",
        "address": "1, 吉隆坡, 马来西亚",
        "addressName": "111",
        "comments": "",
        "addressDetails": "1",
        "deliveryTo": "吉隆坡, 马来西亚",
        "location": {
            "longitude": 101.6840589,
            "latitude": 3.1319197
        },
        "city": "吉隆坡",
        "countryCode": "MY",
        "postCode": "50470",
        "availableStatus": true
    },
    {
        "_id": "611e72823332c880e7a5866b",
        "contactName": "My name woo",
        "contactNumber": "+60123456789",
        "address": "2, SS 2, Petaling Jaya, Selangor, Malaysia",
        "addressName": "No 1",
        "comments": "Drive safe :p",
        "addressDetails": "2",
        "deliveryTo": "SS 2, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6222681,
            "latitude": 3.12026
        },
        "city": "",
        "countryCode": "MY",
        "postCode": "47300",
        "availableStatus": true
    },
    {
        "_id": "611df23d3332c818dca5451c",
        "contactName": null,
        "contactNumber": null,
        "address": "1, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "addressName": "1",
        "comments": "1",
        "addressDetails": "1",
        "deliveryTo": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "location": {
            "longitude": 101.686855,
            "latitude": 3.139003
        },
        "city": "",
        "countryCode": "MY",
        "postCode": "50480",
        "availableStatus": true
    },
    {
        "_id": "611debd23332c8ca8aa4dbd4",
        "contactName": null,
        "contactNumber": null,
        "address": "5, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "addressName": "5",
        "comments": "4",
        "addressDetails": "5",
        "deliveryTo": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "location": {
            "longitude": 101.686855,
            "latitude": 3.139003
        },
        "city": "",
        "countryCode": "MY",
        "postCode": "50480",
        "availableStatus": true
    },
    {
        "_id": "611dc6373332c8b9ada27210",
        "contactName": null,
        "contactNumber": null,
        "address": "1, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "addressName": "1",
        "comments": "1",
        "addressDetails": "1",
        "deliveryTo": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "location": {
            "longitude": 101.686855,
            "latitude": 3.139003
        },
        "city": "",
        "countryCode": "MY",
        "postCode": "50480",
        "availableStatus": true
    },
    {
        "_id": "611c8b8265b32328f679aa01",
        "contactName": null,
        "contactNumber": null,
        "address": "11, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "addressName": "work",
        "comments": "ww",
        "addressDetails": "11",
        "deliveryTo": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "location": {
            "longitude": 101.686855,
            "latitude": 3.139003
        },
        "city": "",
        "countryCode": "MY",
        "postCode": null,
        "availableStatus": true
    },
    {
        "_id": "6119eeb97a2ad05a7a848df6",
        "contactName": "test",
        "contactNumber": "+60123456789",
        "address": "12, SS2, Petaling Jaya, Selangor, Malaysia",
        "addressName": "Name",
        "comments": "Hi driver",
        "addressDetails": "12",
        "deliveryTo": "SS2, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6222681,
            "latitude": 3.12026
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47300",
        "availableStatus": true
    },
    {
        "_id": "6112527fb3f5cb1a62cf306c",
        "contactName": null,
        "contactNumber": null,
        "address": "1111, SS2, Petaling Jaya, Selangor, Malaysia",
        "addressName": "111111",
        "comments": "11111",
        "addressDetails": "1111",
        "deliveryTo": "SS2, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6222681,
            "latitude": 3.12026
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47300",
        "availableStatus": true
    },
    {
        "_id": "60f6905872b0059dcaed301b",
        "contactName": null,
        "contactNumber": null,
        "address": "11, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "addressName": "11",
        "comments": "",
        "addressDetails": "11",
        "deliveryTo": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "location": {
            "longitude": 101.686855,
            "latitude": 3.139003
        },
        "city": "Kuala Lumpur",
        "countryCode": "MY",
        "postCode": "50480",
        "availableStatus": true
    },
    {
        "_id": "64dd8ec925b7c9e87d309b8d",
        "contactName": "test",
        "contactNumber": "+60123456789",
        "address": "Level 7, Manila, Metro Manila, Philippines",
        "addressName": "Testing",
        "comments": "",
        "addressDetails": "Level 7",
        "deliveryTo": "Manila, Metro Manila, Philippines",
        "location": {
            "longitude": 120.9842195,
            "latitude": 14.5995124
        },
        "city": "Manila",
        "countryCode": "PH",
        "postCode": "1001",
        "availableStatus": false
    },
    {
        "_id": "62e22f8c239fbc3e5f29eefe",
        "contactName": "test",
        "contactNumber": "+60123456789",
        "address": "H, Manila International Airport (MNL), Pasay, Metro Manila, Philippines",
        "addressName": "Test",
        "comments": "",
        "addressDetails": "H",
        "deliveryTo": "Manila International Airport (MNL), Pasay, Metro Manila, Philippines",
        "location": {
            "longitude": 121.016508,
            "latitude": 14.5122739
        },
        "city": "Pasay",
        "countryCode": "PH",
        "postCode": "1300",
        "availableStatus": false
    }
])
    );
  }),

  rest.post('/api/v3/storage/selected-address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "success": true
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

  rest.post('/api/gql/CreateOrder', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "data": {
        "orders": [
            {
                "id": "15c08187-b918-49e5-9515-8ba423b37255",
                "pax": 1,
                "total": 18.5,
                "orderId": "851318305909420",
                "status": "created",
                "tableId": null,
                "pickUpId": "P6-0001",
                "storeId": "67220fa7e097f8000711b668",
                "isPreOrder": true,
                "expectDeliveryDateFrom": "2025-07-28T11:00:00+08:00",
                "paymentMethod": "Online"
            }
        ]
    },
    "error": null
})
    );
  }),

  rest.get('/api/transactions/851318305909420/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "status": "pendingPayment",
    "deliveryInformation": [
        {
            "useStorehubLogistics": true
        }
    ]
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
    "cashback": "0.92",
    "defaultLoyaltyRatio": 20,
    "displayBusinessName": "coffee",
    "country": "MY",
    "currency": "MYR",
    "store": {
        "country": "MY",
        "city": "Kuala Lumpur"
    },
    "locale": "MS-MY",
    "currencySymbol": "RM"
})
    );
  }),

  rest.post('/api/gql/Order', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "data": {
        "order": {
            "business": "coffee",
            "tax": 0,
            "createdTime": "2025-07-26T15:07:59+08:00",
            "orderId": "851318305909420",
            "status": "accepted",
            "productsManualDiscount": null,
            "subtotal": 8,
            "paymentMethod": "Online",
            "roundedAmount": 0,
            "total": 18.5,
            "storeId": "67220fa7e097f8000711b668",
            "tableId": null,
            "pickUpId": "P6-0001",
            "serviceCharge": 0,
            "shippingType": "delivery",
            "shippingFee": 15.5,
            "shippingFeeDiscount": 0,
            "isPreOrder": true,
            "change2Pickup": false,
            "isBeepCancellableOrder": true,
            "originalShippingType": null,
            "expectDeliveryDateFrom": "2025-07-28T11:00:00+08:00",
            "expectDeliveryDateTo": "2025-07-28T12:00:00+08:00",
            "fulfillDate": "2025-07-28T11:00:00+08:00",
            "delayReason": null,
            "delayDetail": null,
            "contactDetail": {
                "email": null
            },
            "deliveryInformation": [
                {
                    "courier": "",
                    "driverPhone": null,
                    "shippingFee": 15.5,
                    "trackingId": "",
                    "trackingUrl": null,
                    "comments": "test",
                    "useStorehubLogistics": true,
                    "address": {
                        "name": "Ttest2",
                        "phone": "+60123456789",
                        "address": "Level 2, KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
                        "deliveryTo": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
                        "addressDetails": "Level 2",
                        "city": "PJ",
                        "country": "MY",
                        "state": null,
                        "postCode": "47800",
                        "companyName": null,
                        "location": {
                            "longitude": 101.6143277,
                            "latitude": 3.1616217
                        }
                    },
                    "deliveryMethodInfo": {
                        "shippingZoneName": "Default Beep Delivery Zone"
                    },
                    "bestLastMileETA": null,
                    "worstLastMileETA": null
                }
            ],
            "storeInfo": {
                "name": "Coffee's Cafe (Pay First)",
                "phone": "+60165000000",
                "street1": "Kuala Lumpur City Centre",
                "street2": "",
                "city": "Kuala Lumpur",
                "state": "Wilayah Persekutuan Kuala Lumpur",
                "country": "MY",
                "location": {
                    "longitude": 101.7121664,
                    "latitude": 3.158248200000001
                },
                "countryCode": "MY",
                "beepBrandName": "Bean",
                "beepStoreNameLocationSuffix": "Cafe (Pay First)",
                "isLowestPrice": false
            },
            "logs": [
                {
                    "receiptNumber": "851318305909420",
                    "time": "2025-07-26T07:08:04.482Z",
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
                    "receiptNumber": "851318305909420",
                    "time": "2025-07-26T07:08:03.986Z",
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
                    "receiptNumber": "851318305909420",
                    "time": "2025-07-26T07:08:00.144Z",
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
                    "id": "68847ecf1b191144d78fe12f",
                    "title": "Espresso",
                    "productId": "67287951e097f800076d1bb5",
                    "quantity": 1,
                    "unitPrice": 8,
                    "image": "https://d16kpilgrxu9w6.cloudfront.net/coffee/product/67287951e097f800076d1bb5/4f399064-24d5-4366-eb00-914184e88543",
                    "variationTexts": [],
                    "displayPrice": 8,
                    "itemType": null,
                    "isTakeaway": false,
                    "takeawayCharge": 0
                }
            ],
            "appliedVoucher": null,
            "createdVoucherCodes": [],
            "displayPromotions": [
                {
                    "promotionCode": "PR1",
                    "promotionName": "Redeem RM5 Off",
                    "discountType": "absolute",
                    "discount": 5,
                    "shippingFeeDiscount": 0,
                    "displayDiscount": 5
                }
            ],
            "createdVouchers": [],
            "takeawayCharges": 0,
            "fixedFee": 0,
            "isPayLater": false,
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "eInvoiceRelatedInfo": {
                "linkType": "notSupported",
                "link": null
            },
            "paidTime": "2025-07-26T07:08:03.986Z",
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
})
    );
  }),

  rest.get('/api/transactions/851318305909420/review', (req, res, ctx) => {
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
            "receiptNumber": "851318305909420",
            "business": "coffee",
            "displayBusinessName": "coffee",
            "createdTime": "2025-07-26T07:07:59.688Z",
            "total": 18.5,
            "storeId": "67220fa7e097f8000711b668",
            "tableId": null,
            "status": "accepted",
            "shippingType": "delivery",
            "fulfillDate": "2025-07-28T03:00:00.000Z",
            "paidDate": "2025-07-26T07:08:03.961Z",
            "expectDeliveryDateFrom": "2025-07-28T03:00:00.000Z",
            "deliveryInformation": [
                {
                    "useStorehubLogistics": true,
                    "bestLastMileETA": null,
                    "worstLastMileETA": null
                }
            ],
            "items": [
                {
                    "id": null,
                    "discount": 5,
                    "quantity": 1,
                    "productId": "67287951e097f800076d1bb5",
                    "tax": 0,
                    "total": 3,
                    "title": "Espresso",
                    "subTotal": 8,
                    "unitPrice": 8
                }
            ],
            "store": {
                "city": "Kuala Lumpur",
                "country": "MY",
                "state": "Wilayah Persekutuan Kuala Lumpur",
                "street1": "Kuala Lumpur City Centre",
                "street2": "",
                "name": "Coffee's Cafe (Pay First)",
                "beepBrandName": "Bean",
                "beepStoreNameLocationSuffix": "Cafe (Pay First)",
                "storeDisplayName": "Coffee's Cafe (Pay First)"
            }
        },
        "review": {
            "reviewed": false,
            "reviewable": false,
            "isExpired": false,
            "supportable": false,
            "reviewContent": null,
            "googleReviewUrl": "https://search.google.com/local/writereview?placeid=ChIJH5xmLdE3zDERKa4a_IywVck"
        }
    },
    "extra": null
})
    );
  }),

  rest.post('/api/v3/transactions/851318305909420/rewards', (req, res, ctx) => {
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
            "status": "Failed_DuplicateClaim",
            "amount": 900
        },
        "cashback": {
            "amount": 0.92,
            "status": "Claimed_Repeat"
        }
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
    "address": "Level 2, KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
    "addressName": "Test Address 2",
    "comments": "test",
    "addressDetails": "Level 2",
    "deliveryTo": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
    "location": {
        "longitude": 101.6143277,
        "latitude": 3.1616217
    },
    "city": "PJ",
    "countryCode": "MY",
    "postCode": "47800",
    "availableStatus": true
})
    );
  }),

  rest.get('/api/stores/collections', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "displayTypeOrder": [
        "Carrousel"
    ],
    "collections": {
        "Icon": [],
        "Banner": [],
        "Carrousel": [
            {
                "beepCollectionId": "37eb0cb2-481b-4b7a-b849-e0e2182ae737",
                "urlPath": "homepage-revamp-test",
                "displayType": "Carrousel",
                "image": "https://d16kpilgrxu9w6.cloudfront.net/beepCollection/9e95432a-f83b-44d1-9d47-99786d48f3ce/20210823104750-Breakfast-brunch-banner.jpg",
                "name": "All Day Breakfast & Brunch 25% OFF! All Can Eat Everyday.",
                "status": "Live",
                "shippingType": [
                    "delivery",
                    "pickup"
                ],
                "tags": [
                    "Keto",
                    "Korean",
                    "Japanese",
                    "Asian",
                    "Fusion",
                    "German",
                    "Cookies",
                    "Macarons",
                    "Brownies",
                    "Cheesecake",
                    "Pastries",
                    "Milkshake",
                    "Chocolate"
                ],
                "freeShipping": null,
                "cashbackEnabled": null,
                "stores": [
                    {
                        "id": "60a5da361f9af100078c31a6",
                        "business": "justcoffee",
                        "name": "Justcoffee",
                        "storeDisplayName": "JUSTKOPI - Sqwhere - Justcoffee",
                        "avatar": "https://d16kpilgrxu9w6.cloudfront.net/justcoffee/beep/logo/f741fe98-461c-44ef-b42d-615d0fb10171",
                        "hasBeepProfileImage": true,
                        "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/justcoffee/product/60a5dace1f9af100078c31d5/32f42fb0-0c4f-44ab-b695-b756e313c143",
                        "street1": "Kuala Lumpur City Centre",
                        "street2": "",
                        "city": "Kuala Lumpur",
                        "state": "Wilayah Persekutuan Kuala Lumpur",
                        "country": "MY",
                        "deliveryFee": 0,
                        "minimumConsumption": 0,
                        "geoDistance": 0,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeTo": "24:00",
                        "validTimeFrom": "08:30",
                        "currency": "MYR",
                        "currencySymbol": "RM",
                        "countryCode": "MY",
                        "locale": "MS-MY",
                        "deliveryRadius": 30,
                        "isOpen": true,
                        "enableFreeShipping": false,
                        "minimumSpendForFreeDelivery": null,
                        "enableCashback": false,
                        "cashbackRate": 0,
                        "enablePreOrder": true,
                        "products": [],
                        "productCount": 0,
                        "searchingTags": [
                            "Western",
                            "Korean",
                            "Asian",
                            "Street Food",
                            "Taiwanese"
                        ],
                        "fulfillmentOptions": [
                            "Delivery",
                            "Pickup"
                        ],
                        "reviewInfo": {
                            "ratingCount": 16,
                            "rating": "3.9",
                            "priceLevel": null
                        },
                        "storePromoTagInfos": [
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "100% OFF",
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
                                ]
                            }
                        ],
                        "isOutOfDeliveryRange": false,
                        "h": "U2FsdGVkX1%2BRzMr9arK8zVOwMbiFXl5eDtYxFu2uHAHjWCSJDK801HTYWOO3yafl",
                        "promoTag": "100% OFF",
                        "storePromoTags": [
                            "100% OFF",
                            "100% OFF"
                        ],
                        "isLowestPrice": true,
                        "showFreeDeliveryTag": false,
                        "shippingType": "delivery"
                    },
                    {
                        "id": "5e3bc2ac07b6c9000646b1ad",
                        "business": "storehubyougaga",
                        "name": "1",
                        "storeDisplayName": "yougaga - One",
                        "avatar": "https://d16kpilgrxu9w6.cloudfront.net/storehubyougaga/beep/logo/dbea75c8-7607-468d-b2e3-a15ddb5a256a",
                        "hasBeepProfileImage": true,
                        "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/storehubyougaga/product/5dc1328c83773c12aae71bd2/f4c96fa8-b1de-4524-be4e-6bdb4c725e65",
                        "street1": "23331111",
                        "street2": "2333",
                        "city": "Kuala Lumpur",
                        "state": "federal territory of kuala lumpur",
                        "country": "Malaysia",
                        "deliveryFee": 0,
                        "minimumConsumption": 0,
                        "geoDistance": 0.01569646913977318,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeTo": "19:00",
                        "validTimeFrom": "00:00",
                        "currency": "MYR",
                        "currencySymbol": "RM",
                        "countryCode": "MY",
                        "locale": "MS-MY",
                        "deliveryRadius": 15,
                        "isOpen": true,
                        "enableFreeShipping": false,
                        "minimumSpendForFreeDelivery": null,
                        "enableCashback": true,
                        "cashbackRate": 0.2,
                        "enablePreOrder": false,
                        "products": [],
                        "productCount": 0,
                        "searchingTags": [
                            "Chocolate",
                            "Curry",
                            "Pastries",
                            "Vegetarian1"
                        ],
                        "fulfillmentOptions": [
                            "Delivery",
                            "Pickup"
                        ],
                        "reviewInfo": {
                            "ratingCount": 12,
                            "rating": "3.1",
                            "priceLevel": null
                        },
                        "storePromoTagInfos": [
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "50% OFF",
                                "appliedSources": [
                                    8,
                                    7,
                                    6,
                                    5
                                ],
                                "appliedClientTypes": [
                                    "web"
                                ]
                            },
                            {
                                "tag": "RM5 OFF",
                                "appliedSources": [
                                    8,
                                    7,
                                    5,
                                    6
                                ],
                                "appliedClientTypes": [
                                    "web",
                                    "app"
                                ]
                            },
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "RM5 OFF",
                                "appliedSources": [
                                    8,
                                    7,
                                    5,
                                    6
                                ],
                                "appliedClientTypes": [
                                    "web",
                                    "app"
                                ]
                            }
                        ],
                        "isOutOfDeliveryRange": false,
                        "h": "U2FsdGVkX19qgnLGQZtVbcyPEfpRYkS%2B%2FPSiLnunGUZ0RJszWad%2Fhfs19rvD8K12",
                        "promoTag": "100% OFF",
                        "storePromoTags": [
                            "100% OFF",
                            "50% OFF",
                            "RM5 OFF",
                            "100% OFF",
                            "RM5 OFF"
                        ],
                        "isLowestPrice": false,
                        "showFreeDeliveryTag": false,
                        "shippingType": "delivery"
                    },
                    {
                        "id": "5f6af7a99921030006666f42",
                        "business": "onlytestaccount",
                        "name": "KLCC -Grab",
                        "storeDisplayName": "Hi Welcome to onlytestaccont - #KLCC-89",
                        "avatar": "https://d16kpilgrxu9w6.cloudfront.net/onlytestaccount/beep/logo/9a33d4c9-5594-4ce6-a4f5-d1d53febc551",
                        "hasBeepProfileImage": true,
                        "featuredProductAvatar": "",
                        "street1": "Kuala Lumpur City Centre",
                        "street2": "",
                        "city": "Kuala Lumpur",
                        "state": "Wilayah Persekutuan Kuala Lumpur",
                        "country": "MY",
                        "deliveryFee": 0,
                        "minimumConsumption": 10,
                        "geoDistance": 0.06437091117459143,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeTo": "20:00",
                        "validTimeFrom": "08:00",
                        "currency": "MYR",
                        "currencySymbol": "RM",
                        "countryCode": "MY",
                        "locale": "MS-MY",
                        "deliveryRadius": 20,
                        "isOpen": true,
                        "enableFreeShipping": true,
                        "minimumSpendForFreeDelivery": 8,
                        "enableCashback": true,
                        "cashbackRate": 0.2,
                        "enablePreOrder": true,
                        "products": [],
                        "productCount": 0,
                        "searchingTags": [
                            "Keto",
                            "Non-Halal",
                            "Vegetarian",
                            "Chinese",
                            "Healthy"
                        ],
                        "fulfillmentOptions": [
                            "Delivery",
                            "Pickup"
                        ],
                        "reviewInfo": null,
                        "storePromoTagInfos": [
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "Free Delivery",
                                "appliedSources": [
                                    6,
                                    5
                                ],
                                "appliedClientTypes": [
                                    "web"
                                ]
                            },
                            {
                                "tag": "1% OFF",
                                "appliedSources": [
                                    6
                                ],
                                "appliedClientTypes": []
                            },
                            {
                                "tag": "100% OFF",
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
                                ]
                            }
                        ],
                        "isOutOfDeliveryRange": false,
                        "h": "U2FsdGVkX19LlzaiTrhPt%2FT3qMVE1di4MnE3skr8omJPkL3rKRHffwzEXWizGoeK",
                        "promoTag": "100% OFF",
                        "storePromoTags": [
                            "100% OFF",
                            "Free Delivery",
                            "1% OFF",
                            "100% OFF"
                        ],
                        "isLowestPrice": false,
                        "showFreeDeliveryTag": true,
                        "shippingType": "delivery"
                    },
                    {
                        "id": "5e744fd48817b70007e65169",
                        "business": "cathy6",
                        "name": "Cathy-LOG",
                        "storeDisplayName": "CC&Test - @Nanjing road store",
                        "avatar": "https://d16kpilgrxu9w6.cloudfront.net/cathy6/beep/logo/29fb7802-2b88-4d63-8113-bb198c37747a",
                        "hasBeepProfileImage": true,
                        "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/cathy6/product/5e74c43f4e727c00065ab182/0c6e4bcd-5597-4180-888b-67f6e93caf7c",
                        "street1": "2,Jalan Stesen Sentral",
                        "street2": "",
                        "city": "Kuala Lumpur",
                        "state": "Kuala Lumpur",
                        "country": "Malaysia",
                        "deliveryFee": 5,
                        "minimumConsumption": 1,
                        "geoDistance": 4.8733149736026435,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeTo": "24:00",
                        "validTimeFrom": "10:00",
                        "currency": "MYR",
                        "currencySymbol": "RM",
                        "countryCode": "MY",
                        "locale": "MS-MY",
                        "deliveryRadius": 35,
                        "isOpen": true,
                        "enableFreeShipping": false,
                        "minimumSpendForFreeDelivery": null,
                        "enableCashback": false,
                        "cashbackRate": 0,
                        "enablePreOrder": true,
                        "products": [],
                        "productCount": 0,
                        "searchingTags": [
                            "Street Food",
                            "Arabic",
                            "Korean",
                            "Fusion",
                            "Asian"
                        ],
                        "fulfillmentOptions": [
                            "Delivery",
                            "Pickup"
                        ],
                        "reviewInfo": null,
                        "storePromoTagInfos": [
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "100% OFF",
                                "appliedSources": [
                                    6,
                                    5,
                                    7,
                                    8
                                ],
                                "appliedClientTypes": []
                            },
                            {
                                "tag": "80% OFF",
                                "appliedSources": [
                                    6,
                                    5,
                                    7,
                                    8
                                ],
                                "appliedClientTypes": []
                            },
                            {
                                "tag": "Free Delivery",
                                "appliedSources": [
                                    6,
                                    5,
                                    7,
                                    8
                                ],
                                "appliedClientTypes": []
                            },
                            {
                                "tag": "100% OFF",
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
                                ]
                            }
                        ],
                        "isOutOfDeliveryRange": false,
                        "h": "U2FsdGVkX18si5UeNda1KIOZW%2Fn9nvZo8vy%2FRKZfRK9X4Uf79XDKmjbrkLwGn%2FU%2B",
                        "promoTag": "100% OFF",
                        "storePromoTags": [
                            "100% OFF",
                            "100% OFF",
                            "80% OFF",
                            "Free Delivery",
                            "100% OFF"
                        ],
                        "isLowestPrice": false,
                        "showFreeDeliveryTag": true,
                        "shippingType": "delivery"
                    },
                    {
                        "id": "5e7b06be4c25bb00064e1ecb",
                        "business": "storehubyougaga",
                        "name": "ZzZ",
                        "storeDisplayName": "yougaga - Zyx",
                        "avatar": "https://d16kpilgrxu9w6.cloudfront.net/storehubyougaga/beep/logo/dbea75c8-7607-468d-b2e3-a15ddb5a256a",
                        "hasBeepProfileImage": true,
                        "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/storehubyougaga/product/5dc1328c83773c12aae71bd2/f4c96fa8-b1de-4524-be4e-6bdb4c725e65",
                        "street1": "KLCC",
                        "street2": "",
                        "city": "Kuala Lumpur",
                        "state": "Federal Territory of Kuala Lumpur",
                        "country": "Malaysia",
                        "deliveryFee": 0,
                        "minimumConsumption": 0,
                        "geoDistance": 5.902843909808991,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeTo": "19:00",
                        "validTimeFrom": "00:00",
                        "currency": "MYR",
                        "currencySymbol": "RM",
                        "countryCode": "MY",
                        "locale": "MS-MY",
                        "deliveryRadius": 15,
                        "isOpen": true,
                        "enableFreeShipping": false,
                        "minimumSpendForFreeDelivery": null,
                        "enableCashback": true,
                        "cashbackRate": 0.2,
                        "enablePreOrder": false,
                        "products": [],
                        "productCount": 0,
                        "searchingTags": [
                            "Chocolate",
                            "Curry",
                            "Pastries",
                            "Vegetarian1"
                        ],
                        "fulfillmentOptions": [
                            "Pickup"
                        ],
                        "reviewInfo": null,
                        "storePromoTagInfos": [
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "50% OFF",
                                "appliedSources": [
                                    8,
                                    7,
                                    6,
                                    5
                                ],
                                "appliedClientTypes": [
                                    "web"
                                ]
                            },
                            {
                                "tag": "RM5 OFF",
                                "appliedSources": [
                                    8,
                                    7,
                                    5,
                                    6
                                ],
                                "appliedClientTypes": [
                                    "web",
                                    "app"
                                ]
                            },
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "RM5 OFF",
                                "appliedSources": [
                                    8,
                                    7,
                                    5,
                                    6
                                ],
                                "appliedClientTypes": [
                                    "web",
                                    "app"
                                ]
                            }
                        ],
                        "isOutOfDeliveryRange": false,
                        "h": "U2FsdGVkX1%2B%2FrXXlzs5i7JhEiq3Ddw1m9J4%2BqXrsqBS0HktoTipqQkN25OI%2B5anb",
                        "promoTag": "100% OFF",
                        "storePromoTags": [
                            "100% OFF",
                            "50% OFF",
                            "RM5 OFF",
                            "100% OFF",
                            "RM5 OFF"
                        ],
                        "isLowestPrice": false,
                        "showFreeDeliveryTag": false,
                        "shippingType": "pickup"
                    },
                    {
                        "id": "5df30178e192cc5fa77c1037",
                        "business": "omg5",
                        "name": "Store location Z",
                        "storeDisplayName": "OHHHHHHHYEAH - KLCC",
                        "avatar": "https://d16kpilgrxu9w6.cloudfront.net/omg5/beep/logo/41e8a301-ed89-4e31-af04-28bc3aa634a7",
                        "hasBeepProfileImage": true,
                        "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/omg5/product/5df3048ae192cc5fa77c107b/2c508230-920e-4dc8-c12d-ef0bc18c8381",
                        "street1": "jalan ss2",
                        "street2": "",
                        "city": "Petaling Jaya",
                        "state": "Selangor",
                        "country": "Malaysia",
                        "deliveryFee": 12.8,
                        "minimumConsumption": 20,
                        "geoDistance": 14.044539706503187,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeTo": "22:30",
                        "validTimeFrom": "01:00",
                        "currency": "MYR",
                        "currencySymbol": "RM",
                        "countryCode": "MY",
                        "locale": "MS-MY",
                        "deliveryRadius": 35,
                        "isOpen": true,
                        "enableFreeShipping": true,
                        "minimumSpendForFreeDelivery": 50,
                        "enableCashback": true,
                        "cashbackRate": 0.1,
                        "enablePreOrder": true,
                        "products": [],
                        "productCount": 0,
                        "searchingTags": [
                            "Halal",
                            "Pork-Free",
                            "Cakes",
                            "Juice",
                            "Cookies"
                        ],
                        "fulfillmentOptions": [
                            "Delivery",
                            "Pickup"
                        ],
                        "reviewInfo": null,
                        "storePromoTagInfos": [
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "50% OFF",
                                "appliedSources": [
                                    8,
                                    7,
                                    6,
                                    5
                                ],
                                "appliedClientTypes": [
                                    "web"
                                ]
                            },
                            {
                                "tag": "RM5 OFF",
                                "appliedSources": [
                                    8,
                                    7,
                                    5,
                                    6
                                ],
                                "appliedClientTypes": [
                                    "web",
                                    "app"
                                ]
                            },
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "RM5 OFF",
                                "appliedSources": [
                                    8,
                                    7,
                                    5,
                                    6
                                ],
                                "appliedClientTypes": [
                                    "web",
                                    "app"
                                ]
                            }
                        ],
                        "isOutOfDeliveryRange": false,
                        "h": "U2FsdGVkX19woHqVutobiYWdgedpJJY9tcOq4pu6sLta5naDLwCCv3WxqI5LmlTL",
                        "promoTag": "100% OFF",
                        "storePromoTags": [
                            "100% OFF",
                            "50% OFF",
                            "RM5 OFF",
                            "100% OFF",
                            "RM5 OFF"
                        ],
                        "isLowestPrice": false,
                        "showFreeDeliveryTag": true,
                        "shippingType": "delivery"
                    },
                    {
                        "id": "66150fc3e5f0020007f85e0c",
                        "business": "onlytestaccount",
                        "name": "Store 30 - Cheap Shop",
                        "storeDisplayName": "Store 30 - Cheap Shop",
                        "avatar": "https://d16kpilgrxu9w6.cloudfront.net/onlytestaccount/beep/logo/9a33d4c9-5594-4ce6-a4f5-d1d53febc551",
                        "hasBeepProfileImage": true,
                        "featuredProductAvatar": "",
                        "street1": "PJU 7, Mutiara Damansara",
                        "street2": "",
                        "city": "Petaling jaya",
                        "state": "Selangor",
                        "country": "Malaysia",
                        "deliveryFee": 0,
                        "minimumConsumption": 10,
                        "geoDistance": 14.145091495700362,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeTo": "24:00",
                        "validTimeFrom": "00:00",
                        "currency": "MYR",
                        "currencySymbol": "RM",
                        "countryCode": "MY",
                        "locale": "MS-MY",
                        "deliveryRadius": 20,
                        "isOpen": true,
                        "enableFreeShipping": true,
                        "minimumSpendForFreeDelivery": 8,
                        "enableCashback": true,
                        "cashbackRate": 0.2,
                        "enablePreOrder": true,
                        "products": [],
                        "productCount": 0,
                        "searchingTags": [
                            "Keto",
                            "Non-Halal",
                            "Vegetarian",
                            "Chinese",
                            "Healthy"
                        ],
                        "fulfillmentOptions": [
                            "Delivery",
                            "Pickup"
                        ],
                        "reviewInfo": {
                            "ratingCount": 88,
                            "rating": "4.6",
                            "priceLevel": null
                        },
                        "storePromoTagInfos": [
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "Free Delivery",
                                "appliedSources": [
                                    6,
                                    5
                                ],
                                "appliedClientTypes": [
                                    "web"
                                ]
                            },
                            {
                                "tag": "1% OFF",
                                "appliedSources": [
                                    6
                                ],
                                "appliedClientTypes": []
                            },
                            {
                                "tag": "100% OFF",
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
                                ]
                            }
                        ],
                        "isOutOfDeliveryRange": false,
                        "h": "U2FsdGVkX1%2Bp498iYmzIXIeXnQ1fWlbBQtczhDT0QjYF3mDSl8KhV3FmYQ7U54Os",
                        "promoTag": "100% OFF",
                        "storePromoTags": [
                            "100% OFF",
                            "Free Delivery",
                            "1% OFF",
                            "100% OFF"
                        ],
                        "isLowestPrice": false,
                        "showFreeDeliveryTag": true,
                        "shippingType": "delivery"
                    },
                    {
                        "id": "5f2bd16038f11d00075c8751",
                        "business": "onlytestaccount",
                        "name": "KYM",
                        "storeDisplayName": "Hi Welcome to onlytestaccont - #KYM Building",
                        "avatar": "https://d16kpilgrxu9w6.cloudfront.net/onlytestaccount/beep/logo/9a33d4c9-5594-4ce6-a4f5-d1d53febc551",
                        "hasBeepProfileImage": true,
                        "featuredProductAvatar": "",
                        "street1": "PJU 7, Mutiara Damansara",
                        "street2": "",
                        "city": "PJ",
                        "state": "Selangor",
                        "country": "MALAYSIA",
                        "deliveryFee": 0,
                        "minimumConsumption": 10,
                        "geoDistance": 14.145091495700362,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeTo": "23:30",
                        "validTimeFrom": "08:00",
                        "currency": "MYR",
                        "currencySymbol": "RM",
                        "countryCode": "MY",
                        "locale": "MS-MY",
                        "deliveryRadius": 20,
                        "isOpen": true,
                        "enableFreeShipping": true,
                        "minimumSpendForFreeDelivery": 8,
                        "enableCashback": true,
                        "cashbackRate": 0.2,
                        "enablePreOrder": true,
                        "products": [],
                        "productCount": 0,
                        "searchingTags": [
                            "Keto",
                            "Non-Halal",
                            "Vegetarian",
                            "Chinese",
                            "Healthy"
                        ],
                        "fulfillmentOptions": [
                            "Delivery",
                            "Pickup"
                        ],
                        "reviewInfo": {
                            "ratingCount": 74,
                            "rating": "4.8",
                            "priceLevel": null
                        },
                        "storePromoTagInfos": [
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "Free Delivery",
                                "appliedSources": [
                                    6,
                                    5
                                ],
                                "appliedClientTypes": [
                                    "web"
                                ]
                            },
                            {
                                "tag": "1% OFF",
                                "appliedSources": [
                                    6
                                ],
                                "appliedClientTypes": []
                            },
                            {
                                "tag": "100% OFF",
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
                                ]
                            }
                        ],
                        "isOutOfDeliveryRange": false,
                        "h": "U2FsdGVkX1%2FKhtF3SpBiFi0hS3mm00t9dH5a6YsKfdGAEtzqbnCsHEtuitYJXtRr",
                        "promoTag": "100% OFF",
                        "storePromoTags": [
                            "100% OFF",
                            "Free Delivery",
                            "1% OFF",
                            "100% OFF"
                        ],
                        "isLowestPrice": false,
                        "showFreeDeliveryTag": true,
                        "shippingType": "delivery"
                    },
                    {
                        "id": "674834be50d04500071dd443",
                        "business": "onlytestaccount",
                        "name": "Air Store (online)",
                        "storeDisplayName": "Air Store (online)",
                        "avatar": "https://d16kpilgrxu9w6.cloudfront.net/onlytestaccount/beep/logo/9a33d4c9-5594-4ce6-a4f5-d1d53febc551",
                        "hasBeepProfileImage": true,
                        "featuredProductAvatar": "",
                        "street1": "PJU 7, Mutiara Damansara",
                        "street2": "",
                        "city": "Petaling Jaya",
                        "state": "Selangor",
                        "country": "MALAYSIA",
                        "deliveryFee": 0,
                        "minimumConsumption": 10,
                        "geoDistance": 14.145091495700362,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeTo": "24:00",
                        "validTimeFrom": "00:00",
                        "currency": "MYR",
                        "currencySymbol": "RM",
                        "countryCode": "MY",
                        "locale": "MS-MY",
                        "deliveryRadius": 20,
                        "isOpen": true,
                        "enableFreeShipping": true,
                        "minimumSpendForFreeDelivery": 8,
                        "enableCashback": true,
                        "cashbackRate": 0.2,
                        "enablePreOrder": true,
                        "products": [],
                        "productCount": 0,
                        "searchingTags": [
                            "Keto",
                            "Non-Halal",
                            "Vegetarian",
                            "Chinese",
                            "Healthy"
                        ],
                        "fulfillmentOptions": [
                            "Delivery",
                            "Pickup"
                        ],
                        "reviewInfo": {
                            "ratingCount": 88,
                            "rating": "4.6",
                            "priceLevel": null
                        },
                        "storePromoTagInfos": [
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "Free Delivery",
                                "appliedSources": [
                                    6,
                                    5
                                ],
                                "appliedClientTypes": [
                                    "web"
                                ]
                            },
                            {
                                "tag": "1% OFF",
                                "appliedSources": [
                                    6
                                ],
                                "appliedClientTypes": []
                            },
                            {
                                "tag": "100% OFF",
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
                                ]
                            }
                        ],
                        "isOutOfDeliveryRange": false,
                        "h": "U2FsdGVkX1%2B2kxuITOssDWaDIpcdUFGGBJpboufSzXuscmpcUcNkgTnV1hD8hTqP",
                        "promoTag": "100% OFF",
                        "storePromoTags": [
                            "100% OFF",
                            "Free Delivery",
                            "1% OFF",
                            "100% OFF"
                        ],
                        "isLowestPrice": false,
                        "showFreeDeliveryTag": true,
                        "shippingType": "delivery"
                    },
                    {
                        "id": "66e5651dce9c820008167252",
                        "business": "onlytestaccount",
                        "name": "Store 32 - Car Shop",
                        "storeDisplayName": "Store 32 - Car Shop",
                        "avatar": "https://d16kpilgrxu9w6.cloudfront.net/onlytestaccount/beep/logo/9a33d4c9-5594-4ce6-a4f5-d1d53febc551",
                        "hasBeepProfileImage": true,
                        "featuredProductAvatar": "",
                        "street1": "PJU 7, Mutiara Damansara",
                        "street2": "",
                        "city": "Petaling Jaya",
                        "state": "Selangor",
                        "country": "Malaysia",
                        "deliveryFee": 0,
                        "minimumConsumption": 10,
                        "geoDistance": 14.145091495700362,
                        "validDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            1
                        ],
                        "validTimeTo": "24:00",
                        "validTimeFrom": "00:00",
                        "currency": "MYR",
                        "currencySymbol": "RM",
                        "countryCode": "MY",
                        "locale": "MS-MY",
                        "deliveryRadius": 20,
                        "isOpen": true,
                        "enableFreeShipping": true,
                        "minimumSpendForFreeDelivery": 8,
                        "enableCashback": true,
                        "cashbackRate": 0.2,
                        "enablePreOrder": true,
                        "products": [],
                        "productCount": 0,
                        "searchingTags": [
                            "Keto",
                            "Non-Halal",
                            "Vegetarian",
                            "Chinese",
                            "Healthy"
                        ],
                        "fulfillmentOptions": [
                            "Delivery",
                            "Pickup"
                        ],
                        "reviewInfo": {
                            "ratingCount": 88,
                            "rating": "4.6",
                            "priceLevel": null
                        },
                        "storePromoTagInfos": [
                            {
                                "tag": "100% OFF",
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
                                ]
                            },
                            {
                                "tag": "Free Delivery",
                                "appliedSources": [
                                    6,
                                    5
                                ],
                                "appliedClientTypes": [
                                    "web"
                                ]
                            },
                            {
                                "tag": "1% OFF",
                                "appliedSources": [
                                    6
                                ],
                                "appliedClientTypes": []
                            },
                            {
                                "tag": "100% OFF",
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
                                ]
                            }
                        ],
                        "isOutOfDeliveryRange": false,
                        "h": "U2FsdGVkX1%2FGm0uRpStZnA3S2Y%2F0bejCO3689N0d8dPXZ%2BmOEQms3X0g%2BVCAoJhT",
                        "promoTag": "100% OFF",
                        "storePromoTags": [
                            "100% OFF",
                            "Free Delivery",
                            "1% OFF",
                            "100% OFF"
                        ],
                        "isLowestPrice": false,
                        "showFreeDeliveryTag": true,
                        "shippingType": "delivery"
                    }
                ]
            }
        ],
        "SearchPopular": [],
        "SearchOthers": []
    }
})
    );
  }),

  rest.get('/api/stores/search', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "stores": [
        {
            "id": "6269003b60e98900077a01bf",
            "business": "feida",
            "name": "retail",
            "storeDisplayName": "Feida - retail",
            "avatar": "https://d16kpilgrxu9w6.cloudfront.net/feida/beep/logo/7b74ec26-8ec1-440a-8b2c-0925d6d204b7",
            "hasBeepProfileImage": true,
            "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/feida/product/62739b0c85c4b30008c648ae/14792461-8086-4efa-8256-33b9dca53cf4",
            "street1": "1212",
            "street2": "23",
            "city": "12",
            "state": "12",
            "country": "12",
            "deliveryFee": 5.5,
            "minimumConsumption": 0,
            "geoDistance": 1.3820780181894363,
            "validDays": [
                2,
                3,
                4,
                5,
                6,
                7,
                1
            ],
            "validTimeTo": "24:00",
            "validTimeFrom": "00:00",
            "currency": "MYR",
            "currencySymbol": "RM",
            "countryCode": "MY",
            "locale": "MS-MY",
            "deliveryRadius": 5,
            "isOpen": true,
            "enableFreeShipping": false,
            "minimumSpendForFreeDelivery": null,
            "enableCashback": true,
            "cashbackRate": 0.05,
            "enablePreOrder": true,
            "products": [],
            "productCount": 0,
            "searchingTags": [],
            "fulfillmentOptions": [
                "Delivery",
                "Pickup"
            ],
            "reviewInfo": {
                "ratingCount": 131,
                "rating": "4.1",
                "priceLevel": null
            },
            "storePromoTagInfos": [
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "Free Delivery",
                    "appliedSources": [
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "web"
                    ]
                },
                {
                    "tag": "100% OFF",
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
                    ]
                }
            ],
            "isOutOfDeliveryRange": false,
            "h": "U2FsdGVkX1%2FPW1JpV8ROflC5yezZWOtx4lROIF7jg7b1Pik%2FP8w2UNRgMcljGIWR",
            "promoTag": "100% OFF",
            "storePromoTags": [
                "100% OFF",
                "Free Delivery",
                "100% OFF"
            ],
            "isLowestPrice": false,
            "shippingType": "delivery",
            "showFreeDeliveryTag": true
        },
        {
            "id": "5e844ffa0745800006d6ed38",
            "business": "mystore1",
            "name": "mystore1-mysophie",
            "storeDisplayName": "mystore1-mysophie",
            "avatar": "https://d16kpilgrxu9w6.cloudfront.net/mystore1/product/5e845df775b3b70006dbbd3f/4600b641-cbff-4ab4-aa85-f956c4f715ea",
            "hasBeepProfileImage": false,
            "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/mystore1/product/5e845df775b3b70006dbbd3f/4600b641-cbff-4ab4-aa85-f956c4f715ea",
            "street1": "hangzhongroad",
            "street2": "minghang",
            "city": "shanghai",
            "state": "s",
            "country": "China",
            "deliveryFee": 0,
            "minimumConsumption": null,
            "geoDistance": 2.161612018364434,
            "validDays": [
                2,
                3,
                4,
                5,
                6,
                7,
                1
            ],
            "validTimeTo": "19:00",
            "validTimeFrom": "00:00",
            "currency": "MYR",
            "currencySymbol": "RM",
            "countryCode": "MY",
            "locale": "MS-MY",
            "deliveryRadius": 10,
            "isOpen": true,
            "enableFreeShipping": true,
            "minimumSpendForFreeDelivery": 1.1,
            "enableCashback": false,
            "cashbackRate": 0,
            "enablePreOrder": true,
            "products": [],
            "productCount": 0,
            "searchingTags": [],
            "fulfillmentOptions": [
                "Delivery",
                "Pickup"
            ],
            "reviewInfo": {
                "ratingCount": 21949,
                "rating": "4.3",
                "priceLevel": null
            },
            "storePromoTagInfos": [
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "50% OFF",
                    "appliedSources": [
                        8,
                        7,
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "web"
                    ]
                },
                {
                    "tag": "RM5 OFF",
                    "appliedSources": [
                        8,
                        7,
                        5,
                        6
                    ],
                    "appliedClientTypes": [
                        "web",
                        "app"
                    ]
                },
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "RM5 OFF",
                    "appliedSources": [
                        8,
                        7,
                        5,
                        6
                    ],
                    "appliedClientTypes": [
                        "web",
                        "app"
                    ]
                }
            ],
            "isOutOfDeliveryRange": false,
            "h": "U2FsdGVkX19nA8sAxgX8t8Y%2BI42OYN%2BK%2F5273mRIANcyq95XLislGoDBT9CiwJMC",
            "promoTag": "100% OFF",
            "storePromoTags": [
                "100% OFF",
                "50% OFF",
                "RM5 OFF",
                "100% OFF",
                "RM5 OFF"
            ],
            "isLowestPrice": false,
            "shippingType": "delivery",
            "showFreeDeliveryTag": true
        },
        {
            "id": "600291aedd54ce0006612775",
            "business": "chunyuan",
            "name": "KL Hospital",
            "storeDisplayName": "test - test4",
            "avatar": "https://d16kpilgrxu9w6.cloudfront.net/chunyuan/beep/logo/6a5b38c1-0f48-469e-aed1-80ce51d2a70b",
            "hasBeepProfileImage": true,
            "featuredProductAvatar": "",
            "street1": "43000 Kajang, Selangor",
            "street2": "",
            "city": "Kajang",
            "state": "Selangor",
            "country": "Malaysia",
            "deliveryFee": 5,
            "minimumConsumption": 1,
            "geoDistance": 2.644546629340685,
            "validDays": [
                2,
                3,
                4,
                5,
                6,
                7,
                1
            ],
            "validTimeTo": "19:00",
            "validTimeFrom": "10:00",
            "currency": "MYR",
            "currencySymbol": "RM",
            "countryCode": "MY",
            "locale": "MS-MY",
            "deliveryRadius": 35,
            "isOpen": true,
            "enableFreeShipping": true,
            "minimumSpendForFreeDelivery": 10,
            "enableCashback": true,
            "cashbackRate": 0.1,
            "enablePreOrder": true,
            "products": [],
            "productCount": 0,
            "searchingTags": [],
            "fulfillmentOptions": [
                "Delivery",
                "Pickup"
            ],
            "reviewInfo": {
                "ratingCount": 950,
                "rating": "3.7",
                "priceLevel": null
            },
            "storePromoTagInfos": [
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "Free Delivery",
                    "appliedSources": [
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "web"
                    ]
                },
                {
                    "tag": "100% OFF",
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
                    ]
                }
            ],
            "isOutOfDeliveryRange": false,
            "h": "U2FsdGVkX18vLknRo0JSwHy56LlI4E36VF%2FeC5A5bAWTAC5KzPdMy14NKotoewLF",
            "promoTag": "100% OFF",
            "storePromoTags": [
                "100% OFF",
                "Free Delivery",
                "100% OFF"
            ],
            "isLowestPrice": false,
            "shippingType": "delivery",
            "showFreeDeliveryTag": true
        },
        {
            "id": "5f924b3f4a07e5000685f589",
            "business": "beepflowautomation",
            "name": "Store B",
            "storeDisplayName": "Store B",
            "avatar": null,
            "hasBeepProfileImage": false,
            "featuredProductAvatar": "",
            "street1": "Avenue K",
            "street2": "1111",
            "city": "Kuala Lumpur",
            "state": "Kuala Lumpur",
            "country": "MY",
            "deliveryFee": 0,
            "minimumConsumption": null,
            "geoDistance": 2.8210282880162816,
            "validDays": [
                2,
                3,
                4,
                5,
                6,
                7,
                1
            ],
            "validTimeTo": "19:00",
            "validTimeFrom": "00:00",
            "currency": "MYR",
            "currencySymbol": "RM",
            "countryCode": "MY",
            "locale": "MS-MY",
            "deliveryRadius": 15,
            "isOpen": true,
            "enableFreeShipping": false,
            "minimumSpendForFreeDelivery": null,
            "enableCashback": false,
            "cashbackRate": 0,
            "enablePreOrder": true,
            "products": [],
            "productCount": 0,
            "searchingTags": [],
            "fulfillmentOptions": [
                "Delivery",
                "Pickup"
            ],
            "reviewInfo": null,
            "storePromoTagInfos": [
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "Free Delivery",
                    "appliedSources": [
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "web"
                    ]
                },
                {
                    "tag": "100% OFF",
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
                    ]
                }
            ],
            "isOutOfDeliveryRange": false,
            "h": "U2FsdGVkX19XrnkSvNJ%2BZt0ld1VF5CKOsOGhrdhG7hQhEnbGRCE6JytT2l%2F%2Fc57D",
            "promoTag": "100% OFF",
            "storePromoTags": [
                "100% OFF",
                "Free Delivery",
                "100% OFF"
            ],
            "isLowestPrice": false,
            "shippingType": "delivery",
            "showFreeDeliveryTag": true
        },
        {
            "id": "623c524303c10400076077e7",
            "business": "lexie",
            "name": "LexieStoreA",
            "storeDisplayName": "Lexieee - China",
            "avatar": "https://d16kpilgrxu9w6.cloudfront.net/lexie/beep/logo/13da0832-5f40-49f3-a802-5cb3354f6ce2",
            "hasBeepProfileImage": true,
            "featuredProductAvatar": "",
            "street1": "馬魯里",
            "street2": "",
            "city": "吉隆坡",
            "state": "吉隆坡",
            "country": "MY",
            "deliveryFee": 5.5,
            "minimumConsumption": 0,
            "geoDistance": 4.0114180907176005,
            "validDays": [
                2,
                3,
                4,
                5,
                6,
                7,
                1
            ],
            "validTimeTo": "24:00",
            "validTimeFrom": "00:00",
            "currency": "MYR",
            "currencySymbol": "RM",
            "countryCode": "MY",
            "locale": "MS-MY",
            "deliveryRadius": 5,
            "isOpen": true,
            "enableFreeShipping": false,
            "minimumSpendForFreeDelivery": null,
            "enableCashback": true,
            "cashbackRate": 0.1,
            "enablePreOrder": true,
            "products": [],
            "productCount": 0,
            "searchingTags": [],
            "fulfillmentOptions": [
                "Delivery",
                "Pickup"
            ],
            "reviewInfo": {
                "ratingCount": 999,
                "rating": "4.1",
                "priceLevel": 1
            },
            "storePromoTagInfos": [
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "Free Delivery",
                    "appliedSources": [
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "web"
                    ]
                },
                {
                    "tag": "100% OFF",
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
                    ]
                }
            ],
            "isOutOfDeliveryRange": false,
            "h": "U2FsdGVkX1%2BfSq5rm4rCHwJqU1cWL8hpIxzw1R1cxlNXxFkCO6k3XHeLp%2F0CCNHP",
            "promoTag": "100% OFF",
            "storePromoTags": [
                "100% OFF",
                "Free Delivery",
                "100% OFF"
            ],
            "isLowestPrice": false,
            "shippingType": "delivery",
            "showFreeDeliveryTag": true
        },
        {
            "id": "62c55ef66229bc0007f16256",
            "business": "lexie",
            "name": "LexieStoreB",
            "storeDisplayName": "Lexieee - B",
            "avatar": "https://d16kpilgrxu9w6.cloudfront.net/lexie/beep/logo/13da0832-5f40-49f3-a802-5cb3354f6ce2",
            "hasBeepProfileImage": true,
            "featuredProductAvatar": "",
            "street1": "馬魯里",
            "street2": "",
            "city": "吉隆坡",
            "state": "吉隆坡",
            "country": "MY",
            "deliveryFee": 5.5,
            "minimumConsumption": 0,
            "geoDistance": 4.0114180907176005,
            "validDays": [
                2,
                3,
                4,
                5,
                6,
                7,
                1
            ],
            "validTimeTo": "24:00",
            "validTimeFrom": "00:00",
            "currency": "MYR",
            "currencySymbol": "RM",
            "countryCode": "MY",
            "locale": "MS-MY",
            "deliveryRadius": 5,
            "isOpen": true,
            "enableFreeShipping": false,
            "minimumSpendForFreeDelivery": null,
            "enableCashback": true,
            "cashbackRate": 0.1,
            "enablePreOrder": true,
            "products": [],
            "productCount": 0,
            "searchingTags": [],
            "fulfillmentOptions": [
                "Delivery",
                "Pickup"
            ],
            "reviewInfo": null,
            "storePromoTagInfos": [
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "Free Delivery",
                    "appliedSources": [
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "web"
                    ]
                },
                {
                    "tag": "100% OFF",
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
                    ]
                }
            ],
            "isOutOfDeliveryRange": false,
            "h": "U2FsdGVkX181agsgPkzlrwqLHVqTqwdV1Qm7ilO7kZ%2FV6mWXF%2BoJVO7M47kFlBXn",
            "promoTag": "100% OFF",
            "storePromoTags": [
                "100% OFF",
                "Free Delivery",
                "100% OFF"
            ],
            "isLowestPrice": false,
            "shippingType": "delivery",
            "showFreeDeliveryTag": true
        },
        {
            "id": "5fbf509f8fb5190006c4d6f2",
            "business": "suprenic4",
            "name": "Store Location A",
            "storeDisplayName": "Store Location A",
            "avatar": "https://d16kpilgrxu9w6.cloudfront.net/suprenic4/product/601545a20743840006ffbf15/863ab7ac-10b4-46a4-ec97-241883d44588",
            "hasBeepProfileImage": false,
            "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/suprenic4/product/601545a20743840006ffbf15/863ab7ac-10b4-46a4-ec97-241883d44588",
            "street1": "yanan road",
            "street2": "Shimao tower",
            "city": "shanghai",
            "state": "Pudong new area",
            "country": "中国",
            "deliveryFee": 8.5,
            "minimumConsumption": 5,
            "geoDistance": 4.516040779017135,
            "validDays": [
                2,
                3,
                4,
                5,
                6,
                7,
                1
            ],
            "validTimeTo": "24:00",
            "validTimeFrom": "10:00",
            "currency": "MYR",
            "currencySymbol": "RM",
            "countryCode": "MY",
            "locale": "MS-MY",
            "deliveryRadius": 35,
            "isOpen": true,
            "enableFreeShipping": true,
            "minimumSpendForFreeDelivery": 0,
            "enableCashback": true,
            "cashbackRate": 0.1,
            "enablePreOrder": false,
            "products": [],
            "productCount": 0,
            "searchingTags": [],
            "fulfillmentOptions": [
                "Delivery",
                "Pickup"
            ],
            "reviewInfo": null,
            "storePromoTagInfos": [
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "Free Delivery",
                    "appliedSources": [
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "web"
                    ]
                },
                {
                    "tag": "100% OFF",
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
                    ]
                }
            ],
            "isOutOfDeliveryRange": false,
            "h": "U2FsdGVkX1%2B5nQaGy4vDt7ZDr9bvzMu4%2Fh6AJVqKjDn%2FoRKth5wlGBKp3co4Xi5j",
            "promoTag": "100% OFF",
            "storePromoTags": [
                "100% OFF",
                "Free Delivery",
                "100% OFF"
            ],
            "isLowestPrice": false,
            "shippingType": "delivery",
            "showFreeDeliveryTag": true
        },
        {
            "id": "63204b95146ed8000700818f",
            "business": "androidautomation",
            "name": "Store Location A",
            "storeDisplayName": "Store Location A",
            "avatar": "https://d16kpilgrxu9w6.cloudfront.net/androidautomation/product/63297624fe1987000724dd7d/577749ff-45a3-496d-910c-b0250ae21fdb",
            "hasBeepProfileImage": false,
            "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/androidautomation/product/63297624fe1987000724dd7d/577749ff-45a3-496d-910c-b0250ae21fdb",
            "street1": "Store Location A address",
            "street2": "12",
            "city": "Kuala Lopburi",
            "state": "Kuala Lopburi",
            "country": "MY",
            "deliveryFee": 5,
            "minimumConsumption": 0,
            "geoDistance": 4.519293216184022,
            "validDays": [
                2,
                3,
                4,
                5,
                6,
                7,
                1
            ],
            "validTimeTo": "24:00",
            "validTimeFrom": "00:00",
            "currency": "MYR",
            "currencySymbol": "RM",
            "countryCode": "MY",
            "locale": "MS-MY",
            "deliveryRadius": 30,
            "isOpen": true,
            "enableFreeShipping": true,
            "minimumSpendForFreeDelivery": 0,
            "enableCashback": false,
            "cashbackRate": 0,
            "enablePreOrder": false,
            "products": [],
            "productCount": 0,
            "searchingTags": [],
            "fulfillmentOptions": [
                "Delivery",
                "Pickup"
            ],
            "reviewInfo": null,
            "storePromoTagInfos": [
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "Free Delivery",
                    "appliedSources": [
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "web"
                    ]
                },
                {
                    "tag": "100% OFF",
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
                    ]
                }
            ],
            "isOutOfDeliveryRange": false,
            "h": "U2FsdGVkX181FqKEYu8OuwqKb3ElWPt5uPFFpsQUGCzCKOXUsMOrBKHoWFv5bHyJ",
            "promoTag": "100% OFF",
            "storePromoTags": [
                "100% OFF",
                "Free Delivery",
                "100% OFF"
            ],
            "isLowestPrice": false,
            "shippingType": "delivery",
            "showFreeDeliveryTag": true
        },
        {
            "id": "62e892dcd4a2080007eaf68e",
            "business": "iosautomation",
            "name": "Store Location A",
            "storeDisplayName": "Store Location A",
            "avatar": "https://d16kpilgrxu9w6.cloudfront.net/iosautomation/product/62e894ead4a2080007eb112e/e6229535-3503-4b85-fdc3-6cefc23acf0b",
            "hasBeepProfileImage": false,
            "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/iosautomation/product/62e894ead4a2080007eb112e/e6229535-3503-4b85-fdc3-6cefc23acf0b",
            "street1": "Store Location A address",
            "street2": "12",
            "city": "Kuala Lopburi",
            "state": "Kuala Lopburi",
            "country": "MY",
            "deliveryFee": 5.5,
            "minimumConsumption": 0,
            "geoDistance": 4.519293216184022,
            "validDays": [
                2,
                3,
                4,
                5,
                6,
                7,
                1
            ],
            "validTimeTo": "22:00",
            "validTimeFrom": "10:00",
            "currency": "MYR",
            "currencySymbol": "RM",
            "countryCode": "MY",
            "locale": "MS-MY",
            "deliveryRadius": 5,
            "isOpen": true,
            "enableFreeShipping": false,
            "minimumSpendForFreeDelivery": null,
            "enableCashback": true,
            "cashbackRate": 0.05,
            "enablePreOrder": false,
            "products": [],
            "productCount": 0,
            "searchingTags": [],
            "fulfillmentOptions": [
                "Delivery",
                "Pickup"
            ],
            "reviewInfo": null,
            "storePromoTagInfos": [
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "Free Delivery",
                    "appliedSources": [
                        6,
                        5
                    ],
                    "appliedClientTypes": [
                        "web"
                    ]
                },
                {
                    "tag": "100% OFF",
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
                    ]
                }
            ],
            "isOutOfDeliveryRange": false,
            "h": "U2FsdGVkX1%2FEVFO%2FlOjZzZGYD1G0ZfRCypmSmxRukXf5tD2%2BGWdMT4wDoOK4%2FjYW",
            "promoTag": "100% OFF",
            "storePromoTags": [
                "100% OFF",
                "Free Delivery",
                "100% OFF"
            ],
            "isLowestPrice": false,
            "shippingType": "delivery",
            "showFreeDeliveryTag": true
        },
        {
            "id": "5e744fd48817b70007e65169",
            "business": "cathy6",
            "name": "Cathy-LOG",
            "storeDisplayName": "CC&Test - @Nanjing road store",
            "avatar": "https://d16kpilgrxu9w6.cloudfront.net/cathy6/beep/logo/29fb7802-2b88-4d63-8113-bb198c37747a",
            "hasBeepProfileImage": true,
            "featuredProductAvatar": "https://d16kpilgrxu9w6.cloudfront.net/cathy6/product/5e74c43f4e727c00065ab182/0c6e4bcd-5597-4180-888b-67f6e93caf7c",
            "street1": "2,Jalan Stesen Sentral",
            "street2": "",
            "city": "Kuala Lumpur",
            "state": "Kuala Lumpur",
            "country": "Malaysia",
            "deliveryFee": 5,
            "minimumConsumption": 1,
            "geoDistance": 4.8733149736026435,
            "validDays": [
                2,
                3,
                4,
                5,
                6,
                7,
                1
            ],
            "validTimeTo": "24:00",
            "validTimeFrom": "10:00",
            "currency": "MYR",
            "currencySymbol": "RM",
            "countryCode": "MY",
            "locale": "MS-MY",
            "deliveryRadius": 35,
            "isOpen": true,
            "enableFreeShipping": false,
            "minimumSpendForFreeDelivery": null,
            "enableCashback": false,
            "cashbackRate": 0,
            "enablePreOrder": true,
            "products": [],
            "productCount": 0,
            "searchingTags": [
                "Street Food",
                "Arabic",
                "Korean",
                "Fusion",
                "Asian"
            ],
            "fulfillmentOptions": [
                "Delivery",
                "Pickup"
            ],
            "reviewInfo": null,
            "storePromoTagInfos": [
                {
                    "tag": "100% OFF",
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
                    ]
                },
                {
                    "tag": "100% OFF",
                    "appliedSources": [
                        6,
                        5,
                        7,
                        8
                    ],
                    "appliedClientTypes": []
                },
                {
                    "tag": "80% OFF",
                    "appliedSources": [
                        6,
                        5,
                        7,
                        8
                    ],
                    "appliedClientTypes": []
                },
                {
                    "tag": "Free Delivery",
                    "appliedSources": [
                        6,
                        5,
                        7,
                        8
                    ],
                    "appliedClientTypes": []
                },
                {
                    "tag": "100% OFF",
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
                    ]
                }
            ],
            "isOutOfDeliveryRange": false,
            "h": "U2FsdGVkX1%2BcELQsOg3%2BPxrtVJzuiIsk1lkikVdVHXhDh%2FkxKRuBLS9L8zqZL535",
            "promoTag": "100% OFF",
            "storePromoTags": [
                "100% OFF",
                "100% OFF",
                "80% OFF",
                "Free Delivery",
                "100% OFF"
            ],
            "isLowestPrice": false,
            "shippingType": "delivery",
            "showFreeDeliveryTag": true
        }
    ]
})
    );
  }),

  rest.get('/api/stores/search/options', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
    {
        "id": "SortBy",
        "name": "Sort by",
        "type": "SingleSelect",
        "options": [
            {
                "id": "Recommended",
                "name": "Recommended"
            },
            {
                "id": "DeliveryDistance",
                "name": "Distance"
            },
            {
                "id": "Rating",
                "name": "Rating"
            }
        ]
    },
    {
        "id": "Cuisine",
        "name": "Cuisine",
        "type": "MultiSelect",
        "options": [
            {
                "id": "Arabic",
                "name": "Arabic"
            },
            {
                "id": "Asian",
                "name": "Asian"
            },
            {
                "id": "Bakery",
                "name": "Bakery"
            },
            {
                "id": "Balinese",
                "name": "Balinese"
            },
            {
                "id": "Bar",
                "name": "Bar"
            },
            {
                "id": "Cafe",
                "name": "Cafe"
            },
            {
                "id": "Chinese",
                "name": "Chinese"
            },
            {
                "id": "Desserts",
                "name": "Desserts"
            },
            {
                "id": "Dutch",
                "name": "Dutch"
            },
            {
                "id": "Fast Food",
                "name": "Fast Food"
            },
            {
                "id": "Filipino",
                "name": "Filipino"
            },
            {
                "id": "Foodcourt",
                "name": "Foodcourt"
            },
            {
                "id": "French",
                "name": "French"
            },
            {
                "id": "Fusion",
                "name": "Fusion"
            },
            {
                "id": "German",
                "name": "German"
            },
            {
                "id": "Grill",
                "name": "Grill"
            },
            {
                "id": "Hawker",
                "name": "Hawker"
            },
            {
                "id": "Hot Pot",
                "name": "Hot Pot"
            },
            {
                "id": "Indian",
                "name": "Indian"
            },
            {
                "id": "Indonesian",
                "name": "Indonesian"
            },
            {
                "id": "Italian",
                "name": "Italian"
            },
            {
                "id": "Japanese",
                "name": "Japanese"
            },
            {
                "id": "Korean",
                "name": "Korean"
            },
            {
                "id": "Local",
                "name": "Local"
            },
            {
                "id": "Mamak",
                "name": "Mamak"
            },
            {
                "id": "Mexican",
                "name": "Mexican"
            },
            {
                "id": "Middle Eastern",
                "name": "Middle Eastern"
            },
            {
                "id": "Russian",
                "name": "Russian"
            },
            {
                "id": "South African",
                "name": "South African"
            },
            {
                "id": "Spanish",
                "name": "Spanish"
            },
            {
                "id": "Street Food",
                "name": "Street Food"
            },
            {
                "id": "Taiwanese",
                "name": "Taiwanese"
            },
            {
                "id": "Thai",
                "name": "Thai"
            },
            {
                "id": "Vietnamese",
                "name": "Vietnamese"
            },
            {
                "id": "Western",
                "name": "Western"
            }
        ]
    },
    {
        "id": "Cashback",
        "name": "Cashback",
        "type": "Toggle"
    },
    {
        "id": "PriceRange",
        "name": "Price",
        "type": "MultiSelect",
        "options": [
            {
                "id": "1",
                "name": "$"
            },
            {
                "id": "2",
                "name": "$$"
            },
            {
                "id": "3",
                "name": "$$$"
            },
            {
                "id": "4",
                "name": "$$$$"
            }
        ]
    },
    {
        "id": "Pickup",
        "name": "Pickup",
        "type": "Toggle"
    },
    {
        "id": "PreOrder",
        "name": "Pre-Order",
        "type": "Toggle"
    },
    {
        "id": "Dietary",
        "name": "Dietary",
        "type": "MultiSelect",
        "options": [
            {
                "id": "Halal",
                "name": "Halal"
            },
            {
                "id": "Healthy Food",
                "name": "Healthy Food"
            },
            {
                "id": "Keto",
                "name": "Keto"
            },
            {
                "id": "Non-Halal",
                "name": "Non-Halal"
            },
            {
                "id": "Organic",
                "name": "Organic"
            },
            {
                "id": "Pork-Free",
                "name": "Pork-Free"
            },
            {
                "id": "Vegan",
                "name": "Vegan"
            },
            {
                "id": "Vegetarian",
                "name": "Vegetarian"
            }
        ]
    },
    {
        "id": "Halal",
        "name": "Halal",
        "type": "Toggle"
    },
    {
        "id": "Promotions",
        "name": "Promo",
        "type": "Toggle"
    }
])
    );
  }),

  rest.get('/api/stores/collection', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "beepCollectionId": "9aaa9ab1-f71f-4248-8703-89ff089ea819",
    "urlPath": "chinese",
    "displayType": "SearchOthers",
    "image": null,
    "name": "Chinese",
    "status": "Live",
    "shippingType": [
        "delivery",
        "pickup"
    ],
    "tags": [
        "Chinese"
    ],
    "freeShipping": null,
    "cashbackEnabled": null
})
    );
  }),

  rest.get('/api/ordering/stores/6077b44eb07f400006229705', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "redirectTo": "U2FsdGVkX19S8%2FXLTtaklMpa6pYlh4brP%2FCiXFy2ePSIKh2NbmlCXROTtQj2vE8V"
})
    );
  }),

  rest.get('/api/ordering/stores/608b7c77cc9fd00006d831f3', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "redirectTo": "U2FsdGVkX18%2FvnVYN%2FM8tZvSm5RxnAceumbw7IpybY6IOcDYqk9ki%2B5QOB98ZKjo"
})
    );
  }),

  rest.get('/api/ordering/stores/608b7c77cc9fd00006d83205', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "redirectTo": "U2FsdGVkX1%2BeepYby%2F6SV9BtMUPmd0VUwGz%2FWxJcr0gXuPWonL%2FkowQf4CY8Apj2"
})
    );
  }),

  rest.get('/api/ordering/stores/65e686c897bcc60008fc64f7', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "redirectTo": "U2FsdGVkX1%2B6tLruQhDHKZg5vy5jHjYIVwGpnBSwphN0MJyqzsPPENE5G1TaxWi9"
})
    );
  }),

  rest.get('/api/consumers/5d285b152734781c0fcadee2/address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
    {
        "_id": "6867686997bd965f597f6517",
        "contactName": "Ttest2",
        "contactNumber": "+60123456789",
        "address": "Level 2, KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "addressName": "Test Address 2",
        "comments": "test",
        "addressDetails": "Level 2",
        "deliveryTo": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6143277,
            "latitude": 3.1616217
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47800"
    },
    {
        "_id": "6867677697bd96cac67f64e0",
        "contactName": "Ttest",
        "contactNumber": "+60123456789",
        "address": "Level 2, KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "addressName": "Test Address",
        "comments": "test",
        "addressDetails": "Level 2",
        "deliveryTo": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6143277,
            "latitude": 3.1616217
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47800"
    },
    {
        "_id": "6809b259f414fa75e98a179d",
        "contactName": "Customer on test17",
        "contactNumber": "+60123456789",
        "address": "Level 7, KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "addressName": "KYM",
        "comments": "Drive safe :p",
        "addressDetails": "Level 7",
        "deliveryTo": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6143277,
            "latitude": 3.1616217
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47800"
    },
    {
        "_id": "65bc83c69f06d43bbd89b626",
        "contactName": "Customer on test17",
        "contactNumber": "+60123456789",
        "address": "Level 7, KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "addressName": "KYM",
        "comments": "Drive safe :p",
        "addressDetails": "Level 7",
        "deliveryTo": "KYM Tower, PJU 7, Mutiara Damansara, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6143277,
            "latitude": 3.1616217
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47800"
    },
    {
        "_id": "65268504e0b15b92faccb3ab",
        "contactName": "test",
        "contactNumber": "+60123456789",
        "address": "1, 吉隆坡, 马来西亚",
        "addressName": "111",
        "comments": "",
        "addressDetails": "1",
        "deliveryTo": "吉隆坡, 马来西亚",
        "location": {
            "longitude": 101.6840589,
            "latitude": 3.1319197
        },
        "city": "吉隆坡",
        "countryCode": "MY",
        "postCode": "50470"
    },
    {
        "_id": "64dd8ec925b7c9e87d309b8d",
        "contactName": "test",
        "contactNumber": "+60123456789",
        "address": "Level 7, Manila, Metro Manila, Philippines",
        "addressName": "Testing",
        "comments": "",
        "addressDetails": "Level 7",
        "deliveryTo": "Manila, Metro Manila, Philippines",
        "location": {
            "longitude": 120.9842195,
            "latitude": 14.5995124
        },
        "city": "Manila",
        "countryCode": "PH",
        "postCode": "1001"
    },
    {
        "_id": "62e22f8c239fbc3e5f29eefe",
        "contactName": "test",
        "contactNumber": "+60123456789",
        "address": "H, Manila International Airport (MNL), Pasay, Metro Manila, Philippines",
        "addressName": "Test",
        "comments": "",
        "addressDetails": "H",
        "deliveryTo": "Manila International Airport (MNL), Pasay, Metro Manila, Philippines",
        "location": {
            "longitude": 121.016508,
            "latitude": 14.5122739
        },
        "city": "Pasay",
        "countryCode": "PH",
        "postCode": "1300"
    },
    {
        "_id": "611e72823332c880e7a5866b",
        "contactName": "My name woo",
        "contactNumber": "+60123456789",
        "address": "2, SS 2, Petaling Jaya, Selangor, Malaysia",
        "addressName": "No 1",
        "comments": "Drive safe :p",
        "addressDetails": "2",
        "deliveryTo": "SS 2, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6222681,
            "latitude": 3.12026
        },
        "city": "",
        "countryCode": "MY",
        "postCode": "47300"
    },
    {
        "_id": "611df23d3332c818dca5451c",
        "contactName": null,
        "contactNumber": null,
        "address": "1, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "addressName": "1",
        "comments": "1",
        "addressDetails": "1",
        "deliveryTo": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "location": {
            "longitude": 101.686855,
            "latitude": 3.139003
        },
        "city": "",
        "countryCode": "MY",
        "postCode": "50480"
    },
    {
        "_id": "611debd23332c8ca8aa4dbd4",
        "contactName": null,
        "contactNumber": null,
        "address": "5, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "addressName": "5",
        "comments": "4",
        "addressDetails": "5",
        "deliveryTo": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "location": {
            "longitude": 101.686855,
            "latitude": 3.139003
        },
        "city": "",
        "countryCode": "MY",
        "postCode": "50480"
    },
    {
        "_id": "611dc6373332c8b9ada27210",
        "contactName": null,
        "contactNumber": null,
        "address": "1, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "addressName": "1",
        "comments": "1",
        "addressDetails": "1",
        "deliveryTo": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "location": {
            "longitude": 101.686855,
            "latitude": 3.139003
        },
        "city": "",
        "countryCode": "MY",
        "postCode": "50480"
    },
    {
        "_id": "611c8b8265b32328f679aa01",
        "contactName": null,
        "contactNumber": null,
        "address": "11, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "addressName": "work",
        "comments": "ww",
        "addressDetails": "11",
        "deliveryTo": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "location": {
            "longitude": 101.686855,
            "latitude": 3.139003
        },
        "city": "",
        "countryCode": "MY",
        "postCode": null
    },
    {
        "_id": "6119eeb97a2ad05a7a848df6",
        "contactName": "test",
        "contactNumber": "+60123456789",
        "address": "12, SS2, Petaling Jaya, Selangor, Malaysia",
        "addressName": "Name",
        "comments": "Hi driver",
        "addressDetails": "12",
        "deliveryTo": "SS2, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6222681,
            "latitude": 3.12026
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47300"
    },
    {
        "_id": "6112527fb3f5cb1a62cf306c",
        "contactName": null,
        "contactNumber": null,
        "address": "1111, SS2, Petaling Jaya, Selangor, Malaysia",
        "addressName": "111111",
        "comments": "11111",
        "addressDetails": "1111",
        "deliveryTo": "SS2, Petaling Jaya, Selangor, Malaysia",
        "location": {
            "longitude": 101.6222681,
            "latitude": 3.12026
        },
        "city": "PJ",
        "countryCode": "MY",
        "postCode": "47300"
    },
    {
        "_id": "60f6905872b0059dcaed301b",
        "contactName": null,
        "contactNumber": null,
        "address": "11, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "addressName": "11",
        "comments": "",
        "addressDetails": "11",
        "deliveryTo": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "location": {
            "longitude": 101.686855,
            "latitude": 3.139003
        },
        "city": "Kuala Lumpur",
        "countryCode": "MY",
        "postCode": "50480"
    }
])
    );
  }),

  rest.get('/api/storage/location-history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
    {
        "description": "KLCC, Kuala Lumpur City Centre, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "matched_substrings": [
            {
                "length": 4,
                "offset": 0
            }
        ],
        "place_id": "ChIJH5xmLdE3zDERKa4a_IywVck",
        "reference": "ChIJH5xmLdE3zDERKa4a_IywVck",
        "structured_formatting": {
            "main_text": "KLCC",
            "main_text_matched_substrings": [
                {
                    "length": 4,
                    "offset": 0
                }
            ],
            "secondary_text": "Kuala Lumpur City Centre, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia"
        },
        "terms": [
            {
                "offset": 0,
                "value": "KLCC"
            },
            {
                "offset": 6,
                "value": "Kuala Lumpur City Centre"
            },
            {
                "offset": 32,
                "value": "Kuala Lumpur"
            },
            {
                "offset": 46,
                "value": "Federal Territory of Kuala Lumpur"
            },
            {
                "offset": 81,
                "value": "Malaysia"
            }
        ],
        "types": [
            "shopping_mall",
            "establishment",
            "point_of_interest"
        ],
        "placeId": "ChIJH5xmLdE3zDERKa4a_IywVck",
        "address": "KLCC, Kuala Lumpur City Centre, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "displayComponents": {
            "mainText": "KLCC",
            "secondaryText": "Kuala Lumpur City Centre, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia"
        },
        "coords": {
            "lat": 3.1572757,
            "lng": 101.7122335
        },
        "addressComponents": {
            "street1": "",
            "street2": "Kuala Lumpur City Centre",
            "city": "Kuala Lumpur",
            "state": "Wilayah Persekutuan Kuala Lumpur",
            "country": "Malaysia",
            "countryCode": "MY",
            "postCode": "50088"
        }
    }
])
    );
  }),

  rest.post('/api/storage/location-history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "success": true
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
            "minLeftTillExpire": 259719,
            "validFrom": "2025-07-26T07:21:17.135Z",
            "validTo": "2026-01-22T15:59:59.999Z",
            "status": "active",
            "applicableBusiness": [
                "coffee"
            ],
            "minSpendAmount": 0,
            "uniquePromotionId": "688481edb74f9ad2ac2afc9c",
            "uniquePromotionCodeId": "688481edb74f9ad2ac2afc9c"
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
            "minLeftTillExpire": 125799,
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
            "minLeftTillExpire": -186681,
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
            "minLeftTillExpire": -186681,
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

  rest.get('/api/v3/consumers/5d285b152734781c0fcadee2/unique-promos/banners', (req, res, ctx) => {
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
            "minLeftTillExpire": 259719,
            "validFrom": "2025-07-26T07:21:17.135Z",
            "validTo": "2026-01-22T15:59:59.999Z",
            "status": "active",
            "applicableBusiness": [
                "coffee"
            ],
            "minSpendAmount": 0,
            "uniquePromotionId": "688481edb74f9ad2ac2afc9c",
            "uniquePromotionCodeId": "688481edb74f9ad2ac2afc9c"
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

  rest.get('/api/v3/points/rewards/673c348e19d2efca1429ed9d', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "id": "673c348e19d2efca1429ed9d",
        "merchantName": "coffee",
        "rewardSource": "pointsReward",
        "rewardGroupId": "",
        "rewardRefId": "673c348e19d2ef543f29ed99",
        "rewardType": "promotion",
        "validPeriod": 180,
        "validPeriodUnit": "days",
        "costOfPoints": 1,
        "isDeleted": false,
        "isEnabled": true,
        "uniquePromotionId": "6809b29c51dce02a63131d27",
        "uniquePromotionCodeId": "6809b29c51dce02a63131d27",
        "promotion": {
            "id": "673c348e19d2ef543f29ed99",
            "name": "Redeem RM5 Off",
            "promotionCode": "PR1",
            "type": "merchant",
            "discountInfo": {
                "discountType": "absolute",
                "discountValue": 5,
                "maxDiscountAmount": 0
            },
            "productsLimits": [],
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
            }
        }
    },
    "extra": null
})
    );
  }),

  rest.post('/api/v3/points/rewards', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "uniquePromotionCodeId": "688481edb74f9ad2ac2afc9c"
    },
    "extra": null
})
    );
  }),

  rest.get('/api/v3/consumers/5d285b152734781c0fcadee2/unique-promos/688481edb74f9ad2ac2afc9c', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "id": "688481edb74f9ad2ac2afc9c",
        "code": "PR1hwgfp",
        "validFrom": "2025-07-26T07:21:17.135Z",
        "validTo": "2026-01-22T15:59:59.999Z",
        "status": "active",
        "promotion": {
            "id": "673c348e19d2ef543f29ed99",
            "name": "Redeem RM5 Off",
            "promotionCode": "PR1",
            "type": "merchant",
            "discountInfo": {
                "discountType": "absolute",
                "discountValue": 5,
                "maxDiscountAmount": 0
            },
            "productsLimits": [],
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
            }
        }
    },
    "extra": null
})
    );
  })
];
