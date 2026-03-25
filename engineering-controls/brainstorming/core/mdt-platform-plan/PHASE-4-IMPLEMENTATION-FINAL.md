# Phase 4: 智能分析引擎实施计划（最终版）

## 一、核心目标（基于讨论明确）

### 1.1 聚焦4个核心组件
基于BEEP项目实际分析，Phase 4 MVP将聚焦于：

1. **Button** - 169次使用，基础UI组件
2. **CreateOrderButton** - 6次使用，核心业务组件（357行）
3. **Modal** - 52次使用，交互组件
4. **Input** - 87次使用，表单组件

### 1.2 核心价值
- **不是**创造新的Mock系统
- **而是**智能分析哪些组件需要测试，并生成与MDT平台集成的测试代码
- **关键**：生成的测试直接使用MDT平台已有的Mock场景

## 二、技术方案（简化版）

### 2.1 分析引擎
```javascript
// 组件识别规则（基于BEEP项目特征）
const componentPatterns = {
  // 通用组件：在/common/components/下
  commonComponents: /\/common\/components\/(\w+)\/index\.jsx/,
  
  // 业务组件：在各模块的components目录下
  businessComponents: /\/(ordering|site|rewards)\/.*\/components\/(\w+)\.jsx/,
  
  // 识别React组件的规则
  isReactComponent: (fileContent) => {
    return fileContent.includes('React.Component') || 
           fileContent.includes('export default') &&
           /function\s+[A-Z]\w*/.test(fileContent);
  }
};
```

### 2.2 复用度计算
```javascript
// 简单直接的计算方法
const calculateReuseScore = async (componentName) => {
  // 1. 统计import次数
  const importCount = await countImports(componentName);
  
  // 2. 评估业务重要性
  const businessWeight = getBusinessWeight(componentName);
  
  // 3. 代码复杂度
  const complexity = await analyzeComplexity(componentPath);
  
  return {
    usage: importCount,
    importance: businessWeight,
    complexity: complexity,
    riskLevel: calculateRisk(importCount, businessWeight, complexity)
  };
};
```

## 三、MVP实施计划（2周）

### Week 1: 分析能力实现
**Day 1-3: 环境搭建**
```bash
# 安装必要依赖
npm install @babel/parser @babel/traverse
npm install glob fs-extra
```

**Day 4-7: 核心分析器**
- 实现文件扫描功能
- 识别React组件
- 统计使用次数
- 输出分析报告

**预期输出：**
```
BEEP项目组件分析报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Button - 169次使用 [已识别]
✅ CreateOrderButton - 6次使用 [已识别]
✅ Modal - 52次使用 [已识别]
✅ Input - 87次使用 [已识别]
```

### Week 2: 测试生成能力
**Day 8-10: 测试模板生成**
```javascript
// 生成的测试代码示例
import { render, fireEvent } from '@testing-library/react';
import { useMockScenario } from '@mdt/react';
import { CreateOrderButton } from './CreateOrderButton';

describe('CreateOrderButton', () => {
  const { switchScenario } = useMockScenario();
  
  it('should create order successfully', async () => {
    // 使用MDT平台的Mock场景
    await switchScenario('order.create.success');
    
    const { getByText } = render(<CreateOrderButton />);
    fireEvent.click(getByText('Create Order'));
    
    // Mock会自动replay相同的响应
    await waitFor(() => {
      expect(window.location.href).toContain('/thank-you');
    });
  });
  
  it('should handle payment failure', async () => {
    // 切换到错误场景
    await switchScenario('order.create.payment-failed');
    
    const { getByText } = render(<CreateOrderButton />);
    fireEvent.click(getByText('Create Order'));
    
    await waitFor(() => {
      expect(getByText('Payment failed')).toBeInTheDocument();
    });
  });
});
```

**Day 11-14: MDT集成**
- 生成Mock场景配置
- 创建场景切换逻辑
- 输出完整测试套件

## 四、与MDT平台的集成

### 4.1 Mock Replay机制
```javascript
// MDT平台中的Mock配置（一次配置，永久使用）
{
  "scenarios": {
    "order.create.success": {
      "endpoint": "/api/order/create",
      "method": "POST",
      "response": {
        "orderId": "ORDER_123",
        "status": "created"
      }
    },
    "order.create.payment-failed": {
      "endpoint": "/api/order/create",
      "method": "POST", 
      "response": {
        "error": "Payment failed",
        "code": "PAYMENT_ERROR"
      },
      "status": 400
    }
  }
}
```

### 4.2 测试执行流程
1. 测试启动 → 连接MDT Mock服务
2. 切换场景 → MDT返回对应Mock数据
3. 执行测试 → 每次都是相同的响应（Replay）
4. 测试通过 → 确保功能正确

## 五、成功标准

### 5.1 技术指标
- ✅ 准确识别4个目标组件（误差<10%）
- ✅ 30秒内完成分析
- ✅ 生成可运行的测试代码

### 5.2 业务价值
- ✅ 为每个组件生成3-5个测试场景
- ✅ 测试代码可直接运行（配合MDT Mock）
- ✅ 覆盖主要使用场景

### 5.3 用户体验
```bash
# 用户操作
$ mdt analyze /path/to/beep-project

# 看到结果
分析完成！发现4个高风险组件需要测试：
- Button (169次使用)
- CreateOrderButton (6次使用，核心业务)
- Modal (52次使用)
- Input (87次使用)

是否生成测试代码？ [Y/n]

# 生成后
✅ 已生成测试文件：
- Button.test.tsx
- CreateOrderButton.test.tsx
- Modal.test.tsx
- Input.test.tsx

配合MDT Mock服务运行测试：
$ npm test
```

## 六、风险控制

### 6.1 技术风险
- **AST解析准确性** → 先聚焦4个组件，降低复杂度
- **性能问题** → 只分析必要文件，使用缓存

### 6.2 实施风险
- **时间紧张** → MVP只做核心功能
- **集成复杂** → 充分利用已有MDT基础设施

## 七、下一步行动

1. **立即开始**：搭建AST解析环境
2. **第一个里程碑**：识别出Button组件并统计使用次数
3. **MVP交付**：4个组件的完整分析和测试生成

这个计划更加聚焦、务实，并且充分利用了MDT平台的Mock Replay能力。