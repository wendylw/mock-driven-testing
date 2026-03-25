const scenarioTemplates = {
  base: {
    normal: {
      name: "正常响应场景",
      description: "所有API返回正常响应",
      tags: ["normal", "happy-path"],
      variables: {
        responseDelay: 0,
        timestamp: "{{now}}"
      },
      mockOverrides: {
        response: {
          status: 200
        }
      }
    },

    error: {
      name: "错误响应场景",
      description: "模拟各种错误情况",
      tags: ["error", "negative-test"],
      subScenarios: {
        unauthorized: {
          name: "未授权错误",
          mockOverrides: {
            response: {
              status: 401,
              body: {
                error: "Unauthorized",
                message: "Authentication required"
              }
            }
          }
        },
        forbidden: {
          name: "禁止访问错误",
          mockOverrides: {
            response: {
              status: 403,
              body: {
                error: "Forbidden",
                message: "Access denied"
              }
            }
          }
        },
        notFound: {
          name: "资源不存在",
          mockOverrides: {
            response: {
              status: 404,
              body: {
                error: "Not Found",
                message: "Resource not found"
              }
            }
          }
        },
        serverError: {
          name: "服务器错误",
          mockOverrides: {
            response: {
              status: 500,
              body: {
                error: "Internal Server Error",
                message: "An unexpected error occurred"
              }
            }
          }
        }
      }
    },

    boundary: {
      name: "边界测试场景",
      description: "测试各种边界条件",
      tags: ["boundary", "edge-case"],
      subScenarios: {
        emptyData: {
          name: "空数据",
          mockOverrides: {
            response: {
              status: 200,
              body: {
                data: [],
                total: 0
              }
            }
          }
        },
        largeData: {
          name: "大数据量",
          mockOverrides: {
            response: {
              status: 200,
              body: {
                data: "{{generateArray(1000)}}",
                total: 1000
              }
            }
          }
        },
        specialCharacters: {
          name: "特殊字符",
          mockOverrides: {
            response: {
              status: 200,
              body: {
                data: "!@#$%^&*()_+-=[]{}|;':\",./<>?",
                unicode: "你好世界 🌍 emojis"
              }
            }
          }
        },
        nullValues: {
          name: "空值测试",
          mockOverrides: {
            response: {
              status: 200,
              body: {
                string: null,
                number: null,
                object: null,
                array: null
              }
            }
          }
        }
      }
    },

    performance: {
      name: "性能测试场景",
      description: "模拟各种性能情况",
      tags: ["performance", "load-test"],
      subScenarios: {
        slowResponse: {
          name: "慢速响应",
          mockOverrides: {
            response: {
              delay: 3000
            }
          }
        },
        timeout: {
          name: "请求超时",
          mockOverrides: {
            response: {
              delay: 30000
            }
          }
        },
        throttled: {
          name: "限流响应",
          mockOverrides: {
            response: {
              status: 429,
              headers: {
                "Retry-After": "60"
              },
              body: {
                error: "Too Many Requests",
                message: "Rate limit exceeded"
              }
            }
          }
        }
      }
    }
  },

  business: {
    ecommerce: {
      name: "电商业务场景",
      description: "电商相关的测试场景",
      scenarios: {
        productOutOfStock: {
          name: "商品缺货",
          mocks: [
            {
              url: "/api/products/*",
              overrides: {
                response: {
                  body: {
                    stock: 0,
                    available: false
                  }
                }
              }
            },
            {
              url: "/api/cart/add",
              overrides: {
                response: {
                  status: 400,
                  body: {
                    error: "OUT_OF_STOCK",
                    message: "Product is out of stock"
                  }
                }
              }
            }
          ]
        },
        paymentFailed: {
          name: "支付失败",
          mocks: [
            {
              url: "/api/payment/process",
              overrides: {
                response: {
                  status: 400,
                  body: {
                    error: "PAYMENT_FAILED",
                    message: "Payment processing failed"
                  }
                }
              }
            }
          ]
        },
        highTraffic: {
          name: "高流量场景",
          description: "模拟黑五或促销期间的高流量",
          variables: {
            queuePosition: "{{random(1, 1000)}}",
            waitTime: "{{random(10, 300)}}"
          },
          mocks: [
            {
              url: "/api/queue/status",
              overrides: {
                response: {
                  status: 200,
                  body: {
                    inQueue: true,
                    position: "{{queuePosition}}",
                    estimatedWaitTime: "{{waitTime}}"
                  }
                }
              }
            }
          ]
        }
      }
    },

    banking: {
      name: "银行业务场景",
      description: "银行和金融相关的测试场景",
      scenarios: {
        insufficientFunds: {
          name: "余额不足",
          mocks: [
            {
              url: "/api/account/balance",
              overrides: {
                response: {
                  body: {
                    available: 10.50,
                    currency: "USD"
                  }
                }
              }
            },
            {
              url: "/api/transfer",
              overrides: {
                response: {
                  status: 400,
                  body: {
                    error: "INSUFFICIENT_FUNDS",
                    message: "Insufficient funds for this transaction"
                  }
                }
              }
            }
          ]
        },
        maintenanceMode: {
          name: "系统维护",
          mocks: [
            {
              url: "*",
              overrides: {
                response: {
                  status: 503,
                  headers: {
                    "Retry-After": "3600"
                  },
                  body: {
                    error: "SERVICE_UNAVAILABLE",
                    message: "System under maintenance",
                    estimatedTime: "{{date}} 02:00 AM"
                  }
                }
              }
            }
          ]
        }
      }
    }
  },

  helpers: {
    generateArray: function(count) {
      return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        value: `Item ${i + 1}`
      }));
    },
    
    random: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    pickRandom: function(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
  },

  createScenarioFromTemplate: function(templatePath, customizations = {}) {
    const pathParts = templatePath.split('.');
    let template = this;
    
    for (const part of pathParts) {
      template = template[part];
      if (!template) {
        throw new Error(`Template not found: ${templatePath}`);
      }
    }

    return {
      ...template,
      ...customizations,
      createdFrom: templatePath,
      createdAt: new Date().toISOString()
    };
  }
};

module.exports = scenarioTemplates;