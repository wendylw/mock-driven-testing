/**
 * 智能 API 捕获工具 - 自动适应代理和各种 API 模式
 */

(function() {
    console.log('🚀 智能 API 捕获工具启动中...');
    
    // 存储捕获的 API 调用
    window.capturedAPIs = window.capturedAPIs || [];
    
    // 保存原始的 fetch
    const originalFetch = window.fetch;
    
    // 智能判断是否是 API 调用
    function isAPICall(url) {
        // 转换为完整 URL
        const fullUrl = new URL(url, window.location.origin).href;
        
        // 多种 API 模式
        const patterns = [
            /\/api\//,                              // 标准 /api/ 路径
            /\.json$/,                              // JSON 文件
            /\/(v1|v2|v3)\//,                       // 版本化 API
            /\/(graphql|rest)\//,                   // GraphQL 或 REST
            /https:\/\/.*\.beep\..*\//,            // beep 域名
            /\/(user|users|product|products|cart|order|payment)/, // 常见资源
        ];
        
        // 排除静态资源
        const excludePatterns = [
            /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/,
            /\/static\//,
            /\/assets\//,
            /hot-update/
        ];
        
        // 检查是否匹配排除模式
        if (excludePatterns.some(pattern => pattern.test(fullUrl))) {
            return false;
        }
        
        // 检查是否匹配 API 模式
        return patterns.some(pattern => pattern.test(fullUrl));
    }
    
    // 重写 fetch
    window.fetch = async function(...args) {
        const [url, options = {}] = args;
        const method = (options.method || 'GET').toUpperCase();
        
        if (isAPICall(url)) {
            const apiUrl = new URL(url, window.location.origin).href;
            console.log(`📡 检测到 API 调用: ${method} ${apiUrl}`);
            
            try {
                // 执行原始请求
                const response = await originalFetch.apply(this, args);
                
                // 尝试解析响应
                let responseData = null;
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                    try {
                        const clonedResponse = response.clone();
                        responseData = await clonedResponse.json();
                    } catch (e) {
                        console.warn('⚠️ 无法解析 JSON 响应');
                    }
                }
                
                // 记录请求和响应
                const capturedCall = {
                    timestamp: new Date().toISOString(),
                    method: method,
                    url: apiUrl,
                    endpoint: new URL(url, window.location.origin).pathname,
                    requestBody: options.body ? tryParseJSON(options.body) : null,
                    responseStatus: response.status,
                    responseData: responseData,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                };
                
                window.capturedAPIs.push(capturedCall);
                console.log(`✅ 已捕获: ${capturedCall.endpoint} (${response.status})`);
                
                // 如果是重要的 API，显示预览
                if (responseData && (capturedCall.endpoint.includes('product') || 
                    capturedCall.endpoint.includes('cart') || 
                    capturedCall.endpoint.includes('user'))) {
                    console.log('📦 响应预览:', responseData);
                }
                
                return response;
            } catch (error) {
                console.error('❌ 捕获过程出错:', error);
                return originalFetch.apply(this, args);
            }
        }
        
        return originalFetch.apply(this, args);
    };
    
    // 尝试解析 JSON
    function tryParseJSON(str) {
        try {
            return JSON.parse(str);
        } catch {
            return str;
        }
    }
    
    // 监听 XMLHttpRequest (以防使用旧版 AJAX)
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        return originalXHROpen.apply(this, arguments);
    };
    
    XMLHttpRequest.prototype.send = function(body) {
        if (isAPICall(this._url)) {
            const apiUrl = new URL(this._url, window.location.origin).href;
            console.log(`📡 检测到 XHR API 调用: ${this._method} ${apiUrl}`);
            
            this.addEventListener('load', function() {
                try {
                    const responseData = this.responseText ? tryParseJSON(this.responseText) : null;
                    
                    const capturedCall = {
                        timestamp: new Date().toISOString(),
                        method: this._method,
                        url: apiUrl,
                        endpoint: new URL(this._url, window.location.origin).pathname,
                        requestBody: body ? tryParseJSON(body) : null,
                        responseStatus: this.status,
                        responseData: responseData,
                        responseHeaders: this.getAllResponseHeaders()
                    };
                    
                    window.capturedAPIs.push(capturedCall);
                    console.log(`✅ XHR 已捕获: ${capturedCall.endpoint} (${this.status})`);
                } catch (error) {
                    console.error('❌ XHR 捕获出错:', error);
                }
            });
        }
        
        return originalXHRSend.apply(this, arguments);
    };
    
    // 增强的下载功能
    window.downloadCapturedAPIs = function() {
        if (window.capturedAPIs.length === 0) {
            console.warn('⚠️  还没有捕获到任何 API 调用');
            console.log('💡 提示: 请刷新页面或点击页面上的链接来触发 API 调用');
            return;
        }
        
        const data = {
            captureDate: new Date().toISOString(),
            appUrl: window.location.origin,
            totalCalls: window.capturedAPIs.length,
            uniqueEndpoints: [...new Set(window.capturedAPIs.map(c => c.endpoint))],
            calls: window.capturedAPIs
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `beep-api-capture-${Date.now()}.json`;
        a.click();
        
        console.log(`✅ 已下载 ${window.capturedAPIs.length} 个 API 调用`);
    };
    
    // 增强的统计功能
    window.showCaptureStats = function() {
        if (window.capturedAPIs.length === 0) {
            console.warn('⚠️ 还没有捕获到任何 API 调用');
            return;
        }
        
        const endpoints = window.capturedAPIs.reduce((acc, call) => {
            acc[call.endpoint] = (acc[call.endpoint] || 0) + 1;
            return acc;
        }, {});
        
        console.log('📊 API 捕获统计:');
        console.log(`总调用次数: ${window.capturedAPIs.length}`);
        console.log('\n各端点调用次数:');
        Object.entries(endpoints)
            .sort((a, b) => b[1] - a[1])
            .forEach(([endpoint, count]) => {
                console.log(`  ${endpoint}: ${count} 次`);
            });
        
        // 显示最近的 API 调用
        console.log('\n🕐 最近 5 个 API 调用:');
        window.capturedAPIs.slice(-5).forEach((api, i) => {
            console.log(`  ${i + 1}. ${api.method} ${api.endpoint} (${api.responseStatus})`);
        });
    };
    
    // 查看特定 API 的详情
    window.viewAPI = function(index) {
        if (!window.capturedAPIs[index]) {
            console.error('❌ 索引无效');
            return;
        }
        
        const api = window.capturedAPIs[index];
        console.log('📋 API 详情:');
        console.log('URL:', api.url);
        console.log('Method:', api.method);
        console.log('Status:', api.responseStatus);
        console.log('Response:', api.responseData);
    };
    
    // 搜索 API
    window.searchAPI = function(keyword) {
        const results = window.capturedAPIs.filter(api => 
            api.endpoint.includes(keyword) || 
            JSON.stringify(api.responseData).includes(keyword)
        );
        
        console.log(`🔍 搜索 "${keyword}" 的结果:`);
        results.forEach((api, i) => {
            console.log(`${i}. ${api.method} ${api.endpoint}`);
        });
        
        return results;
    };
    
    console.log('✅ 智能 API 捕获工具已就绪！');
    console.log('\n📝 使用说明:');
    console.log('- 正常使用应用，API 调用会被自动捕获');
    console.log('- showCaptureStats() - 查看捕获统计');
    console.log('- downloadCapturedAPIs() - 下载所有数据');
    console.log('- viewAPI(index) - 查看特定 API 详情');
    console.log('- searchAPI("keyword") - 搜索 API');
    console.log('\n💡 现在请刷新页面或进行操作来捕获 API！');
})();