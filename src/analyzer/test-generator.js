const fs = require('fs-extra');
const path = require('path');

class TestGenerator {
  constructor() {
    this.mockScenarios = {
      Button: this.getButtonScenarios(),
      CreateOrderButton: this.getCreateOrderButtonScenarios(),
      Modal: this.getModalScenarios(),
      Input: this.getInputScenarios()
    };
  }

  // 为组件生成测试文件
  async generateTestsForComponent(componentInfo, outputDir) {
    const { name, usageCount, riskLevel } = componentInfo;
    
    // 生成测试代码
    const testCode = this.generateTestCode(name, componentInfo);
    
    // 生成Mock场景配置
    const mockConfig = this.generateMockConfig(name);
    
    // 保存文件
    const testFileName = `${name}.test.tsx`;
    const mockFileName = `${name.toLowerCase()}-scenarios.json`;
    
    const testFilePath = path.join(outputDir, testFileName);
    const mockFilePath = path.join(outputDir, 'mocks', mockFileName);
    
    await fs.ensureDir(path.dirname(testFilePath));
    await fs.ensureDir(path.dirname(mockFilePath));
    
    await fs.writeFile(testFilePath, testCode);
    await fs.writeJson(mockFilePath, mockConfig, { spaces: 2 });
    
    return {
      testFile: testFilePath,
      mockFile: mockFilePath
    };
  }

  // 生成测试代码
  generateTestCode(componentName, componentInfo) {
    const scenarios = this.mockScenarios[componentName] || [];
    const importPath = this.getImportPath(componentName);
    
    return `import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useMockScenario } from '@mdt/react';
import { ${componentName} } from '${importPath}';

describe('${componentName} Component Tests', () => {
  const { switchScenario } = useMockScenario();
  
  beforeEach(() => {
    // 重置到默认Mock状态
    switchScenario('default');
  });

${scenarios.map(scenario => this.generateTestCase(componentName, scenario)).join('\n\n')}
});

describe('${componentName} Integration Tests', () => {
  // 集成测试用例
  it('should integrate correctly with parent components', async () => {
    // TODO: 添加集成测试
  });
});`;
  }

  // 生成单个测试用例
  generateTestCase(componentName, scenario) {
    return `  it('${scenario.testName}', async () => {
    // 切换到特定Mock场景
    await switchScenario('${scenario.scenarioId}');
    
    // 渲染组件
    const { getByTestId, getByText, queryByText } = render(
      <${componentName} ${scenario.props ? this.propsToString(scenario.props) : ''}/>
    );
    
    ${scenario.actions ? scenario.actions.map(action => this.generateAction(action)).join('\n    ') : ''}
    
    // 验证结果
    ${scenario.assertions.map(assertion => this.generateAssertion(assertion)).join('\n    ')}
  });`;
  }

  // 生成Mock配置
  generateMockConfig(componentName) {
    const scenarios = this.mockScenarios[componentName] || [];
    const config = {
      component: componentName,
      scenarios: {}
    };

    scenarios.forEach(scenario => {
      config.scenarios[scenario.scenarioId] = {
        name: scenario.scenarioName,
        description: scenario.description,
        mockData: scenario.mockData || {},
        apiMocks: scenario.apiMocks || []
      };
    });

    return config;
  }

  // Button组件的测试场景
  getButtonScenarios() {
    return [
      {
        scenarioId: 'button.default',
        scenarioName: '默认按钮',
        testName: 'should render default button correctly',
        description: '测试按钮的默认渲染',
        props: { children: 'Click Me' },
        assertions: [
          { type: 'exists', target: 'Click Me' }
        ]
      },
      {
        scenarioId: 'button.loading',
        scenarioName: '加载状态',
        testName: 'should show loading state',
        description: '测试按钮的加载状态',
        props: { loading: true, children: 'Submit' },
        assertions: [
          { type: 'exists', selector: '.tw-text-xl' }, // Loader组件
          { type: 'disabled', selector: 'button' }
        ]
      },
      {
        scenarioId: 'button.click',
        scenarioName: '点击事件',
        testName: 'should handle click events',
        description: '测试按钮点击事件',
        props: { onClick: 'mockFn', children: 'Click Me' },
        actions: [
          { type: 'click', target: 'Click Me' }
        ],
        assertions: [
          { type: 'called', target: 'mockFn' }
        ]
      }
    ];
  }

  // CreateOrderButton组件的测试场景
  getCreateOrderButtonScenarios() {
    return [
      {
        scenarioId: 'order.create.success',
        scenarioName: '订单创建成功',
        testName: 'should create order successfully',
        description: '测试订单成功创建流程',
        props: { children: 'Create Order' },
        apiMocks: [
          {
            endpoint: '/api/order/create',
            method: 'POST',
            response: { orderId: 'ORDER_123', status: 'created' }
          }
        ],
        actions: [
          { type: 'click', target: 'Create Order' }
        ],
        assertions: [
          { type: 'redirect', url: '/thank-you' }
        ]
      },
      {
        scenarioId: 'order.create.payment-failed',
        scenarioName: '支付失败',
        testName: 'should handle payment failure',
        description: '测试支付失败的错误处理',
        props: { children: 'Create Order' },
        apiMocks: [
          {
            endpoint: '/api/order/create',
            method: 'POST',
            response: { error: 'Payment failed', code: 'PAYMENT_ERROR' },
            status: 400
          }
        ],
        actions: [
          { type: 'click', target: 'Create Order' }
        ],
        assertions: [
          { type: 'exists', target: 'Payment failed' }
        ]
      },
      {
        scenarioId: 'order.create.login-required',
        scenarioName: '需要登录',
        testName: 'should redirect to login for guest users',
        description: '测试未登录用户的重定向',
        mockData: {
          user: { isLogin: false }
        },
        props: { children: 'Create Order' },
        assertions: [
          { type: 'redirect', url: '/login' }
        ]
      }
    ];
  }

  // Modal组件的测试场景
  getModalScenarios() {
    return [
      {
        scenarioId: 'modal.open',
        scenarioName: '打开模态框',
        testName: 'should open modal correctly',
        description: '测试模态框打开功能',
        props: { isOpen: true, title: 'Test Modal' },
        assertions: [
          { type: 'exists', target: 'Test Modal' }
        ]
      },
      {
        scenarioId: 'modal.close',
        scenarioName: '关闭模态框',
        testName: 'should close modal on close button click',
        description: '测试模态框关闭功能',
        props: { isOpen: true, onClose: 'mockFn', title: 'Test Modal' },
        actions: [
          { type: 'click', selector: '[data-test-id="modal-close"]' }
        ],
        assertions: [
          { type: 'called', target: 'mockFn' }
        ]
      }
    ];
  }

  // Input组件的测试场景
  getInputScenarios() {
    return [
      {
        scenarioId: 'input.typing',
        scenarioName: '输入文本',
        testName: 'should handle text input',
        description: '测试输入功能',
        props: { placeholder: 'Enter text' },
        actions: [
          { type: 'type', target: 'Enter text', value: 'Hello World' }
        ],
        assertions: [
          { type: 'value', target: 'input', value: 'Hello World' }
        ]
      },
      {
        scenarioId: 'input.validation',
        scenarioName: '输入验证',
        testName: 'should show validation error',
        description: '测试输入验证',
        props: { required: true, error: 'This field is required' },
        assertions: [
          { type: 'exists', target: 'This field is required' }
        ]
      }
    ];
  }

  // 辅助方法
  propsToString(props) {
    return Object.entries(props)
      .map(([key, value]) => {
        if (value === 'mockFn') return `${key}={mockFn}`;
        if (typeof value === 'boolean') return value ? key : '';
        if (typeof value === 'string') return `${key}="${value}"`;
        return `${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join(' ');
  }

  generateAction(action) {
    switch (action.type) {
      case 'click':
        return action.selector 
          ? `fireEvent.click(getByTestId('${action.selector}'));`
          : `fireEvent.click(getByText('${action.target}'));`;
      case 'type':
        return `fireEvent.change(getByPlaceholderText('${action.target}'), { target: { value: '${action.value}' } });`;
      default:
        return '// TODO: Add action';
    }
  }

  generateAssertion(assertion) {
    switch (assertion.type) {
      case 'exists':
        return assertion.selector
          ? `expect(getByTestId('${assertion.selector}')).toBeInTheDocument();`
          : `expect(getByText('${assertion.target}')).toBeInTheDocument();`;
      case 'not-exists':
        return `expect(queryByText('${assertion.target}')).not.toBeInTheDocument();`;
      case 'disabled':
        return `expect(getByRole('button')).toBeDisabled();`;
      case 'called':
        return `expect(${assertion.target}).toHaveBeenCalled();`;
      case 'redirect':
        return `await waitFor(() => {\n      expect(window.location.href).toContain('${assertion.url}');\n    });`;
      case 'value':
        return `expect(getByRole('${assertion.target}').value).toBe('${assertion.value}');`;
      default:
        return '// TODO: Add assertion';
    }
  }

  getImportPath(componentName) {
    const paths = {
      Button: '@/common/components/Button',
      CreateOrderButton: '@/ordering/components/CreateOrderButton',
      Modal: '@/common/components/Modal',
      Input: '@/common/components/Input'
    };
    return paths[componentName] || `./${componentName}`;
  }
}

module.exports = TestGenerator;