/**
 * 实时捕获的 API Mock - Beep V1 WebApp (coffee)
 * 自动生成时间: 2025-07-27T03:46:04.985Z
 * 已捕获 29 个端点
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
                    "hash": "U2FsdGVkX180vV3upZBKsHKhXHiOP0RA7IQ6%2FKFxFh0dYHu2tFYxFY%2BUULt1WsZ4"
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
                    "hash": "U2FsdGVkX19tokSqzl3YGg1NF4KyFj%2BirvtLjSSyJILjECHRJI5FsPuFDZvIg4RN"
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
                    "hash": "U2FsdGVkX1%2BYqzUNZ%2FB7WaomV9rIJGs4aeCVLYjSxmSyl9EqZHeF7omGIQtPs3BX"
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
                    "hash": "U2FsdGVkX18v%2FGqwlIxFrzbGPJ8r82xOjlAS6jgdr0gpgRhaO1ymn7BCRs%2FOTs3v"
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
    "redirectTo": "U2FsdGVkX19mMB1euzTlY6jMvqztO%2FNZo65DUlFd7wq28bGJdHW4gmzJ7S8AJ%2BiS"
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
        "modifiedTime": "2025-07-27T11:34:35.883+08:00",
        "source": "BeepQR",
        "availablePointsBalance": 8798,
        "customerTier": {
            "id": "673c348ec30f7680c89f4c70",
            "name": "platinum",
            "level": 4,
            "totalSpent": 242.65,
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

  rest.post('/api/gql/ProductDetail', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
            "variations": [],
            "trackInventory": false,
            "childrenMap": [],
            "stockStatus": "notTrackInventory"
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
                "id": "e487d0b3d7907c3e1942a10d387b65a0",
                "business": "coffee",
                "quantity": 1
            }
        }
    }
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
        "availableCount": 0
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

  rest.get('/api/cart/checkInventory', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "allInStock": true
})
    );
  }),

  rest.get('/api/storage/location-history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
    {
        "address": "Sentul, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        "coords": {
            "lat": 3.2066139,
            "lng": 101.6820313
        },
        "placeId": "ChIJZYfNNd1HzDERWCLEjeGeACY",
        "addressComponents": {
            "street1": "",
            "street2": "Sentul",
            "city": "Kuala Lumpur",
            "state": "Federal Territory of Kuala Lumpur",
            "country": "Malaysia",
            "countryCode": "MY",
            "postCode": ""
        },
        "displayComponents": {
            "mainText": "Sentul",
            "secondaryText": "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia"
        }
    },
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
            "point_of_interest",
            "establishment",
            "shopping_mall"
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

  rest.get('/api/consumers/5d285b152734781c0fcadee2/store/67220fa7e097f8000711b668/address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
    {
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

  rest.put('/api/consumers/5d285b152734781c0fcadee2/address/6867686997bd965f597f6517', (req, res, ctx) => {
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
    "postCode": "47800"
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
                "id": "d3df7ab1-fec3-4a5b-8f7e-40b28106048c",
                "pax": 1,
                "total": 20.5,
                "orderId": "851316520069368",
                "status": "created",
                "tableId": null,
                "pickUpId": "P7-0001",
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

  rest.get('/api/transactions/851316520069368/status', (req, res, ctx) => {
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

  rest.get('/api/cashback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "status": "Invalid",
    "cashback": "1.02",
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

  rest.get('/api/transactions/851316520069368/review', (req, res, ctx) => {
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
            "receiptNumber": "851316520069368",
            "business": "coffee",
            "displayBusinessName": "coffee",
            "createdTime": "2025-07-27T03:34:26.890Z",
            "total": 20.5,
            "storeId": "67220fa7e097f8000711b668",
            "tableId": null,
            "status": "accepted",
            "shippingType": "delivery",
            "fulfillDate": "2025-07-28T03:00:00.000Z",
            "paidDate": "2025-07-27T03:34:34.980Z",
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
                    "discount": 0,
                    "quantity": 1,
                    "productId": "67287951e097f800076d1bb5",
                    "tax": 0,
                    "total": 8,
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

  rest.post('/api/gql/Order', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "data": {
        "order": {
            "business": "coffee",
            "tax": 0,
            "createdTime": "2025-07-27T11:34:26+08:00",
            "orderId": "851316520069368",
            "status": "accepted",
            "productsManualDiscount": null,
            "subtotal": 8,
            "paymentMethod": "Online",
            "roundedAmount": 0,
            "total": 20.5,
            "storeId": "67220fa7e097f8000711b668",
            "tableId": null,
            "pickUpId": "P7-0001",
            "serviceCharge": 0,
            "shippingType": "delivery",
            "shippingFee": 12.5,
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
                    "shippingFee": 12.5,
                    "trackingId": "",
                    "trackingUrl": null,
                    "comments": "test",
                    "useStorehubLogistics": true,
                    "address": {
                        "name": "Ttest2",
                        "phone": "+60123456789",
                        "address": "Level 2, Sentul, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
                        "deliveryTo": "Sentul, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
                        "addressDetails": "Level 2",
                        "city": "Kuala Lumpur",
                        "country": "MY",
                        "state": null,
                        "postCode": "47800",
                        "companyName": null,
                        "location": {
                            "longitude": 101.6820313,
                            "latitude": 3.2066139
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
                    "receiptNumber": "851316520069368",
                    "time": "2025-07-27T03:34:35.558Z",
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
                    "receiptNumber": "851316520069368",
                    "time": "2025-07-27T03:34:35.080Z",
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
                    "receiptNumber": "851316520069368",
                    "time": "2025-07-27T03:34:28.233Z",
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
                    "id": "68859e421b19115d05903f35",
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
            "displayPromotions": [],
            "createdVouchers": [],
            "takeawayCharges": 0,
            "fixedFee": 0,
            "isPayLater": false,
            "customerId": "f23a173e-7a3c-49d3-9092-65b79b6caef1",
            "eInvoiceRelatedInfo": {
                "linkType": "notSupported",
                "link": null
            },
            "paidTime": "2025-07-27T03:34:35.080Z",
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

  rest.post('/api/v3/transactions/851316520069368/rewards', (req, res, ctx) => {
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
            "amount": 1000
        },
        "cashback": {
            "amount": 1.02,
            "status": "Claimed_Repeat"
        }
    },
    "extra": null
})
    );
  })
];
