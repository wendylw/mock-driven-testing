import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useMockScenario } from '@mdt/react';
import { Modal } from '@/common/components/Modal';

describe('Modal Component Tests', () => {
  const { switchScenario } = useMockScenario();
  
  beforeEach(() => {
    // 重置到默认Mock状态
    switchScenario('default');
  });

  it('should open modal correctly', async () => {
    // 切换到特定Mock场景
    await switchScenario('modal.open');
    
    // 渲染组件
    const { getByTestId, getByText, queryByText } = render(
      <Modal isOpen title="Test Modal"/>
    );
    
    
    
    // 验证结果
    expect(getByText('Test Modal')).toBeInTheDocument();
  });

  it('should close modal on close button click', async () => {
    // 切换到特定Mock场景
    await switchScenario('modal.close');
    
    // 渲染组件
    const { getByTestId, getByText, queryByText } = render(
      <Modal isOpen onClose={mockFn} title="Test Modal"/>
    );
    
    fireEvent.click(getByTestId('[data-test-id="modal-close"]'));
    
    // 验证结果
    expect(mockFn).toHaveBeenCalled();
  });
});

describe('Modal Integration Tests', () => {
  // 集成测试用例
  it('should integrate correctly with parent components', async () => {
    // TODO: 添加集成测试
  });
});