/**
 * API Capture Tool - 捕获 beep-v1-webapp 的真实 API 调用
 * 
 * 使用方法：
 * 1. 在 beep-v1-webapp 的浏览器控制台中运行这段代码
 * 2. 正常操作应用（浏览页面、点击按钮等）
 * 3. 运行 window.downloadCapturedAPIs() 下载捕获的数据
 */

(function() {
    console.log('🎯 API Capture Tool 已启动！');
    
    // 存储捕获的 API 调用
    window.capturedAPIs = [];
    
    // 保存原始的 fetch
    const originalFetch = window.fetch;
    
    // 重写 fetch
    window.fetch = async function(...args) {
        const [url, options = {}] = args;
        const method = (options.method || 'GET').toUpperCase();
        
        // 只捕获 API 调用
        if (url.includes('/api/')) {
            console.log(`📡 捕获 API 调用: ${method} ${url}`);
            
            try {
                // 执行原始请求
                const response = await originalFetch.apply(this, args);
                
                // 克隆响应以读取数据
                const clonedResponse = response.clone();
                const responseData = await clonedResponse.json();
                
                // 记录请求和响应
                const capturedCall = {
                    timestamp: new Date().toISOString(),
                    method: method,
                    url: url,
                    endpoint: new URL(url, window.location.origin).pathname,
                    requestBody: options.body ? JSON.parse(options.body) : null,
                    responseStatus: response.status,
                    responseData: responseData,
                    responseHeaders: Object.fromEntries(response.headers.entries())
                };
                
                window.capturedAPIs.push(capturedCall);
                console.log('✅ 已捕获:', capturedCall.endpoint);
                
                return response;
            } catch (error) {
                console.error('❌ 捕获失败:', error);
                return originalFetch.apply(this, args);
            }
        }
        
        return originalFetch.apply(this, args);
    };
    
    // 如果使用 axios
    if (window.axios) {
        // 添加请求拦截器
        window.axios.interceptors.request.use(function (config) {
            console.log(`📡 Axios 请求: ${config.method.toUpperCase()} ${config.url}`);
            return config;
        });
        
        // 添加响应拦截器
        window.axios.interceptors.response.use(function (response) {
            if (response.config.url.includes('/api/')) {
                const capturedCall = {
                    timestamp: new Date().toISOString(),
                    method: response.config.method.toUpperCase(),
                    url: response.config.url,
                    endpoint: new URL(response.config.url, window.location.origin).pathname,
                    requestBody: response.config.data,
                    responseStatus: response.status,
                    responseData: response.data,
                    responseHeaders: response.headers
                };
                
                window.capturedAPIs.push(capturedCall);
                console.log('✅ Axios 已捕获:', capturedCall.endpoint);
            }
            return response;
        });
    }
    
    // 下载捕获的数据
    window.downloadCapturedAPIs = function() {
        if (window.capturedAPIs.length === 0) {
            console.warn('⚠️  还没有捕获到任何 API 调用');
            return;
        }
        
        const data = {
            captureDate: new Date().toISOString(),
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
    
    // 显示捕获统计
    window.showCaptureStats = function() {
        const endpoints = window.capturedAPIs.reduce((acc, call) => {
            acc[call.endpoint] = (acc[call.endpoint] || 0) + 1;
            return acc;
        }, {});
        
        console.log('📊 API 捕获统计:');
        console.log(`总调用次数: ${window.capturedAPIs.length}`);
        console.log('各端点调用次数:');
        Object.entries(endpoints).forEach(([endpoint, count]) => {
            console.log(`  ${endpoint}: ${count} 次`);
        });
    };
    
    // 清除捕获的数据
    window.clearCapturedAPIs = function() {
        window.capturedAPIs = [];
        console.log('🧹 已清除所有捕获的 API 数据');
    };
    
    console.log('📝 使用说明:');
    console.log('- 正常使用应用，API 调用会被自动捕获');
    console.log('- 运行 showCaptureStats() 查看统计');
    console.log('- 运行 downloadCapturedAPIs() 下载数据');
    console.log('- 运行 clearCapturedAPIs() 清除数据');
})();