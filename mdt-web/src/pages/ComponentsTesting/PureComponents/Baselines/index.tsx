import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Progress, Row, Col, Statistic, Alert, Modal, message } from 'antd';
import { DatabaseOutlined, SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined, DeleteOutlined, FireOutlined, PlusCircleOutlined } from '@ant-design/icons';
import BaselineDetailModal from './BaselineDetailModal';
import SnapshotModal from './SnapshotModal';
import VersionHistoryModal from './VersionHistoryModal';
import StatusColumn from './components/StatusColumn';
import { calculateIntelligentStatus } from './utils/statusCalculator';
import { baselineService } from '../../../../services/baseline.service';
import { BaselineStatus, BaselineListItem } from '../../../../services/types/baseline';

interface BaselineInfo {
  id: string;
  component: string;
  path: string;
  version: string;
  createdAt: Date;
  lastUpdated: Date;
  snapshotCount: number;
  propsVariations: number;
  status: 'healthy' | 'outdated' | 'corrupted';
  corruptionType?: 'fileCorrupted' | 'componentDeleted'; // 损坏类型
  branch: string;
  commit: string;
  size: number; // KB
  // BEEP 真实数据
  usageCount: number;
  riskLevel: 'low' | 'high';
  businessImpact: string;
  criticalUsageScenarios: string[];
}

const PureComponentsBaselines: React.FC = () => {
  const [baselines, setBaselines] = useState<BaselineInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedBaseline, setSelectedBaseline] = useState<BaselineInfo | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDetailBaseline, setSelectedDetailBaseline] = useState<BaselineInfo | null>(null);
  const [snapshotModalVisible, setSnapshotModalVisible] = useState(false);
  const [selectedSnapshotBaseline, setSelectedSnapshotBaseline] = useState<BaselineInfo | null>(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedHistoryBaseline, setSelectedHistoryBaseline] = useState<BaselineInfo | null>(null);

  useEffect(() => {
    loadBaselines();
  }, []);

  // 从分析数据生成基准数据的备用方法
  // 获取组件的关键场景
  const getCriticalScenariosForComponent = (componentName: string): string[] => {
    const scenarios: Record<string, string[]> = {
      'Button': ['购物车操作', '搜索功能', '确认对话'],
      'CreateOrderButton': ['支付流程', '订单创建', '购物车结算'],
      'Modal': ['确认对话', '警告提示', '信息展示'],
      'Input': ['用户信息收集', '表单输入', '搜索输入']
    };
    return scenarios[componentName] || [];
  };

  const generateBaselinesFromAnalysis = (analysisData: any): BaselineInfo[] => {
    const baselines: BaselineInfo[] = Object.entries(analysisData.components).map(([componentName, componentInfo]: [string, any]) => {
      // 简化的状态判断逻辑
      let status: 'healthy' | 'outdated' | 'corrupted' = 'healthy';
      let corruptionType: 'fileCorrupted' | 'componentDeleted' | undefined;
      
      if (componentName === 'CreateOrderButton') {
        status = 'outdated';
      } else if (componentName === 'Modal') {
        status = 'corrupted';
        corruptionType = 'fileCorrupted';
      }

      const getSnapshotInfo = (name: string) => {
        switch (name) {
          case 'Button': 
            // 快照信息：15个快照文件，估算总大小150KB
            return { snapshots: 15, variations: 12, snapshotSize: 150.0 };
          case 'CreateOrderButton': return { snapshots: 8, variations: 6, snapshotSize: 80.0 };
          case 'Modal': return { snapshots: 6, variations: 4, snapshotSize: 60.0 };
          case 'Input': return { snapshots: 12, variations: 8, snapshotSize: 120.0 };
          default: return { snapshots: 10, variations: 6, snapshotSize: 100.0 };
        }
      };

      // 获取组件文件大小（KB）
      const getComponentFileSize = (name: string, path: string): number => {
        if (name === 'Button') {
          return 2.6; // Button文件实际大小 2604 bytes = 2.6KB
        }
        // 其他组件暂时估算
        return Math.round(Math.random() * 5 + 2); // 2-7KB之间
      };

      const getCriticalScenarios = (name: string, usedIn: string[] = []) => {
        const scenarios: string[] = [];
        if (name === 'Button') {
          if (usedIn.some(file => file.includes('MiniCart'))) scenarios.push('购物车操作');
          if (usedIn.some(file => file.includes('Search'))) scenarios.push('搜索功能');
          if (usedIn.some(file => file.includes('Confirm'))) scenarios.push('确认对话');
        } else if (name === 'CreateOrderButton') {
          scenarios.push('支付流程', '订单创建', '购物车结算');
        } else if (name === 'Modal') {
          scenarios.push('确认对话', '警告提示', '信息展示');
        } else if (name === 'Input') {
          scenarios.push('用户信息收集', '表单输入');
        }
        return scenarios.slice(0, 3);
      };

      const snapshotInfo = getSnapshotInfo(componentName);
      const useRealGitData = componentName === 'Button';

      return {
        id: `baseline-${componentName.toLowerCase()}-001`,
        component: componentName,
        path: componentInfo.definedIn || `src/common/components/${componentName}/index.jsx`,
        version: status === 'outdated' ? '0.1.0-beta' : '0.1.0',
        createdAt: useRealGitData 
          ? new Date('2024-09-25T17:56:47+0800')
          : new Date('2025-01-15T10:00:00'),
        lastUpdated: useRealGitData
          ? new Date('2024-09-25T17:56:47+0800')
          : (status === 'corrupted' ? new Date('2025-01-20T09:45:00') : new Date('2025-01-29T10:30:00')),
        snapshotCount: snapshotInfo.snapshots,
        propsVariations: snapshotInfo.variations,
        status,
        corruptionType,
        branch: 'develop',
        commit: useRealGitData 
          ? '68bb4f50'
          : (componentName === 'CreateOrderButton' ? 'a2d5c8f' : (status === 'healthy' ? 'a7f9d2c' : 'd4e5f6g')),
        size: snapshotInfo.snapshotSize,
        usageCount: componentInfo.usageCount,
        riskLevel: componentInfo.riskLevel,
        businessImpact: componentName === 'CreateOrderButton' ? '直接影响营收' : 
                       componentInfo.usageCount > 20 ? '影响用户体验' : '数据质量相关',
        criticalUsageScenarios: getCriticalScenarios(componentName, componentInfo.usedIn)
      };
    });

    // 添加已删除组件示例
    baselines.push({
      id: 'baseline-oldcard-001',
      component: 'OldCard',
      path: 'src/common/components/OldCard/index.jsx',
      version: '1.2.0',
      createdAt: new Date('2025-01-10T10:00:00'),
      lastUpdated: new Date('2025-01-15T14:30:00'),
      snapshotCount: 6,
      propsVariations: 4,
      status: 'corrupted',
      corruptionType: 'componentDeleted',
      branch: 'develop',
      commit: 'old123ab',
      size: 87.5,
      usageCount: 0,
      riskLevel: 'low' as const,
      businessImpact: '组件已删除',
      criticalUsageScenarios: []
    });

    return baselines;
  };

  const loadBaselines = async () => {
    setLoading(true);
    console.log('开始加载基准数据...');
    
    try {
      // 从后端API获取基准列表
      const baselineList = await baselineService.getBaselines();
      console.log('获取到基准列表:', baselineList);
      
      // 批量获取状态详情
      const baselineIds = baselineList.map(item => item.id);
      const statusMap = await baselineService.getBatchStatuses(baselineIds);
      console.log('批量状态详情:', statusMap);
      
      // 转换API数据为UI数据格式
      const baselines: BaselineInfo[] = baselineList.map((item: BaselineListItem) => {
        const status = statusMap[item.id];
        const statusDetail = status?.statusDetail;
        
        // 根据状态确定损坏类型
        let corruptionType: 'fileCorrupted' | 'componentDeleted' | undefined;
        if (statusDetail?.type === 'deleted') {
          corruptionType = 'componentDeleted';
        } else if (statusDetail?.type === 'corrupted') {
          corruptionType = 'fileCorrupted';
        }
        
        // 基于组件类型计算业务影响
        const businessImpact = item.component === 'CreateOrderButton' ? '直接影响营收' : 
                             item.usageCount > 20 ? '影响用户体验' : '数据质量相关';
        
        // 获取关键场景
        const criticalScenarios = getCriticalScenariosForComponent(item.component);
        
        return {
          id: item.id,
          component: item.component,
          path: item.path,
          version: '0.1.0', // 从status获取或使用默认值
          createdAt: status ? new Date(status.metrics.lastUpdated) : new Date(),
          lastUpdated: status ? new Date(status.metrics.lastUpdated) : new Date(),
          snapshotCount: status?.metrics.snapshotCount || 0,
          propsVariations: 0, // 需要从后端获取
          status: (statusDetail?.type || 'healthy') as any,
          corruptionType,
          branch: 'develop',
          commit: 'unknown',
          size: status?.metrics.size || 0,
          usageCount: item.usageCount,
          riskLevel: item.usageCount > 15 ? 'high' : 'low',
          businessImpact,
          criticalUsageScenarios: criticalScenarios
        };
      });
      
      console.log('基准数据转换完成，共', baselines.length, '条记录');
      setBaselines(baselines);
      message.success(`成功加载${baselines.length}个组件的基准数据`);
    } catch (error) {
      console.error('加载基准数据失败:', error);
      message.error(`加载基准数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
      
      // 回退到旧的数据源作为应急方案
      console.log('尝试使用备用数据源...');
      try {
        const fallbackResponse = await fetch('/analysis-report.json');
        if (fallbackResponse.ok) {
          const analysisData = await fallbackResponse.json();
          console.log('备用数据源加载成功:', analysisData);
          
          // 使用分析数据生成基准数据（临时方案）
          const fallbackBaselines = generateBaselinesFromAnalysis(analysisData);
          setBaselines(fallbackBaselines);
          message.warning(`使用备用数据源，加载了${fallbackBaselines.length}个组件`);
          setLoading(false); // 在返回前设置loading状态
          return; // 成功后直接返回
        }
      } catch (fallbackError) {
        console.error('备用数据源也失败:', fallbackError);
      }
      
      setBaselines([]);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'outdated': return 'orange';
      case 'corrupted': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string, corruptionType?: string) => {
    switch (status) {
      case 'healthy': return '健康';
      case 'outdated': return '过时';
      case 'corrupted': 
        return corruptionType === 'componentDeleted' ? '已删除' : '损坏';
      default: return '未知';
    }
  };

  const handleUpdateBaseline = (baseline: BaselineInfo) => {
    setSelectedBaseline(baseline);
    setUpdateModalVisible(true);
  };

  const handleViewDetails = (baseline: BaselineInfo) => {
    setSelectedDetailBaseline(baseline);
    setDetailModalVisible(true);
  };

  const handleViewSnapshots = (baseline: BaselineInfo) => {
    setSelectedSnapshotBaseline(baseline);
    setSnapshotModalVisible(true);
  };

  const handleViewHistory = (baseline: BaselineInfo) => {
    setSelectedHistoryBaseline(baseline);
    setHistoryModalVisible(true);
  };

  // 处理清理已删除组件的基准
  const handleCleanupBaseline = (baseline: BaselineInfo) => {
    Modal.confirm({
      title: '确认清理基准',
      content: (
        <div>
          <p>确定要清理 <strong>{baseline.component}</strong> 的基准数据吗？</p>
          <Alert 
            message="清理说明" 
            description="此组件已从develop分支删除，清理基准数据不会影响现有功能，可以减少无效数据的干扰。"
            type="info" 
            showIcon 
            style={{ marginTop: 12 }}
          />
        </div>
      ),
      okText: '确定清理',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.success(`已清理 ${baseline.component} 基准`);
        setBaselines(baselines.filter(b => b.id !== baseline.id));
      },
    });
  };

  const confirmUpdateBaseline = () => {
    if (selectedBaseline) {
      message.success(`正在更新 ${selectedBaseline.component} 基准...`);
      setUpdateModalVisible(false);
      // 模拟更新
      setTimeout(() => {
        message.success(`${selectedBaseline.component} 基准更新完成`);
        loadBaselines();
      }, 2000);
    }
  };

  const getHealthStats = () => {
    const healthy = baselines.filter(b => b.status === 'healthy').length;
    const outdated = baselines.filter(b => b.status === 'outdated').length;
    const corrupted = baselines.filter(b => b.status === 'corrupted').length;
    const total = baselines.length;
    const needUpdate = outdated + corrupted;
    const highFrequency = baselines.filter(b => b.usageCount > 5).length;
    // 模拟新增组件数据，实际应该从后端获取
    const newComponents = 2;
    
    return {
      healthy,
      outdated,
      corrupted,
      total,
      needUpdate,
      highFrequency,
      newComponents,
      healthPercentage: total > 0 ? Math.round((healthy / total) * 100) : 0,
    };
  };

  const stats = getHealthStats();

  const columns = [
    {
      title: '组件信息',
      key: 'component',
      render: (_: any, record: BaselineInfo) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: 4, display: 'flex', alignItems: 'center' }}>
            {record.component}
            {record.riskLevel === 'high' && (
              <Tag color="red" style={{ marginLeft: 8 }}>
                高风险
              </Tag>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
            {record.path}
          </div>
          <div style={{ fontSize: '11px', color: '#999' }}>
            版本: {record.version} • 文件: {
              record.status === 'corrupted' || record.corruptionType === 'componentDeleted' 
                ? '--' 
                : record.status === 'outdated'
                  ? `${record.size} KB (当前)` 
                  : `${record.size} KB`
            }
          </div>
          <div style={{ fontSize: '11px', color: '#1890ff', marginTop: 2 }}>
            被引用: {record.usageCount}次 • {record.businessImpact}
          </div>
        </div>
      ),
      width: 300,
    },
    {
      title: '快照信息',
      key: 'snapshots',
      render: (_: any, record: BaselineInfo) => (
        <div 
          style={{ cursor: 'pointer' }}
          onClick={() => handleViewSnapshots(record)}
        >
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {record.snapshotCount}
            </span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: 4 }}>
              个快照
            </span>
          </div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {record.propsVariations}
            </span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: 4 }}>
              个Props组合
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#999', marginTop: 2 }}>
            基准大小: {record.size.toFixed(1)} KB
            {record.component === 'Button' && (
              <span style={{ color: '#1890ff', marginLeft: 4 }}>
                (真实数据)
              </span>
            )}
          </div>
          <div style={{ fontSize: '10px', color: '#1890ff', marginTop: 4 }}>
            点击查看详情 →
          </div>
        </div>
      ),
      width: 120,
    },
    {
      title: '更新信息',
      key: 'updates',
      render: (_: any, record: BaselineInfo) => (
        <div 
          style={{ cursor: 'pointer' }}
          onClick={() => handleViewHistory(record)}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
            创建: {record.createdAt.toLocaleDateString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
            更新: {record.lastUpdated.toLocaleDateString()}
          </div>
          <div style={{ fontSize: '11px', color: '#999' }}>
            develop版本: {record.commit}
          </div>
          <div style={{ fontSize: '11px', color: '#999' }}>
            开发者: Wendy Lin
          </div>
          <div style={{ fontSize: '10px', color: '#1890ff', marginTop: 4 }}>
            点击查看历史 →
          </div>
        </div>
      ),
      width: 150,
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: BaselineInfo) => (
        <StatusColumn baseline={record} />
      ),
      width: 120,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: BaselineInfo) => (
        <Space direction="vertical" size={4}>
          {/* 根据基准管理原则：健康基准不显示更新按钮 */}
          {record.status === 'outdated' && (
            <Button 
              size="small"
              icon={<SyncOutlined />}
              onClick={() => handleUpdateBaseline(record)}
              type="default"
            >
              更新
            </Button>
          )}
          
          {/* 损坏状态：根据损坏类型显示不同按钮 */}
          {record.status === 'corrupted' && record.corruptionType === 'fileCorrupted' && (
            <Button 
              size="small"
              icon={<ExclamationCircleOutlined />}
              onClick={() => handleUpdateBaseline(record)}
              type="primary"
              danger
            >
              重建
            </Button>
          )}
          
          {record.status === 'corrupted' && record.corruptionType === 'componentDeleted' && (
            <Button 
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleCleanupBaseline(record)}
              type="primary"
              danger
            >
              清理
            </Button>
          )}
          
          <Button 
            size="small"
            icon={<DatabaseOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            详情
          </Button>
          
          {record.status === 'healthy' && (
            <div style={{ fontSize: '11px', color: '#52c41a', textAlign: 'center' }}>
              无需操作
            </div>
          )}
        </Space>
      ),
      width: 80,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, marginBottom: 8 }}>
          <DatabaseOutlined style={{ marginRight: 12, color: '#1890ff' }} />
          Pure Components 基准管理
        </h1>
        <p style={{ color: '#666', margin: 0 }}>
          管理Pure Component的测试基准，包括快照、Props组合和版本信息
        </p>
      </div>

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总基准数"
              value={stats.total}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="需要更新"
              value={stats.needUpdate}
              prefix={<SyncOutlined />}
              valueStyle={{ color: stats.needUpdate > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="高频引用组件"
              value={stats.highFrequency}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="新增组件（未建基准）"
              value={stats.newComponents}
              prefix={<PlusCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 警告提示 */}
      {stats.corrupted > 0 && (
        <Alert
          message="发现损坏的基准"
          description={`有 ${stats.corrupted} 个组件的基准数据损坏，建议立即重建以确保测试准确性。`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button  danger>
              批量重建
            </Button>
          }
        />
      )}

      {stats.outdated > 0 && (
        <Alert
          message="基准更新提醒"
          description={`有 ${stats.outdated} 个组件的基准已过时，建议更新以保持同步。`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button >
              批量更新
            </Button>
          }
        />
      )}

      {/* 基准列表 */}
      <Card 
        title="基准列表"
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<SyncOutlined />}
              onClick={loadBaselines}
              loading={loading}
            >
              刷新状态
            </Button>
            <Button 
              icon={<DatabaseOutlined />}
              onClick={() => message.info('基准数据由系统自动同步develop分支生成')}
            >
              同步说明
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={baselines}
          columns={columns}
          loading={loading}
          rowKey="id"
          locale={{
            emptyText: baselines.length === 0 ? '暂无基准数据，请检查API连接或刷新页面' : '没有数据'
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          rowClassName={(record) => {
            const intelligentStatus = calculateIntelligentStatus(record);
            switch (intelligentStatus.type) {
              case 'healthy':
              case 'optimizable': return 'success-row';       // 绿色背景
              case 'outdated': return 'warning-row';          // 橙色背景
              case 'corrupted':
              case 'deleted': return 'error-row';             // 红色背景
              case 'unstable': return 'unstable-row';         // 橙红色背景
              case 'drifting': return 'drifting-row';         // 蓝色背景
              default: return 'success-row';
            }
          }}
        />
      </Card>

      {/* 更新确认弹窗 */}
      <Modal
        title="更新基准确认"
        open={updateModalVisible}
        onOk={confirmUpdateBaseline}
        onCancel={() => setUpdateModalVisible(false)}
        okText="确定更新"
        cancelText="取消"
      >
        {selectedBaseline && (
          <div>
            <p>
              确定要更新 <strong>{selectedBaseline.component}</strong> 的基准吗？
            </p>
            <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
              <div><strong>组件路径:</strong> {selectedBaseline.path}</div>
              <div><strong>当前版本:</strong> {selectedBaseline.version}</div>
              <div><strong>快照数量:</strong> {selectedBaseline.snapshotCount}</div>
              <div><strong>Props组合:</strong> {selectedBaseline.propsVariations}</div>
            </div>
            <Alert
              message="更新说明"
              description="更新基准将重新生成所有快照，这可能需要几分钟时间。更新期间相关的分支检测可能会受到影响。"
              type="info"
              showIcon
              style={{ marginTop: 12 }}
            />
          </div>
        )}
      </Modal>

      {/* 基准详情弹窗 */}
      <BaselineDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        baseline={selectedDetailBaseline}
      />

      {/* 快照管理弹窗 */}
      <SnapshotModal
        visible={snapshotModalVisible}
        onClose={() => setSnapshotModalVisible(false)}
        baseline={selectedSnapshotBaseline}
      />

      {/* 版本历史弹窗 */}
      <VersionHistoryModal
        visible={historyModalVisible}
        onClose={() => setHistoryModalVisible(false)}
        baseline={selectedHistoryBaseline}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          .success-row {
            background-color: #f6ffed !important;
          }
          .warning-row {
            background-color: #fffbe6 !important;
          }
          .error-row {
            background-color: #fff2f0 !important;
          }
          .unstable-row {
            background-color: #fff7e6 !important;
          }
          .drifting-row {
            background-color: #e6f7ff !important;
          }
        `
      }} />
    </div>
  );
};

export default PureComponentsBaselines;