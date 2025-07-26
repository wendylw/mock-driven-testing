#!/usr/bin/env node

/**
 * 从捕获的真实 API 数据更新 Mock 生成器
 */

const fs = require('fs');
const path = require('path');

class MockUpdater {
  constructor() {
    this.capturedData = null;
    this.existingMocks = null;
    this.updatedMocks = {};
  }

  // 加载捕获的数据
  loadCapturedData(filePath) {
    console.log(`📥 加载捕获的 API 数据: ${filePath}`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    this.capturedData = data;
    console.log(`✅ 已加载 ${data.totalCalls} 个 API 调用，涵盖 ${data.uniqueEndpoints.length} 个端点`);
    return data;
  }

  // 分析捕获的数据结构
  analyzeDataStructure(responseData) {
    const structure = {};
    
    function analyzeValue(value, path = '') {
      if (value === null) return { type: 'null' };
      if (value === undefined) return { type: 'undefined' };
      
      const type = typeof value;
      
      if (type === 'object') {
        if (Array.isArray(value)) {
          const itemTypes = value.slice(0, 5).map(item => analyzeValue(item, path + '[]'));
          return {
            type: 'array',
            length: value.length,
            itemType: itemTypes[0] || { type: 'unknown' },
            examples: value.slice(0, 3)
          };
        } else {
          const obj = { type: 'object', properties: {} };
          for (const [key, val] of Object.entries(value)) {
            obj.properties[key] = analyzeValue(val, path + '.' + key);
          }
          return obj;
        }
      }
      
      return {
        type,
        example: value,
        // 检测特殊格式
        format: detectFormat(value)
      };
    }
    
    function detectFormat(value) {
      if (typeof value !== 'string') return null;
      
      // 检测常见格式
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return 'datetime';
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'date';
      if (/^[A-Z0-9\-]+$/.test(value) && value.length > 5) return 'id';
      if (/^\w+@\w+\.\w+$/.test(value)) return 'email';
      if (/^https?:\/\//.test(value)) return 'url';
      if (/^\+?\d{10,15}$/.test(value)) return 'phone';
      
      return null;
    }
    
    return analyzeValue(responseData);
  }

  // 生成更新后的 Mock 数据
  generateUpdatedMock(endpoint, method, capturedResponses) {
    console.log(`\n🔄 更新端点: ${method} ${endpoint}`);
    
    // 获取成功响应的示例
    const successResponses = capturedResponses.filter(r => r.responseStatus === 200);
    const errorResponses = capturedResponses.filter(r => r.responseStatus >= 400);
    
    if (successResponses.length === 0) {
      console.log(`  ⚠️  没有成功响应，保留原有 Mock`);
      return null;
    }
    
    // 使用第一个成功响应作为基础
    const baseResponse = successResponses[0].responseData;
    const structure = this.analyzeDataStructure(baseResponse);
    
    console.log(`  ✅ 分析了 ${successResponses.length} 个成功响应`);
    
    // 生成改进的 Mock
    return {
      endpoint,
      method,
      structure,
      examples: {
        success: successResponses.map(r => r.responseData),
        error: errorResponses.map(r => ({
          status: r.responseStatus,
          data: r.responseData
        }))
      },
      mockData: this.createSmartMock(structure, baseResponse)
    };
  }

  // 基于结构创建智能 Mock
  createSmartMock(structure, realExample) {
    function generateFromStructure(struct, example) {
      switch (struct.type) {
        case 'object':
          const obj = {};
          for (const [key, propStruct] of Object.entries(struct.properties)) {
            obj[key] = generateFromStructure(propStruct, example?.[key]);
          }
          return obj;
          
        case 'array':
          // 如果有真实示例，使用前几个
          if (struct.examples && struct.examples.length > 0) {
            return struct.examples.slice(0, 3);
          }
          // 否则生成模拟数据
          return Array(3).fill(null).map(() => 
            generateFromStructure(struct.itemType, null)
          );
          
        case 'string':
          if (example) return example;
          // 根据格式生成
          switch (struct.format) {
            case 'datetime': return new Date().toISOString();
            case 'date': return new Date().toISOString().split('T')[0];
            case 'id': return `ID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            case 'email': return 'user@example.com';
            case 'url': return 'https://example.com';
            case 'phone': return '+60123456789';
            default: return 'string value';
          }
          
        case 'number':
          return struct.example || Math.floor(Math.random() * 1000);
          
        case 'boolean':
          return struct.example !== undefined ? struct.example : true;
          
        default:
          return struct.example || null;
      }
    }
    
    return generateFromStructure(structure, realExample);
  }

  // 更新 Mock 文件
  updateMockFiles() {
    const outputDir = path.join(__dirname, 'generated/beep-v1-webapp');
    const updatedMocksFile = path.join(outputDir, 'api-mocks-updated.js');
    
    // 按端点分组
    const endpointMap = {};
    this.capturedData.calls.forEach(call => {
      const key = `${call.method} ${call.endpoint}`;
      if (!endpointMap[key]) {
        endpointMap[key] = [];
      }
      endpointMap[key].push(call);
    });
    
    // 生成更新的 Mocks
    const handlers = [];
    
    for (const [key, responses] of Object.entries(endpointMap)) {
      const [method, endpoint] = key.split(' ');
      const updated = this.generateUpdatedMock(endpoint, method, responses);
      
      if (updated) {
        handlers.push(this.generateHandler(updated));
      }
    }
    
    // 写入文件
    const fileContent = `/**
 * 基于真实 API 捕获数据更新的 Mock
 * 更新时间: ${new Date().toISOString()}
 * 数据来源: ${this.capturedData.captureDate}
 */

import { rest } from 'msw';

export const handlers = [
${handlers.join(',\n')}
];

export const setupMocks = (worker) => {
  handlers.forEach(handler => worker.use(handler));
};
`;
    
    fs.writeFileSync(updatedMocksFile, fileContent);
    console.log(`\n✅ 已更新 Mock 文件: ${updatedMocksFile}`);
    console.log(`📊 共更新 ${handlers.length} 个端点的 Mock 数据`);
  }

  // 生成 MSW handler
  generateHandler(mockDef) {
    const method = mockDef.method.toLowerCase();
    const mockData = JSON.stringify(mockDef.mockData, null, 2);
    
    return `  rest.${method}('${mockDef.endpoint}', (req, res, ctx) => {
    // 基于真实数据的 Mock
    return res(
      ctx.status(200),
      ctx.json(${mockData})
    );
  })`;
  }

  // 生成数据结构文档
  generateDataStructureDoc() {
    const docFile = path.join(__dirname, 'generated/beep-v1-webapp/api-structure.md');
    let doc = `# beep-v1-webapp API 数据结构文档

基于真实 API 捕获数据生成
捕获时间: ${this.capturedData.captureDate}

## API 端点列表

`;
    
    // 按端点分组
    const endpointMap = {};
    this.capturedData.calls.forEach(call => {
      const key = `${call.method} ${call.endpoint}`;
      if (!endpointMap[key]) {
        endpointMap[key] = [];
      }
      endpointMap[key].push(call);
    });
    
    for (const [key, responses] of Object.entries(endpointMap)) {
      const [method, endpoint] = key.split(' ');
      const successResponse = responses.find(r => r.responseStatus === 200);
      
      if (successResponse) {
        doc += `### ${method} ${endpoint}\n\n`;
        doc += '**响应示例:**\n```json\n';
        doc += JSON.stringify(successResponse.responseData, null, 2);
        doc += '\n```\n\n';
        
        // 添加数据结构说明
        const structure = this.analyzeDataStructure(successResponse.responseData);
        doc += '**数据结构:**\n';
        doc += this.formatStructure(structure);
        doc += '\n\n---\n\n';
      }
    }
    
    fs.writeFileSync(docFile, doc);
    console.log(`📄 已生成数据结构文档: ${docFile}`);
  }

  // 格式化结构为 Markdown
  formatStructure(structure, indent = '') {
    let result = '';
    
    switch (structure.type) {
      case 'object':
        result += `${indent}- Type: Object\n`;
        for (const [key, prop] of Object.entries(structure.properties)) {
          result += `${indent}  - \`${key}\`:\n`;
          result += this.formatStructure(prop, indent + '    ');
        }
        break;
        
      case 'array':
        result += `${indent}- Type: Array (length: ${structure.length})\n`;
        result += `${indent}  - Items:\n`;
        result += this.formatStructure(structure.itemType, indent + '    ');
        break;
        
      case 'string':
        result += `${indent}- Type: String`;
        if (structure.format) {
          result += ` (format: ${structure.format})`;
        }
        result += '\n';
        break;
        
      default:
        result += `${indent}- Type: ${structure.type}\n`;
    }
    
    return result;
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ 请提供捕获的 JSON 文件路径');
    console.error('用法: node update-mocks-from-capture.js <capture-file.json>');
    process.exit(1);
  }
  
  const captureFile = args[0];
  
  if (!fs.existsSync(captureFile)) {
    console.error(`❌ 文件不存在: ${captureFile}`);
    process.exit(1);
  }
  
  const updater = new MockUpdater();
  
  try {
    // 加载数据
    updater.loadCapturedData(captureFile);
    
    // 更新 Mock 文件
    updater.updateMockFiles();
    
    // 生成文档
    updater.generateDataStructureDoc();
    
    console.log('\n✨ Mock 更新完成！');
    console.log('下一步：');
    console.log('1. 查看更新的 Mock: generated/beep-v1-webapp/api-mocks-updated.js');
    console.log('2. 查看数据结构文档: generated/beep-v1-webapp/api-structure.md');
    console.log('3. 在 beep-v1-webapp 中使用更新的 Mock 进行测试');
    
  } catch (error) {
    console.error('❌ 更新失败:', error);
    process.exit(1);
  }
}

// 运行
main();