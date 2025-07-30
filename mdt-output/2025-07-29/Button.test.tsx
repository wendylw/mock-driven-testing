import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useMockScenario } from '@mdt/react';
import { Button } from '@/common/components/Button';

describe('Button Component Tests', () => {
  const { switchScenario } = useMockScenario();
  
  beforeEach(() => {
    // 重置到默认Mock状态
    switchScenario('default');
  });

  it('should render default button correctly', async () => {
    // 切换到特定Mock场景
    await switchScenario('button.default');
    
    // 渲染组件
    const { getByTestId, getByText, queryByText } = render(
      <Button children="Click Me"/>
    );
    
    
    
    // 验证结果
    expect(getByText('Click Me')).toBeInTheDocument();
  });

  it('should show loading state', async () => {
    // 切换到特定Mock场景
    await switchScenario('button.loading');
    
    // 渲染组件
    const { getByTestId, getByText, queryByText } = render(
      <Button loading children="Submit"/>
    );
    
    
    
    // 验证结果
    expect(getByTestId('.tw-text-xl')).toBeInTheDocument();
    expect(getByRole('button')).toBeDisabled();
  });

  it('should handle click events', async () => {
    // 切换到特定Mock场景
    await switchScenario('button.click');
    
    // 渲染组件
    const { getByTestId, getByText, queryByText } = render(
      <Button onClick={mockFn} children="Click Me"/>
    );
    
    fireEvent.click(getByText('Click Me'));
    
    // 验证结果
    expect(mockFn).toHaveBeenCalled();
  });
});

describe('Button Integration Tests', () => {
  // 集成测试用例
  it('should integrate correctly with parent components', async () => {
    // TODO: 添加集成测试
  });
});