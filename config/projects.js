/**
 * Mock-Driven Testing 项目配置
 * 
 * 配置说明：
 * - name: 项目显示名称
 * - dir: 项目相对路径
 * - targetPort: 开发服务器端口
 * - proxyPort: 代理服务器端口（固定）
 * - apiHost: API服务器域名
 * - domains: 支持的本地域名模式
 * - supportedBusinesses: 已知的业务域名前缀
 * - sessionHandler: 特殊session处理器（可选）
 */

module.exports = {
  'beep-v1-webapp': {
    name: 'Beep V1 WebApp',
    dir: '../beep-v1-webapp',
    targetPort: 3000,
    proxyPort: 3001,  // 固定端口，保持向后兼容
    apiHost: 'coffee.beep.test17.shub.us',
    domains: ['*.beep.local.shub.us'],  // 支持多business域名
    supportedBusinesses: ['coffee', 'jw', 'www'],  // 已知的business列表
    // API路径模式（用于识别API请求）
    apiPatterns: ['/api/'],
    // 静态资源路径
    staticPaths: ['/static', '/img', '/css', '/js']
  },
  
  'backoffice-v2-webapp': {
    name: 'BackOffice V2',
    dir: '../backoffice-v2-webapp',
    targetPort: 8001,
    proxyPort: 3003,  // 固定端口，避免冲突
    apiHost: 'coffee.backoffice.test17.shub.us',
    domains: ['*.backoffice.local.shub.us'],
    supportedBusinesses: ['coffee'],
    sessionHandler: 'backoffice', // 特殊session处理（connect.sid.fat）
    apiPatterns: ['/api/'],
    staticPaths: ['/static', '/img', '/scripts', '/assets', '/css', '/files', '/ico', '/fonts']
  }
};

// 通过端口查找项目配置
module.exports.findByPort = function(port) {
  for (const [key, config] of Object.entries(module.exports)) {
    if (typeof config === 'object' && config.proxyPort === port) {
      return { projectName: key, ...config };
    }
  }
  return null;
};

// 通过域名查找项目配置
module.exports.findByDomain = function(domain) {
  for (const [key, config] of Object.entries(module.exports)) {
    if (typeof config === 'object' && config.domains) {
      for (const domainPattern of config.domains) {
        const regex = new RegExp(domainPattern.replace('*', '[^.]+'));
        if (regex.test(domain)) {
          return { projectName: key, ...config };
        }
      }
    }
  }
  return null;
};