# StoreHub POS Mock Server API 端点列表

## 认证与授权 APIs

### 员工认证
- `POST /api/v3/auth/login` - 员工登录
- `POST /api/v3/auth/logout` - 员工登出
- `POST /api/v3/auth/refresh` - 刷新访问令牌
- `POST /api/v3/auth/pin` - PIN 码验证
- `POST /api/v3/auth/change-password` - 修改密码
- `GET /api/v3/auth/me` - 获取当前用户信息

### 权限管理
- `GET /api/v3/auth/permissions` - 获取用户权限
- `GET /api/v3/auth/roles` - 获取角色列表
- `POST /api/v3/auth/verify-manager-pin` - 验证管理员 PIN

## 商店管理 APIs

### 商店信息
- `GET /api/v3/stores` - 获取商店列表
- `GET /api/v3/stores/{storeId}` - 获取商店详情
- `PUT /api/v3/stores/{storeId}` - 更新商店信息
- `GET /api/v3/stores/{storeId}/settings` - 获取商店设置
- `PUT /api/v3/stores/{storeId}/settings` - 更新商店设置

### 收银机管理
- `GET /api/v3/stores/{storeId}/registers` - 获取收银机列表
- `GET /api/v3/stores/{storeId}/registers/{registerId}` - 获取收银机详情
- `POST /api/v3/stores/{storeId}/registers` - 创建新收银机
- `PUT /api/v3/stores/{storeId}/registers/{registerId}` - 更新收银机信息
- `DELETE /api/v3/stores/{storeId}/registers/{registerId}` - 删除收银机

### 班次管理
- `GET /api/v3/stores/{storeId}/shifts` - 获取班次列表
- `GET /api/v3/stores/{storeId}/shifts/current` - 获取当前班次
- `POST /api/v3/stores/{storeId}/shifts/start` - 开始班次
- `POST /api/v3/stores/{storeId}/shifts/end` - 结束班次
- `GET /api/v3/stores/{storeId}/shifts/{shiftId}/report` - 获取班次报告

## 产品管理 APIs

### 产品
- `GET /api/v3/products` - 获取产品列表
- `GET /api/v3/products/{productId}` - 获取产品详情
- `POST /api/v3/products` - 创建新产品
- `PUT /api/v3/products/{productId}` - 更新产品信息
- `DELETE /api/v3/products/{productId}` - 删除产品
- `POST /api/v3/products/bulk-update` - 批量更新产品

### 产品分类
- `GET /api/v3/categories` - 获取分类列表
- `GET /api/v3/categories/{categoryId}` - 获取分类详情
- `POST /api/v3/categories` - 创建新分类
- `PUT /api/v3/categories/{categoryId}` - 更新分类
- `DELETE /api/v3/categories/{categoryId}` - 删除分类
- `PUT /api/v3/categories/reorder` - 重新排序分类

### 修饰符
- `GET /api/v3/modifiers` - 获取修饰符列表
- `GET /api/v3/modifiers/{modifierId}` - 获取修饰符详情
- `POST /api/v3/modifiers` - 创建新修饰符
- `PUT /api/v3/modifiers/{modifierId}` - 更新修饰符
- `DELETE /api/v3/modifiers/{modifierId}` - 删除修饰符

### 库存管理
- `GET /api/v3/inventory` - 获取库存列表
- `GET /api/v3/inventory/{productId}` - 获取产品库存
- `PUT /api/v3/inventory/{productId}` - 更新库存数量
- `POST /api/v3/inventory/adjustment` - 库存调整
- `GET /api/v3/inventory/low-stock` - 获取低库存产品

## 交易处理 APIs

### 交易管理
- `GET /api/v3/transactions` - 获取交易列表
- `GET /api/v3/transactions/{transactionId}` - 获取交易详情
- `POST /api/v3/transactions` - 创建新交易
- `PUT /api/v3/transactions/{transactionId}` - 更新交易
- `DELETE /api/v3/transactions/{transactionId}` - 取消交易
- `POST /api/v3/transactions/{transactionId}/void` - 作废交易

### 交易项目
- `POST /api/v3/transactions/{transactionId}/items` - 添加交易项目
- `PUT /api/v3/transactions/{transactionId}/items/{itemId}` - 更新项目
- `DELETE /api/v3/transactions/{transactionId}/items/{itemId}` - 删除项目

### 折扣
- `POST /api/v3/transactions/{transactionId}/discount` - 应用折扣
- `DELETE /api/v3/transactions/{transactionId}/discount` - 移除折扣
- `GET /api/v3/discount-codes/validate` - 验证折扣码

## 支付处理 APIs

### 支付
- `POST /api/v3/transactions/{transactionId}/payments` - 处理支付
- `GET /api/v3/transactions/{transactionId}/payments` - 获取支付列表
- `POST /api/v3/transactions/{transactionId}/payments/{paymentId}/void` - 作废支付

### 退款
- `POST /api/v3/transactions/{transactionId}/refund` - 处理退款
- `GET /api/v3/transactions/{transactionId}/refunds` - 获取退款列表

### 支付方式
- `GET /api/v3/payment-methods` - 获取支付方式列表
- `GET /api/v3/payment-methods/{methodId}/status` - 获取支付方式状态

## 客户管理 APIs

### 客户信息
- `GET /api/v3/customers` - 获取客户列表
- `GET /api/v3/customers/{customerId}` - 获取客户详情
- `POST /api/v3/customers` - 创建新客户
- `PUT /api/v3/customers/{customerId}` - 更新客户信息
- `DELETE /api/v3/customers/{customerId}` - 删除客户
- `GET /api/v3/customers/search` - 搜索客户

### 会员计划
- `GET /api/v3/customers/{customerId}/membership` - 获取会员信息
- `POST /api/v3/customers/{customerId}/membership` - 注册会员
- `GET /api/v3/customers/{customerId}/points` - 获取积分余额
- `POST /api/v3/customers/{customerId}/points/add` - 添加积分
- `POST /api/v3/customers/{customerId}/points/redeem` - 兑换积分

## 员工管理 APIs

### 员工信息
- `GET /api/v3/employees` - 获取员工列表
- `GET /api/v3/employees/{employeeId}` - 获取员工详情
- `POST /api/v3/employees` - 创建新员工
- `PUT /api/v3/employees/{employeeId}` - 更新员工信息
- `DELETE /api/v3/employees/{employeeId}` - 删除员工

### 员工活动
- `POST /api/v3/employees/{employeeId}/clock-in` - 员工打卡上班
- `POST /api/v3/employees/{employeeId}/clock-out` - 员工打卡下班
- `GET /api/v3/employees/{employeeId}/activities` - 获取员工活动记录

## 报表与分析 APIs

### 销售报表
- `GET /api/v3/reports/sales` - 销售报表
- `GET /api/v3/reports/sales/daily` - 日销售报表
- `GET /api/v3/reports/sales/weekly` - 周销售报表
- `GET /api/v3/reports/sales/monthly` - 月销售报表
- `GET /api/v3/reports/sales/by-product` - 按产品销售报表
- `GET /api/v3/reports/sales/by-category` - 按分类销售报表

### 财务报表
- `GET /api/v3/reports/financial/summary` - 财务摘要
- `GET /api/v3/reports/financial/cash-flow` - 现金流报表
- `GET /api/v3/reports/financial/tax` - 税务报表

### 库存报表
- `GET /api/v3/reports/inventory/current` - 当前库存报表
- `GET /api/v3/reports/inventory/movement` - 库存流动报表
- `GET /api/v3/reports/inventory/valuation` - 库存估值报表

## 促销管理 APIs

### 促销活动
- `GET /api/v3/promotions` - 获取促销列表
- `GET /api/v3/promotions/{promotionId}` - 获取促销详情
- `POST /api/v3/promotions` - 创建新促销
- `PUT /api/v3/promotions/{promotionId}` - 更新促销
- `DELETE /api/v3/promotions/{promotionId}` - 删除促销
- `POST /api/v3/promotions/{promotionId}/activate` - 激活促销
- `POST /api/v3/promotions/{promotionId}/deactivate` - 停用促销

## 打印管理 APIs

### 打印任务
- `GET /api/v3/printers` - 获取打印机列表
- `GET /api/v3/printers/{printerId}/status` - 获取打印机状态
- `POST /api/v3/print-jobs` - 创建打印任务
- `GET /api/v3/print-jobs` - 获取打印任务列表
- `GET /api/v3/print-jobs/{jobId}` - 获取打印任务详情
- `POST /api/v3/print-jobs/{jobId}/retry` - 重试打印任务

### 收据管理
- `GET /api/v3/receipts/{transactionId}` - 获取收据
- `POST /api/v3/receipts/{transactionId}/print` - 打印收据
- `POST /api/v3/receipts/{transactionId}/email` - 邮件发送收据

## 设置与配置 APIs

### 系统设置
- `GET /api/v3/settings/system` - 获取系统设置
- `PUT /api/v3/settings/system` - 更新系统设置
- `GET /api/v3/settings/receipt` - 获取收据设置
- `PUT /api/v3/settings/receipt` - 更新收据设置
- `GET /api/v3/settings/tax` - 获取税务设置
- `PUT /api/v3/settings/tax` - 更新税务设置

### 硬件配置
- `GET /api/v3/settings/hardware` - 获取硬件配置
- `PUT /api/v3/settings/hardware` - 更新硬件配置
- `POST /api/v3/settings/hardware/test` - 测试硬件连接

## 数据同步 APIs

### 同步管理
- `GET /api/v3/sync/status` - 获取同步状态
- `POST /api/v3/sync/trigger` - 触发数据同步
- `GET /api/v3/sync/history` - 获取同步历史
- `POST /api/v3/sync/resolve-conflicts` - 解决同步冲突

## 集成 APIs

### 电商平台
- `GET /api/v3/integrations/ecommerce` - 获取电商集成列表
- `POST /api/v3/integrations/ecommerce/{platform}/sync` - 同步电商订单
- `GET /api/v3/integrations/ecommerce/{platform}/orders` - 获取电商订单

### 外卖平台
- `GET /api/v3/integrations/delivery` - 获取外卖集成列表
- `GET /api/v3/integrations/delivery/{platform}/orders` - 获取外卖订单
- `POST /api/v3/integrations/delivery/{platform}/orders/{orderId}/accept` - 接受订单
- `POST /api/v3/integrations/delivery/{platform}/orders/{orderId}/reject` - 拒绝订单

### 支付网关
- `GET /api/v3/integrations/payment-gateways` - 获取支付网关列表
- `GET /api/v3/integrations/payment-gateways/{gateway}/status` - 获取网关状态
- `POST /api/v3/integrations/payment-gateways/{gateway}/test` - 测试支付网关

## WebSocket 事件

### MRS (Multi-Register Sync)
- `mrs:connect` - 注册机连接
- `mrs:transaction:update` - 交易更新
- `mrs:inventory:update` - 库存更新
- `mrs:sync:request` - 同步请求
- `mrs:sync:response` - 同步响应

### KDS (Kitchen Display System)
- `kds:order:new` - 新订单
- `kds:order:update` - 订单更新
- `kds:order:complete` - 订单完成
- `kds:item:bump` - 项目完成

### NCS (Notification Center Service)
- `ncs:notification:new` - 新通知
- `ncs:alert:system` - 系统警告
- `ncs:update:available` - 更新可用

### CFD (Customer Facing Display)
- `cfd:transaction:update` - 交易更新
- `cfd:payment:request` - 支付请求
- `cfd:payment:complete` - 支付完成

## 状态码说明

- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `204 No Content` - 请求成功，无返回内容
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未授权
- `403 Forbidden` - 无权限
- `404 Not Found` - 资源不存在
- `409 Conflict` - 资源冲突
- `422 Unprocessable Entity` - 验证失败
- `500 Internal Server Error` - 服务器错误
- `503 Service Unavailable` - 服务不可用