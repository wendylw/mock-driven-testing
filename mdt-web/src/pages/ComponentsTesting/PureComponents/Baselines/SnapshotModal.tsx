import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Card, Row, Col, Statistic, Tag, List, Button, Space, Alert } from 'antd';
import { PictureOutlined, FileTextOutlined, PlayCircleOutlined, SyncOutlined } from '@ant-design/icons';

interface SnapshotData {
  id: string;
  componentId: string;
  snapshots: SnapshotFile[];
  propsVariations: PropsVariation[];
  metadata: {
    totalSize: number;
    generatedAt: string;
    version: string;
  };
}

interface SnapshotFile {
  id: string;
  name: string;
  type: 'visual' | 'dom' | 'props';
  filePath: string;
  size: number; // KB
  dimensions?: { width: number; height: number };
  propsVariationId: string;
  generatedAt: string;
  status: 'valid' | 'outdated' | 'corrupted';
}

interface PropsVariation {
  id: string;
  name: string;
  description: string;
  props: Record<string, any>;
  scenarios: string[];
  importance: 'critical' | 'high' | 'medium' | 'low';
}

interface BaselineInfo {
  id: string;
  component: string;
  status: 'healthy' | 'outdated' | 'corrupted';
  version: string;
}

interface SnapshotModalProps {
  visible: boolean;
  onClose: () => void;
  baseline: BaselineInfo | null;
}

const SnapshotModal: React.FC<SnapshotModalProps> = ({
  visible,
  onClose,
  baseline
}) => {
  const [snapshotData, setSnapshotData] = useState<SnapshotData | null>(null);
  const [loading] = useState(false);

  // 添加旋转动画样式和Google Fonts
  React.useEffect(() => {
    // 添加旋转动画
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // 只在预览Button组件时加载Lato字体（Button来自beep项目）
    let fontLink: HTMLLinkElement | null = null;
    if (baseline?.component === 'Button') {
      // 检查是否已经加载了Lato字体
      const existingFont = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Lato"]');
      
      if (!existingFont) {
        fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap';
        document.head.appendChild(fontLink);
      }
    }

    return () => {
      document.head.removeChild(style);
      // 清理字体链接（可选，如果想要保持字体加载可以注释掉）
      // if (fontLink && document.head.contains(fontLink)) {
      //   document.head.removeChild(fontLink);
      // }
    };
  }, [baseline]);

  useEffect(() => {
    if (visible && baseline) {
      loadSnapshotData(baseline.id);
    }
  }, [visible, baseline]);

  const loadSnapshotData = async (baselineId: string) => {
    try {
      // 模拟API调用，实际应该从后端获取
      const mockData = generateMockSnapshotData(baselineId, baseline!);
      setSnapshotData(mockData);
    } catch (error) {
      console.error('加载快照数据失败:', error);
    }
  };

  const generateMockSnapshotData = (baselineId: string, baseline: BaselineInfo): SnapshotData => {
    // 基于真实beep-v1-webapp项目中的Button使用情况
    const propsVariations: PropsVariation[] = [
      // Primary类型组合 - 基于EditProfileForm实际用法
      {
        id: 'primary-default-block-save',
        name: 'Save Button (EditProfile)',
        description: 'EditProfile表单保存按钮',
        props: { 
          type: 'primary', 
          theme: 'default', 
          size: 'normal',
          block: true, 
          loading: false,
          disabled: false,
          children: 'Save' 
        },
        scenarios: ['用户资料保存', '表单提交', '移动端全宽按钮'],
        importance: 'critical'
      },
      {
        id: 'primary-default-block-loading',
        name: 'Save Button Loading',
        description: '保存按钮加载状态',
        props: { 
          type: 'primary', 
          theme: 'default', 
          size: 'normal',
          block: true, 
          loading: true,
          disabled: true,
          children: 'Save' 
        },
        scenarios: ['表单提交中', '异步操作进行中'],
        importance: 'critical'
      },

      // Secondary类型组合 - 基于ViewProfileFooter实际用法
      {
        id: 'secondary-default-block-logout',
        name: 'Logout Button (ViewProfile)',
        description: 'ViewProfile页面退出登录按钮',
        props: { 
          type: 'secondary', 
          theme: 'default', 
          size: 'normal',
          block: true, 
          loading: false,
          disabled: false,
          children: 'Logout' 
        },
        scenarios: ['用户退出登录', '次要操作', '移动端全宽按钮'],
        importance: 'high'
      },
      {
        id: 'secondary-default-block-loading',
        name: 'Logout Button Loading',
        description: '退出登录按钮加载状态',
        props: { 
          type: 'secondary', 
          theme: 'default', 
          size: 'normal',
          block: true, 
          loading: true,
          disabled: true,
          children: 'Logout' 
        },
        scenarios: ['退出登录处理中', '异步操作进行中'],
        importance: 'high'
      },

      // 基于SCSS配置的其他可能组合
      {
        id: 'primary-danger-normal',
        name: 'Primary Danger Button',
        description: '主要危险操作按钮',
        props: { 
          type: 'primary', 
          theme: 'danger', 
          size: 'normal',
          children: 'Delete Account' 
        },
        scenarios: ['删除操作', '危险操作确认'],
        importance: 'critical'
      },
      {
        id: 'primary-info-normal',
        name: 'Primary Info Button',
        description: '主要信息操作按钮',
        props: { 
          type: 'primary', 
          theme: 'info', 
          size: 'normal',
          children: 'View Details' 
        },
        scenarios: ['信息查看', '详情操作'],
        importance: 'medium'
      },
      {
        id: 'primary-default-small',
        name: 'Primary Small Button',
        description: '小尺寸主要按钮',
        props: { 
          type: 'primary', 
          theme: 'default', 
          size: 'small',
          children: 'Small' 
        },
        scenarios: ['紧凑布局', '表格操作', '内联按钮'],
        importance: 'high'
      },
      {
        id: 'primary-with-icon',
        name: 'Primary with Icon',
        description: '带图标的主要按钮',
        props: { 
          type: 'primary', 
          theme: 'default', 
          size: 'normal',
          icon: 'headphones', // 耳机图标
          children: 'Support' 
        },
        scenarios: ['客服支持', '在线帮助', '音频服务'],
        importance: 'high'
      },
      {
        id: 'secondary-danger-normal',
        name: 'Secondary Danger Button',
        description: '次要危险操作按钮',
        props: { 
          type: 'secondary', 
          theme: 'danger', 
          size: 'normal',
          children: 'Cancel Delete' 
        },
        scenarios: ['取消危险操作', '次要警告操作'],
        importance: 'medium'
      },
      {
        id: 'secondary-info-normal',
        name: 'Secondary Info Button',
        description: '次要信息操作按钮',
        props: { 
          type: 'secondary', 
          theme: 'info', 
          size: 'normal',
          children: 'More Info' 
        },
        scenarios: ['辅助信息', '详情链接'],
        importance: 'medium'
      },
      {
        id: 'secondary-default-small',
        name: 'Secondary Small Button',
        description: '小尺寸次要按钮',
        props: { 
          type: 'secondary', 
          theme: 'default', 
          size: 'small',
          children: 'Edit' 
        },
        scenarios: ['编辑操作', '表格内按钮', '列表项操作'],
        importance: 'high'
      },
      {
        id: 'secondary-with-icon',
        name: 'Secondary with Icon',
        description: '带图标的次要按钮',
        props: { 
          type: 'secondary', 
          theme: 'default', 
          size: 'normal',
          icon: 'headphones', // 耳机图标
          children: 'Help' 
        },
        scenarios: ['帮助支持', '联系客服', '反馈建议'],
        importance: 'medium'
      },

      // 添加disabled状态示例
      {
        id: 'primary-default-disabled',
        name: 'Primary Disabled',
        description: '禁用状态的主要按钮',
        props: { 
          type: 'primary', 
          theme: 'default', 
          size: 'normal',
          disabled: true,
          children: 'Disabled' 
        },
        scenarios: ['表单未完成', '权限不足', '操作不可用'],
        importance: 'high'
      },
      {
        id: 'secondary-default-disabled',
        name: 'Secondary Disabled',
        description: '禁用状态的次要按钮',
        props: { 
          type: 'secondary', 
          theme: 'default', 
          size: 'normal',
          disabled: true,
          children: 'Disabled' 
        },
        scenarios: ['辅助操作不可用', '条件未满足'],
        importance: 'medium'
      },

      // Text类型组合
      {
        id: 'text-default-normal',
        name: 'Text Default Button',
        description: '默认文字链接按钮',
        props: { 
          type: 'text', 
          theme: 'default', 
          size: 'normal',
          children: 'Learn More' 
        },
        scenarios: ['链接操作', '文字按钮', '最小化设计'],
        importance: 'medium'
      },
      {
        id: 'text-ghost-normal',
        name: 'Text Ghost Button',
        description: '幽灵文字按钮',
        props: { 
          type: 'text', 
          theme: 'ghost', 
          size: 'normal',
          children: 'Skip' 
        },
        scenarios: ['跳过操作', '灰色文字链接'],
        importance: 'low'
      },
      {
        id: 'text-black-normal',
        name: 'Text Black Button',
        description: '黑色文字按钮',
        props: { 
          type: 'text', 
          theme: 'black', // 特殊的黑色主题
          size: 'normal',
          children: 'Details' 
        },
        scenarios: ['普通文字链接', '低调的操作按钮'],
        importance: 'medium'
      },
      {
        id: 'text-danger-with-icon',
        name: 'Text with Delete Icon',
        description: '带删除图标的文字按钮',
        props: { 
          type: 'text', 
          theme: 'danger', 
          size: 'normal',
          icon: true, // 标记有图标
          children: '删除' 
        },
        scenarios: ['删除操作', '移除项目', '清理数据'],
        importance: 'high'
      },
      {
        id: 'text-info-normal',
        name: 'Text Info Button',
        description: '信息文字按钮',
        props: { 
          type: 'text', 
          theme: 'info', 
          size: 'normal',
          children: 'Info' 
        },
        scenarios: ['帮助链接', '信息提示', '查看详情'],
        importance: 'medium'
      },
      {
        id: 'text-default-disabled',
        name: 'Text Disabled',
        description: '禁用状态的文字按钮',
        props: { 
          type: 'text', 
          theme: 'default', 
          size: 'normal',
          disabled: true,
          children: 'Disabled' 
        },
        scenarios: ['链接不可点击', '功能暂不可用'],
        importance: 'low'
      }
    ];

    const snapshots: SnapshotFile[] = [];
    
    propsVariations.forEach(variation => {
      snapshots.push({
        id: `${variation.id}-visual`,
        name: `${variation.name} - 视觉快照`,
        type: 'visual',
        filePath: `/snapshots/${baseline.component}/${variation.id}-visual.png`,
        size: Math.round(Math.random() * 50 + 10), // 10-60KB
        dimensions: { width: 200, height: 40 },
        propsVariationId: variation.id,
        generatedAt: '2024-09-25T17:56:47+0800',
        status: baseline.status === 'healthy' ? 'valid' : 'outdated'
      });
      
      snapshots.push({
        id: `${variation.id}-dom`,
        name: `${variation.name} - DOM结构`,
        type: 'dom',
        filePath: `/snapshots/${baseline.component}/${variation.id}-dom.json`,
        size: Math.round(Math.random() * 5 + 2), // 2-7KB
        propsVariationId: variation.id,
        generatedAt: '2024-09-25T17:56:47+0800',
        status: baseline.status === 'healthy' ? 'valid' : 'outdated'
      });
    });

    // 为某些高优先级组合添加props快照
    const criticalVariations = propsVariations.filter(v => v.importance === 'critical');
    criticalVariations.forEach(variation => {
      snapshots.push({
        id: `${variation.id}-props`,
        name: `${variation.name} - Props快照`,
        type: 'props',
        filePath: `/snapshots/${baseline.component}/${variation.id}-props.json`,
        size: Math.round(Math.random() * 3 + 1), // 1-4KB
        propsVariationId: variation.id,
        generatedAt: '2024-09-25T17:56:47+0800',
        status: baseline.status === 'healthy' ? 'valid' : 'outdated'
      });
    });

    return {
      id: baselineId,
      componentId: baseline.component,
      snapshots,
      propsVariations,
      metadata: {
        totalSize: snapshots.reduce((sum, s) => sum + s.size, 0),
        generatedAt: '2024-09-25T17:56:47+0800',
        version: baseline.version
      }
    };
  };


  // 根据Props渲染Button样式预览
  const renderButtonPreview = (props: Record<string, any>) => {
    const { type, theme, size, loading, disabled, block, icon } = props;
    
    // Beep的Tailwind颜色定义
    const colors = {
      orange: { DEFAULT: '#FF9419', dark: '#FC7118', light: '#FEC788' },
      red: { DEFAULT: '#E15343', dark: '#C04537', light: '#ED988F' },
      blue: { DEFAULT: '#00B0FF', dark: '#0089C7', light: '#66D0FF' },
      gray: { 400: '#DEDEDF', 600: '#9E9E9E', 800: '#303030', 900: '#1C1C1C' }
    };
    
    // 基础样式 - 基于beep的Button高度定义
    const baseStyle: React.CSSProperties = {
      // Text按钮有固定的padding，不受size影响
      padding: type === 'text' 
        ? '8px' // tw-p-8 (实际值需要根据spacing配置计算)
        : (size === 'small' ? '8px 16px' : '12px 20px'),
      fontSize: type === 'text' 
        ? '14px' // text按钮的字体大小也不受size影响
        : (size === 'small' ? '12px' : '14px'),
      borderRadius: '8px', // beep默认圆角
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.3s',
      fontFamily: "'Lato', 'Open Sans', 'Helvetica', 'Arial', sans-serif", // beep的字体设置
      fontWeight: 700, // beep使用bold
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: block ? '100%' : '80px',
      height: type === 'text' ? 'auto' : (size === 'small' ? '40px' : '50px'), // text类型高度为auto
      position: 'relative' as const,
      letterSpacing: type === 'text' ? '0.01em' : '0.02em' // tracking-wide/wider
    };

    // 根据type和theme设置样式
    let buttonStyle = { ...baseStyle };
    
    if (type === 'primary') {
      if (theme === 'danger') {
        buttonStyle = { ...buttonStyle, background: colors.red.DEFAULT, color: 'white', border: `1px solid ${colors.red.DEFAULT}` };
      } else if (theme === 'info') {
        buttonStyle = { ...buttonStyle, background: colors.blue.DEFAULT, color: 'white', border: `1px solid ${colors.blue.DEFAULT}` };
      } else { // default theme
        buttonStyle = { ...buttonStyle, background: colors.orange.DEFAULT, color: 'white', border: `1px solid ${colors.orange.DEFAULT}` };
      }
      // 禁用状态使用灰色
      if (disabled) {
        buttonStyle = { ...buttonStyle, background: colors.gray[400], border: `1px solid ${colors.gray[400]}` };
      }
    } else if (type === 'secondary') {
      if (theme === 'danger') {
        buttonStyle = { ...buttonStyle, background: 'white', color: colors.red.DEFAULT, border: `1px solid ${colors.red.DEFAULT}` };
      } else if (theme === 'info') {
        buttonStyle = { ...buttonStyle, background: 'white', color: colors.blue.DEFAULT, border: `1px solid ${colors.blue.DEFAULT}` };
      } else { // default theme
        buttonStyle = { ...buttonStyle, background: 'white', color: colors.orange.DEFAULT, border: `1px solid ${colors.orange.DEFAULT}` };
      }
      // 禁用状态
      if (disabled) {
        buttonStyle = { ...buttonStyle, color: colors.gray[400], border: `1px solid ${colors.gray[400]}` };
      }
    } else if (type === 'text') {
      // Text按钮使用固定的样式，不受size影响
      buttonStyle = { ...buttonStyle, background: 'transparent', border: 'none' };
      if (theme === 'ghost') {
        buttonStyle = { ...buttonStyle, color: colors.gray[600] };
      } else if (theme === 'black') {
        buttonStyle = { ...buttonStyle, color: colors.gray[800] }; // 深灰色/黑色
      } else if (theme === 'danger') {
        buttonStyle = { ...buttonStyle, color: colors.red.DEFAULT };
      } else if (theme === 'info') {
        buttonStyle = { ...buttonStyle, color: colors.blue.DEFAULT };
      } else { // default theme
        buttonStyle = { ...buttonStyle, color: colors.orange.DEFAULT };
      }
      // 禁用状态
      if (disabled) {
        buttonStyle = { ...buttonStyle, color: colors.gray[400] };
      }
    }

    // 统一使用"Button"文字（英文更容易看出字体差异）
    const buttonText = 'Button';

    // 渲染图标
    const renderIcon = () => {
      if (icon === 'headphones') {
        // Headphones图标（Headphones from phosphor-react）
        return (
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 256 256" 
            fill="currentColor"
            style={{ marginRight: 4 }}
          >
            <path d="M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88.12,88.12,0,0,1,190.54,65.93,87.39,87.39,0,0,1,215.65,120H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h24a24,24,0,0,0,24-24V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm152,56H192a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24v48A8,8,0,0,1,216,192Z"/>
          </svg>
        );
      } else {
        // 默认删除图标（Trash from phosphor-react）
        return (
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 256 256" 
            fill="currentColor"
            style={{ marginRight: 4 }}
          >
            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
          </svg>
        );
      }
    };

    return (
      <div style={buttonStyle}>
        {loading && (
          <span style={{ 
            marginRight: 6,
            display: 'inline-flex',
            animation: 'spin 1s linear infinite'
          }}>
            {/* 使用简化的CircleNotch图标表示 */}
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 256 256" 
              fill="currentColor"
              style={{ display: 'block' }}
            >
              <path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"/>
            </svg>
          </span>
        )}
        {icon && renderIcon()}
        {buttonText}
      </div>
    );
  };

  const renderPropsAndSnapshots = () => {
    if (!snapshotData) return null;

    // 按type分组
    const groupedByType = snapshotData.propsVariations.reduce((groups, variation) => {
      const type = variation.props.type || 'other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(variation);
      return groups;
    }, {} as Record<string, PropsVariation[]>);

    const typeDisplayNames = {
      'primary': 'Primary 按钮',
      'secondary': 'Secondary 按钮', 
      'text': 'Text 按钮',
      'other': '其他类型'
    };

    const typeColors = {
      'primary': '#1890ff',
      'secondary': '#52c41a',
      'text': '#faad14',
      'other': '#722ed1'
    };

    return (
      <div>
        {Object.entries(groupedByType).map(([type, variations]) => (
          <Card 
            key={type}
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: typeColors[type as keyof typeof typeColors] || '#666',
                    borderRadius: '50%',
                    marginRight: 8
                  }}
                />
                {typeDisplayNames[type as keyof typeof typeDisplayNames] || type}
                <Tag style={{ marginLeft: 8 }}>{variations.length}个组合</Tag>
              </div>
            }
            style={{ marginBottom: 24 }}
          >
            <Row gutter={[16, 16]}>
              {variations.map(variation => {
                const relatedSnapshots = snapshotData.snapshots.filter(s => s.propsVariationId === variation.id);
                const visualSnapshot = relatedSnapshots.find(s => s.type === 'visual');
                
                return (
                  <Col key={variation.id} span={12}>
                    <Card
                      size="small"
                      style={{ height: '100%' }}
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px' }}>{variation.name}</span>
                          <Tag 
                            color={getImportanceColor(variation.importance)}
                            size="small"
                          >
                            {variation.importance}
                          </Tag>
                        </div>
                      }
                    >
                      <Row gutter={12}>
                        {/* 左侧：快照预览 */}
                        <Col span={10}>
                          <div style={{ 
                            border: '1px dashed #d9d9d9', 
                            borderRadius: 4, 
                            padding: 8,
                            textAlign: 'center',
                            minHeight: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#fafafa'
                          }}>
                            <div style={{ textAlign: 'center' }}>
                              {/* 样式预览 - 根据Props显示Button外观 */}
                              {renderButtonPreview(variation.props)}
                              <div style={{ fontSize: '10px', color: '#999', marginTop: 8 }}>
                                样式预览
                              </div>
                              {visualSnapshot && (
                                <div style={{ fontSize: '10px', color: '#999' }}>
                                  快照: {visualSnapshot.size}KB
                                </div>
                              )}
                            </div>
                          </div>
                        </Col>
                        
                        {/* 右侧：Props信息 */}
                        <Col span={14}>
                          <div style={{ fontSize: '12px' }}>
                            <div style={{ marginBottom: 8 }}>
                              <strong>Props配置:</strong>
                              <div style={{ 
                                background: '#f6f8fa', 
                                padding: 6, 
                                borderRadius: 3,
                                marginTop: 2,
                                fontSize: '11px',
                                fontFamily: 'monospace'
                              }}>
                                type: "{variation.props.type}"<br/>
                                size: "{variation.props.size}"<br/>
                                theme: "{variation.props.theme}"
                                {variation.props.loading && <><br/>loading: true</>}
                                {variation.props.block && <><br/>block: true</>}
                                {variation.props.disabled && <><br/>disabled: true</>}
                              </div>
                            </div>
                            
                            <div style={{ marginBottom: 8 }}>
                              <strong>应用场景:</strong>
                              <div style={{ marginTop: 2 }}>
                                {variation.scenarios.slice(0, 2).map(scenario => (
                                  <Tag key={scenario} size="small" style={{ fontSize: '10px', marginBottom: 2 }}>
                                    {scenario}
                                  </Tag>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <strong>快照文件:</strong>
                              <div style={{ marginTop: 2 }}>
                                {relatedSnapshots.map(snapshot => (
                                  <Tag 
                                    key={snapshot.id} 
                                    color={getSnapshotTypeColor(snapshot.type)}
                                    size="small"
                                    style={{ fontSize: '10px', marginBottom: 2 }}
                                  >
                                    {snapshot.type} ({snapshot.size}KB)
                                  </Tag>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        ))}
      </div>
    );
  };


  const getImportanceColor = (importance: string) => {
    const colors = { critical: 'red', high: 'orange', medium: 'blue', low: 'green' };
    return colors[importance as keyof typeof colors] || 'default';
  };

  const getSnapshotTypeColor = (type: string) => {
    const colors = { visual: 'blue', dom: 'green', props: 'orange' };
    return colors[type as keyof typeof colors] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors = { valid: 'green', outdated: 'orange', corrupted: 'red' };
    return colors[status as keyof typeof colors] || 'default';
  };


  return (
    <Modal
      title={`快照管理 - ${baseline?.component || ''}`}
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
    >
      {baseline?.status === 'corrupted' && (
        <Alert
          type="error"
          message="快照数据可能已损坏"
          description="建议重新生成快照以确保数据完整性"
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}
      
      {baseline?.status === 'outdated' && (
        <Alert
          type="warning"
          message="快照数据已过时"
          description="快照基于旧版本组件生成，建议更新到最新版本"
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      {renderPropsAndSnapshots()}
    </Modal>
  );
};

export default SnapshotModal;