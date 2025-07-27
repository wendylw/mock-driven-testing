/**
 * BackOffice 特殊 session 处理器
 * 处理 connect.sid.fat cookie 机制
 */

module.exports = {
  onProxyReq(options, req) {
    // 处理请求中的 cookie
    if (req.headers.cookie) {
      const cookieHeader = req.headers.cookie;
      const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
      const connectSidFatCookie = cookies.find(cookie => cookie.startsWith('connect.sid.fat='));
      
      if (connectSidFatCookie) {
        const connectSidFatValue = connectSidFatCookie.split('=')[1];
        const updatedCookies = cookies.map(cookie =>
          cookie.startsWith('connect.sid=') ? `connect.sid=${connectSidFatValue}` : cookie
        );
        
        if (!cookies.some(cookie => cookie.startsWith('connect.sid='))) {
          updatedCookies.push(`connect.sid=${connectSidFatValue}`);
        }
        
        const updatedCookieHeader = updatedCookies.join('; ');
        options.headers.cookie = updatedCookieHeader;
        
        console.log('🍪 BackOffice Session: 更新 Cookie');
      }
    }
  },
  
  onProxyRes(proxyRes, req, res) {
    // 移除原始的 connect.sid cookie
    if (proxyRes.headers['set-cookie']) {
      proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].filter(
        cookie => !cookie.startsWith('connect.sid=')
      );
    }
    
    // 如果是登录响应，添加 fat session cookie
    if (req.url === '/login' && proxyRes.statusCode === 200) {
      const sessionCookie = (proxyRes.headers['set-cookie'] || []).find(
        cookie => cookie.startsWith('connect.sid=')
      );
      
      if (sessionCookie) {
        const sessionId = sessionCookie.match(/connect\.sid=([^;]+)/i)[1];
        const sessionExpiresMatch = sessionCookie.match(/expires=([^;]+)/i);
        const sessionExpires = sessionExpiresMatch ? sessionExpiresMatch[1] : undefined;
        
        const domainWithoutBusiness = req.headers.host.replace(/^[^.]+/, '').split(':')[0];
        
        proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'] || [];
        proxyRes.headers['set-cookie'].push(
          `connect.sid.fat=${sessionId}; Domain=${domainWithoutBusiness}; ${
            sessionExpires ? 'Expires=' + sessionExpires + ';' : ''
          } HttpOnly`
        );
        
        console.log('🍪 BackOffice Session: 设置 fat cookie');
      }
    }
  }
};