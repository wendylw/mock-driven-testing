import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useMockScenario } from '@mdt/react';
import { CreateOrderButton } from '@/ordering/components/CreateOrderButton';

describe('CreateOrderButton Component Tests', () => {
  const { switchScenario } = useMockScenario();
  
  beforeEach(() => {
    // 重置到默认Mock状态
    switchScenario('default');
  });

  it('should create order successfully', async () => {
    // 切换到特定Mock场景
    await switchScenario('order.create.success');
    
    // 渲染组件
    const { getByTestId, getByText, queryByText } = render(
      <CreateOrderButton children="Create Order"/>
    );
    
    fireEvent.click(getByText('Create Order'));
    
    // 验证结果
    await waitFor(() => {
      expect(window.location.href).toContain('/thank-you');
    });
  });

  it('should handle payment failure', async () => {
    // 切换到特定Mock场景
    await switchScenario('order.create.payment-failed');
    
    // 渲染组件
    const { getByTestId, getByText, queryByText } = render(
      <CreateOrderButton children="Create Order"/>
    );
    
    fireEvent.click(getByText('Create Order'));
    
    // 验证结果
    expect(getByText('Payment failed')).toBeInTheDocument();
  });

  it('should redirect to login for guest users', async () => {
    // 切换到特定Mock场景
    await switchScenario('order.create.login-required');
    
    // 渲染组件
    const { getByTestId, getByText, queryByText } = render(
      <CreateOrderButton children="Create Order"/>
    );
    
    
    
    // 验证结果
    await waitFor(() => {
      expect(window.location.href).toContain('/login');
    });
  });
});

describe('CreateOrderButton Integration Tests', () => {
  // 集成测试用例
  it('should integrate correctly with parent components', async () => {
    // TODO: 添加集成测试
  });
});