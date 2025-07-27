# Mock-Driven Testing 多项目支持方案 V3 - 实用版

## 设计原则
1. **从简单开始** - 先支持已有的2个项目
2. **最小配置** - 能自动的就不要手动
3. **逐步扩展** - 遇到新项目再添加支持
4. **不改项目代码** - 所有逻辑在 mock-driven-testing 内部
5. **保持现有访问模式** - 支持域名访问（如 coffee.beep.local.shub.us）

## 第一阶段：支持 beep 和 backoffice（1周）

### 1.1 简单的项目配置文件
```javascript
// config/projects.js
module.exports = {
  'beep-v1-webapp': {
    name: 'Beep V1',
    dir: '../beep-v1-webapp',
    targetPort: 3000,
    proxyPort: 3001,  // 固定端口，保持向后兼容
    apiHost: 'coffee.beep.test17.shub.us',
    domains: ['*.beep.local.shub.us'],  // 支持多business域名
    supportedBusinesses: ['coffee', 'jw', 'www']  // 已知的business列表
  },
  'backoffice-v2-webapp': {
    name: 'BackOffice V2',
    dir: '../backoffice-v2-webapp',
    targetPort: 8001,
    proxyPort: 3003,  // 固定端口，避免冲突
    apiHost: 'coffee.backoffice.test17.shub.us',
    domains: ['*.backoffice.local.shub.us'],
    sessionHandler: 'backoffice' // 特殊session处理
  }
};
```

### 1.2 统一的启动命令
```bash
# 启动 beep 项目的代理
npm run proxy beep-v1-webapp

# 启动 backoffice 项目的代理
npm run proxy backoffice-v2-webapp
```

### 1.3 重构当前代理服务器
将 `proxy-final.js` 重构为可配置版本：

```javascript
// proxy-server.js
class ProxyServer {
  constructor(projectName) {
    this.config = require('./config/projects')[projectName];
    this.proxyPort = this.config.proxyPort; // 使用固定端口
    this.capturedAPIs = [];
    this.apiPatterns = {};
  }
  
  start() {
    console.log(`启动 ${this.config.name} 代理`);
    console.log(`代理端口: ${this.proxyPort}`);
    console.log(`目标端口: ${this.config.targetPort}`);
    console.log(`API服务器: ${this.config.apiHost}`);
    console.log(`支持域名: ${this.config.domains.join(', ')}`);
    
    // 访问示例
    if (this.config.supportedBusinesses) {
      console.log('\n访问示例:');
      this.config.supportedBusinesses.forEach(business => {
        const domain = this.config.domains[0].replace('*', business);
        console.log(`  http://${domain}:${this.proxyPort}`);
      });
    }
    
    this.createServer();
  }
  
  // 保留现有的域名处理逻辑
  resolveBusinessName(hostname) {
    const hostnames = hostname.split('.');
    return hostnames[0];
  }
  
  handleApiRequest(req, res) {
    const businessName = this.resolveBusinessName(req.headers.host);
    // 根据business组织Mock数据
    const mockPath = `generated/${this.projectName}/${businessName}/`;
    // ...
  }
}

// cli.js
const projectName = process.argv[2];
if (!projectName) {
  console.log('可用项目:');
  console.log('- beep-v1-webapp');
  console.log('- backoffice-v2-webapp');
  process.exit(1);
}

const server = new ProxyServer(projectName);
server.start();
```

### 1.4 Session处理策略
```javascript
// session-handlers/default.js
class DefaultSessionHandler {
  onProxyReq(proxyReq, req) {
    // 默认不处理
  }
  
  onProxyRes(proxyRes, req, res) {
    // 默认不处理
  }
}

// session-handlers/backoffice.js
class BackofficeSessionHandler {
  onProxyReq(proxyReq, req) {
    // 处理 connect.sid.fat cookie
  }
  
  onProxyRes(proxyRes, req, res) {
    // 处理响应中的 cookie
  }
}
```

### 1.5 输出目录自动管理
```
generated/
├── beep-v1-webapp/
│   ├── coffee/                    # 按business组织
│   │   ├── api-mocks-realtime.js
│   │   └── captured-data/
│   ├── jw/
│   │   ├── api-mocks-realtime.js
│   │   └── captured-data/
│   └── common/                    # 通用Mock（如登录）
│       └── api-mocks-common.js
└── backoffice-v2-webapp/
    ├── coffee/
    │   ├── api-mocks-realtime.js
    │   └── captured-data/
    └── common/
        └── api-mocks-common.js
```

## 第二阶段：优化和增强（3-5天）

### 2.1 访问地址管理
```javascript
// 生成 hosts 配置提示
function generateHostsConfig(project) {
  if (!project.domains) return;
  
  console.log('\n请确保 /etc/hosts 包含以下配置:');
  project.supportedBusinesses.forEach(business => {
    const domain = project.domains[0].replace('*', business);
    console.log(`127.0.0.1    ${domain}`);
  });
}

// 访问地址汇总
npm run proxy beep-v1-webapp
输出:
✅ 代理服务器已启动
📍 访问地址:
   - http://coffee.beep.local.shub.us:3001
   - http://jw.beep.local.shub.us:3001
   - http://www.beep.local.shub.us:3001
```

### 2.2 统一状态查看
```bash
# 查看所有项目状态
npm run status

输出:
┌─────────────────────┬────────┬───────────┬─────────┐
│ 项目                │ 状态   │ 代理端口  │ API调用 │
├─────────────────────┼────────┼───────────┼─────────┤
│ beep-v1-webapp      │ 运行中 │ 3001      │ 245     │
│ backoffice-v2-webapp│ 停止   │ 3002      │ 0       │
└─────────────────────┴────────┴───────────┴─────────┘
```

### 2.3 Mock数据共享机制
```javascript
// 识别通用API（如登录、用户信息）
// 存储在 shared-mocks/ 目录
// 项目可以选择使用共享Mock或自己的Mock
```

## 第三阶段：逐步添加新项目（按需）

### 3.1 添加新项目的流程
1. 在 `config/projects.js` 添加配置
2. 如需特殊处理，添加相应的handler
3. 运行测试确保正常工作

### 3.2 示例：添加小程序支持
```javascript
// 当需要支持小程序时再添加
'beep-v1-gcash-miniprogram': {
  name: 'Beep GCash Mini',
  dir: '../beep-v1-GCash_mini_program',
  type: 'miniprogram',
  // 小程序可能需要不同的代理策略
  proxyStrategy: 'miniprogram'
}
```

## 实施步骤

### Week 1
- [ ] 提取配置到 config/projects.js
- [ ] 重构 proxy-final.js 为可配置版本
- [ ] 实现简单的端口管理
- [ ] 支持 beep 和 backoffice 两个项目
- [ ] 测试确保功能正常

### Week 2
- [ ] 优化端口管理（持久化、冲突检测）
- [ ] 添加状态查看功能
- [ ] 优化日志和错误处理
- [ ] 编写使用文档

### 后续（按需）
- 遇到新项目类型时添加支持
- 根据实际使用反馈优化
- 逐步建立Mock共享机制

## 关键决策

1. **不做自动检测** - 手动配置更可控
2. **不做插件系统** - 直接写代码更简单
3. **使用固定端口** - beep用3001，backoffice用3003，保持向后兼容
4. **按business组织Mock** - 不同商家的数据分开管理
5. **保留域名访问** - 完全兼容现有的访问方式

## 成功标准

1. 能同时运行 beep 和 backoffice 的Mock代理
2. 不需要修改项目代码
3. 配置简单，5分钟内能添加新项目
4. 稳定可靠，不影响开发体验
5. 完全兼容现有访问方式（域名+端口）
6. 支持多business的Mock数据隔离

## 风险和限制

1. 目前只考虑了前端项目，后端项目支持待定
2. 假设所有项目都在本地同一台机器
3. 暂不支持分布式部署
4. Mock数据暂时没有版本管理
5. 需要手动配置 /etc/hosts 文件

## 使用示例

```bash
# 启动 beep 项目
npm run proxy beep-v1-webapp

# 在浏览器访问
http://coffee.beep.local.shub.us:3001
http://jw.beep.local.shub.us:3001

# 启动 backoffice 项目
npm run proxy backoffice-v2-webapp

# 在浏览器访问
http://coffee.backoffice.local.shub.us:3003
```

这个方案的核心是：**先解决当前问题，有新需求时再扩展**。