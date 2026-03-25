import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Timeline, Card, Row, Col, Statistic, Tag, List, Button, Space, Alert, Divider } from 'antd';
import { ClockCircleOutlined, UserOutlined, CodeOutlined, FileTextOutlined, ArrowUpOutlined, ArrowDownOutlined, SyncOutlined, ExclamationCircleOutlined, PlusCircleOutlined, WarningOutlined } from '@ant-design/icons';
interface BaselineInfo {
  id: string;
  component: string;
  status: 'healthy' | 'outdated' | 'corrupted';
  version: string;
}

interface VersionHistory {
  id: string;
  componentId: string;
  versions: VersionRecord[];
  statistics: HistoryStatistics;
  metadata: {
    totalVersions: number;
    timeSpan: string;
    lastUpdate: string;
  };
}

interface VersionRecord {
  id: string;
  version: string;
  commit: string;
  branch: string;
  author: string;
  timestamp: string;
  type: 'baseline-created' | 'baseline-updated' | 'component-modified' | 'hotfix' | 'feature-update';
  changes: ChangeDetail[];
  baselineStatus: 'healthy' | 'outdated' | 'corrupted';
  performanceImpact?: 'improved' | 'degraded' | 'neutral';
  description: string;
  filesModified: string[];
  linesChanged: { added: number; deleted: number };
}

interface ChangeDetail {
  category: 'visual' | 'functional' | 'performance' | 'props' | 'structure';
  description: string;
  impact: 'breaking' | 'minor' | 'patch';
  affectedAreas: string[];
}

interface HistoryStatistics {
  updateFrequency: number; // updates per month
  averageHealthyDuration: number; // days
  totalUpdates: number;
  healthyPercentage: number;
  majorChanges: number;
  minorChanges: number;
  performanceImprovements: number;
  performanceDegradations: number;
}

interface VersionHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  baseline: BaselineInfo | null;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  visible,
  onClose,
  baseline
}) => {
  const [historyData, setHistoryData] = useState<VersionHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedNormalGroups, setExpandedNormalGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (visible && baseline) {
      loadVersionHistory(baseline.id);
    }
  }, [visible, baseline]);

  const loadVersionHistory = async (baselineId: string) => {
    setLoading(true);
    try {
      // 模拟API调用，实际应该从后端获取
      const mockData = generateMockVersionHistory(baselineId, baseline!);
      setHistoryData(mockData);
    } catch (error) {
      console.error('加载版本历史失败:', error);
    }
    setLoading(false);
  };

  const generateMockVersionHistory = (baselineId: string, baseline: BaselineInfo): VersionHistory => {
    // 基于真实的beep项目Button组件Git历史 - 完整历史（最新的在前）
    const versions: VersionRecord[] = [
      {
        id: 'v1',
        version: '68bb4f5',
        commit: '68bb4f503d46bc5c32527ca1b946c3294ef47f7c',
        branch: 'develop',
        author: 'Wendy Lin',
        timestamp: '2024-09-25T00:00:00+0800',
        type: 'component-modified',
        changes: [
          {
            category: 'functional',
            description: 'Update Complete Profile Data',
            impact: 'minor',
            affectedAreas: ['Profile Form', 'Button Integration']
          }
        ],
        baselineStatus: 'healthy',
        performanceImpact: 'neutral',
        description: 'WB-8135: Update Complete Profile Data (#3817)',
        filesModified: ['src/common/components/Button/index.jsx'],
        linesChanged: { added: 4, deleted: 0 }
      },
      {
        id: 'v2',
        version: 'e703078',
        commit: 'e703078fd1234567890abcdef1234567890abcdef',
        branch: 'develop',
        author: 'Philly Cai',
        timestamp: '2023-07-21T00:00:00+0800',
        type: 'component-modified',
        changes: [
          {
            category: 'functional',
            description: 'Fix test id eslint warnings',
            impact: 'patch',
            affectedAreas: ['Test IDs', 'ESLint Rules']
          }
        ],
        baselineStatus: 'healthy',
        performanceImpact: 'neutral',
        description: 'WB-5678: fix test id eslint warnings',
        filesModified: ['src/common/components/Button/index.jsx'],
        linesChanged: { added: 1, deleted: 0 }
      },
      {
        id: 'v3',
        version: 'd51879c',
        commit: 'd51879c10abcdef1234567890abcdef1234567890',
        branch: 'develop',
        author: 'wendylw',
        timestamp: '2022-10-26T00:00:00+0800',
        type: 'component-modified',
        changes: [
          {
            category: 'visual',
            description: 'Update primary button border color',
            impact: 'minor',
            affectedAreas: ['Primary Button', 'Border Styling']
          }
        ],
        baselineStatus: 'healthy',
        performanceImpact: 'neutral',
        description: 'WB-3984: Update primary button border color',
        filesModified: ['src/common/components/Button/Button.module.scss'],
        linesChanged: { added: 1, deleted: 1 }
      },
      {
        id: 'v4',
        version: '430c711',
        commit: '430c7111e1234567890abcdef1234567890abcdef',
        branch: 'develop',
        author: 'wendylw',  
        timestamp: '2022-10-26T00:00:00+0800',
        type: 'component-modified',
        changes: [
          {
            category: 'visual',
            description: 'Update buttons scss structure',
            impact: 'minor',
            affectedAreas: ['Button Styles', 'SCSS Organization']
          }
        ],
        baselineStatus: 'healthy',
        performanceImpact: 'improved',
        description: 'WB-3984: Update buttons scss',
        filesModified: ['src/common/components/Button/Button.module.scss'],
        linesChanged: { added: 57, deleted: 100 }
      },
      {
        id: 'v5',
        version: '672c79b',
        commit: '672c79ba71234567890abcdef1234567890abcdef',
        branch: 'develop',
        author: 'wendylw',
        timestamp: '2022-10-26T00:00:00+0800',
        type: 'component-modified',
        changes: [
          {
            category: 'visual',
            description: 'Update buttons gap spacing',
            impact: 'minor',
            affectedAreas: ['Button Spacing', 'Layout']
          }
        ],
        baselineStatus: 'healthy',
        performanceImpact: 'improved',
        description: 'WB-3984: Update buttons gap',
        filesModified: ['src/common/components/Button/Button.module.scss', 'src/common/components/Button/index.jsx'],
        linesChanged: { added: 7, deleted: 11 }
      },
      {
        id: 'v6',
        version: 'daf0d27',
        commit: 'daf0d2774fcaabc9165980114e806d2a7f5ae7e6',
        branch: 'develop',
        author: 'wendylw',
        timestamp: '2022-10-26T00:00:00+0800',
        type: 'component-modified',
        changes: [
          {
            category: 'functional',
            description: 'Update comments',
            impact: 'patch',
            affectedAreas: ['Code Comments', 'Documentation']
          }
        ],
        baselineStatus: 'healthy',
        performanceImpact: 'neutral',
        description: 'WB-3984: Update comments',
        filesModified: ['src/common/components/Button/Button.module.scss'],
        linesChanged: { added: 3, deleted: 1 }
      },
      {
        id: 'v7',
        version: 'f7b7ccb',
        commit: 'f7b7ccbfdec5b95c4fbf8373ee5e23acdd853f5d',
        branch: 'develop',
        author: 'wendylw',
        timestamp: '2022-10-26T00:00:00+0800',
        type: 'component-modified',
        changes: [
          {
            category: 'structure',
            description: 'Merge branch master into button-ui',
            impact: 'minor',
            affectedAreas: ['Branch Merge', 'Code Integration']
          }
        ],
        baselineStatus: 'healthy',
        performanceImpact: 'neutral',
        description: 'Merge branch \'master\' of github.com:storehubnet/beep-v1-web into WB-3984-button-ui',
        filesModified: ['src/common/components/Button/Button.module.scss'],
        linesChanged: { added: 29, deleted: 0 }
      },
      {
        id: 'v8',
        version: 'e1d60c6',
        commit: 'e1d60c6ac9a89e3b1829a1b9121a9129e1093b82',
        branch: 'develop',
        author: 'wendylw',
        timestamp: '2022-10-26T00:00:00+0800',
        type: 'feature-update',
        changes: [
          {
            category: 'visual',
            description: 'Major button UI redesign',
            impact: 'breaking',
            affectedAreas: ['Button Design', 'Visual Identity']
          }
        ],
        baselineStatus: 'healthy',
        performanceImpact: 'improved',
        description: 'WB-3984: Update button ui',
        filesModified: ['src/common/components/Button/Button.module.scss', 'src/common/components/Button/index.jsx'],
        linesChanged: { added: 6, deleted: 6 }
      },
      {
        id: 'v9',
        version: 'd1c044b',
        commit: 'd1c044bab8150a31ffa9e489eed94dbd4ea2ee29',
        branch: 'develop',
        author: 'wendylw',
        timestamp: '2022-10-25T00:00:00+0800',
        type: 'feature-update',
        changes: [
          {
            category: 'visual',
            description: 'Initial button UI design implementation',
            impact: 'breaking',
            affectedAreas: ['Button Design', 'Component Architecture']
          }
        ],
        baselineStatus: 'healthy',
        performanceImpact: 'improved',
        description: 'WB-3984-button-ui: Update button design',
        filesModified: ['src/common/components/Button/Button.module.scss', 'src/common/components/Button/index.jsx'],
        linesChanged: { added: 10, deleted: 12 }
      },
      {
        id: 'v10',
        version: '9c54b9e',
        commit: '9c54b9e6f975abd879d4d414852034a9e48face5',
        branch: 'develop',
        author: 'wendylw',
        timestamp: '2022-10-21T00:00:00+0800',
        type: 'component-modified',
        changes: [
          {
            category: 'visual',
            description: 'Button UI improvements',
            impact: 'minor',
            affectedAreas: ['Button Styling', 'UI Polish']
          }
        ],
        baselineStatus: 'healthy',
        performanceImpact: 'improved',
        description: 'WB-3984-button-ui: Update button UI',
        filesModified: ['src/common/components/Button/Button.module.scss', 'src/common/components/Button/index.jsx'],
        linesChanged: { added: 7, deleted: 1 }
      }
    ];

    const statistics: HistoryStatistics = {
      updateFrequency: 5, // 10次更新跨度约2年
      averageHealthyDuration: 365, // 平均健康持续365天（一直健康）
      totalUpdates: 10,
      healthyPercentage: 100, // 100%的时间保持健康
      majorChanges: 3, // 3个feature-update
      minorChanges: 7, // 7个component-modified
      performanceImprovements: 5, // 5个improved
      performanceDegradations: 0
    };

    return {
      id: baselineId,
      componentId: baseline.component,
      versions,
      statistics,
      metadata: {
        totalVersions: versions.length,
        timeSpan: '约2年',
        lastUpdate: '2024-09-25T00:00:00+0800'
      }
    };
  };

  const renderHistoryOverview = () => {
    if (!historyData) return null;

    const { versions, metadata } = historyData;

    // 统计破坏性修改和重构
    const breakingChanges = versions.filter(v => v.changes.some(c => c.impact === 'breaking')).length;
    const refactorChanges = versions.filter(v => 
      v.changes.some(c => c.category === 'structure' || c.description.includes('scss structure') || c.description.includes('redesign'))
    ).length;

    // 统计文件修改频率
    const fileModifications: Record<string, number> = {};
    versions.forEach(version => {
      version.filesModified.forEach(file => {
        const shortPath = file.replace('src/common/components/', '');
        fileModifications[shortPath] = (fileModifications[shortPath] || 0) + 1;
      });
    });

    return (
      <div>
        {/* 基本统计 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="时间跨度"
                value={metadata.timeSpan}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="破坏性修改"
                value={breakingChanges}
                suffix="个"
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="重构修改"
                value={refactorChanges}
                suffix="个"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 文件修改频率 */}
        <Card title="文件修改频率" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            {Object.entries(fileModifications).map(([file, count]) => (
              <Col span={12} key={file}>
                <Statistic
                  title={file}
                  value={count}
                  suffix="次"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            ))}
          </Row>
        </Card>

        {/* 最后更新信息 */}
        <Card title="最新状态">
          <div style={{ fontSize: '14px' }}>
            <strong>最后更新:</strong> {new Date(metadata.lastUpdate).toLocaleString()}
          </div>
        </Card>
      </div>
    );
  };

  const toggleNormalGroup = (groupKey: string) => {
    const newExpandedGroups = new Set(expandedNormalGroups);
    if (newExpandedGroups.has(groupKey)) {
      newExpandedGroups.delete(groupKey);
    } else {
      newExpandedGroups.add(groupKey);
    }
    setExpandedNormalGroups(newExpandedGroups);
  };

  const renderVersionTimeline = () => {
    if (!historyData) return null;

    const isImportantVersion = (version: VersionRecord) => {
      return version.changes.some(change => 
        change.impact === 'breaking' || 
        change.category === 'structure' || 
        change.description.includes('scss structure') || 
        change.description.includes('redesign') || 
        change.description.includes('重构')
      );
    };

    // 按时间顺序分组：将连续的普通版本合并
    const groupedVersions: Array<{
      type: 'important' | 'normal-group';
      versions: VersionRecord[];
      key: string;
    }> = [];

    let currentNormalGroup: VersionRecord[] = [];

    historyData.versions.forEach((version, index) => {
      if (isImportantVersion(version)) {
        // 如果遇到重要版本，先保存之前的普通版本组
        if (currentNormalGroup.length > 0) {
          groupedVersions.push({
            type: 'normal-group',
            versions: [...currentNormalGroup],
            key: `normal-group-${groupedVersions.length}`
          });
          currentNormalGroup = [];
        }
        
        // 添加重要版本
        groupedVersions.push({
          type: 'important',
          versions: [version],
          key: version.id
        });
      } else {
        // 如果是普通版本，添加到当前组
        currentNormalGroup.push(version);
      }
    });

    // 处理最后的普通版本组
    if (currentNormalGroup.length > 0) {
      groupedVersions.push({
        type: 'normal-group',
        versions: [...currentNormalGroup],
        key: `normal-group-${groupedVersions.length}`
      });
    }

    return (
      <div style={{
        '--timeline-label-width': '80px'
      } as React.CSSProperties}>
        <style>
          {`
            .ant-timeline-item-label {
              width: 80px !important;
              text-align: right;
            }
            .ant-timeline.ant-timeline-label .ant-timeline-item-left .ant-timeline-item-content {
              left: 120px !important;
              width: calc(100% - 140px) !important;
            }
            .ant-timeline.ant-timeline-label .ant-timeline-item-left .ant-timeline-item-head {
              left: 105px !important;
            }
            .ant-timeline.ant-timeline-label .ant-timeline-item-left .ant-timeline-item-tail {
              left: 111px !important;
            }
            .ant-timeline-item-head {
              z-index: 10 !important;
              background: white !important;
            }
          `}
        </style>
        <Timeline mode="left">
          {groupedVersions.map(group => {
            if (group.type === 'important') {
              const version = group.versions[0];
              return (
                <Timeline.Item
                  key={group.key}
                  dot={getTimelineIcon(version.type, version.changes)}
                  color={getTimelineColor(version.type, version.changes)}
                  label={
                    <div style={{ width: 60, fontSize: '11px' }}>
                      <div>{new Date(version.timestamp).toLocaleDateString()}</div>
                      <div style={{ color: '#666' }}>{version.version.substring(0, 7)}</div>
                    </div>
                  }
                >
                  <Card
                    size="small"
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ flex: 1, minWidth: 0 }}>{version.description}</span>
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          {version.changes.some(change => change.impact === 'breaking') && (
                            <Tag color="red" size="small">破坏性修改</Tag>
                          )}
                          {version.changes.some(change => change.category === 'structure' || change.description.includes('scss structure') || change.description.includes('redesign') || change.description.includes('重构')) && (
                            <Tag color="orange" size="small">重构</Tag>
                          )}
                        </div>
                      </div>
                    }
                  >
                    <div style={{ marginBottom: 8 }}>
                      <Space>
                        <span><UserOutlined /> {version.author}</span>
                      </Space>
                    </div>

                    <div style={{ fontSize: '12px', color: '#666' }}>
                      <strong>修改文件:</strong> {version.filesModified.map(file => file.replace('src/common/components/', '')).join(', ')}
                    </div>
                  </Card>
                </Timeline.Item>
              );
            } else {
              // 普通版本组
              const normalVersions = group.versions;
              const firstVersion = normalVersions[0];
              
              return (
                <Timeline.Item
                  key={group.key}
                  dot={<CodeOutlined style={{ fontSize: '14px' }} />}
                  color="blue"
                  label={
                    <div style={{ width: 60, fontSize: '11px' }}>
                      <div>{new Date(firstVersion.timestamp).toLocaleDateString()}</div>
                      <div style={{ color: '#666' }}>{normalVersions.length}个更新</div>
                    </div>
                  }
                >
                  {expandedNormalGroups.has(group.key) ? (
                    // 展开状态：显示所有普通版本的Card列表
                    <div>
                      {normalVersions.map((version, index) => (
                        <Card
                          key={version.id}
                          size="small"
                          style={{ marginBottom: index < normalVersions.length - 1 ? 8 : 0 }}
                        >
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ fontSize: '14px', fontWeight: 500 }}>{version.description}</span>
                              <span style={{ fontSize: '11px', color: '#999' }}>{version.version.substring(0, 7)}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              <Space>
                                <span><UserOutlined /> {version.author}</span>
                                <span>{new Date(version.timestamp).toLocaleDateString()}</span>
                              </Space>
                            </div>
                            <div style={{ fontSize: '11px', color: '#999', marginTop: 2 }}>
                              修改文件: {version.filesModified.map(file => file.replace('src/common/components/', '')).join(', ')}
                            </div>
                          </div>
                        </Card>
                      ))}
                      <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                        <Button 
                          type="primary"
                          ghost
                          size="small"
                          onClick={() => toggleNormalGroup(group.key)}
                          style={{ fontSize: '13px' }}
                        >
                          收起普通更新
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // 折叠状态：显示成简单的查看更多按钮
                    <Button 
                      type="text" 
                      onClick={() => toggleNormalGroup(group.key)}
                      style={{ 
                        padding: '4px 8px',
                        fontSize: '13px',
                        color: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                      }}
                    >
                      查看 {normalVersions.length} 个普通更新
                    </Button>
                  )}
                </Timeline.Item>
              );
            }
          })}
        </Timeline>
      </div>
    );
  };

  const renderDetailedChanges = () => {
    if (!historyData) return null;

    const isImportantVersion = (version: VersionRecord) => {
      return version.changes.some(change => 
        change.impact === 'breaking' || 
        change.category === 'structure' || 
        change.description.includes('scss structure') || 
        change.description.includes('redesign') || 
        change.description.includes('重构')
      );
    };

    // 按时间顺序分组：将连续的普通版本合并
    const groupedVersions: Array<{
      type: 'important' | 'normal-group';
      versions: VersionRecord[];
      key: string;
    }> = [];

    let currentNormalGroup: VersionRecord[] = [];

    historyData.versions.forEach((version, index) => {
      if (isImportantVersion(version)) {
        // 如果遇到重要版本，先保存之前的普通版本组
        if (currentNormalGroup.length > 0) {
          groupedVersions.push({
            type: 'normal-group',
            versions: [...currentNormalGroup],
            key: `normal-group-${groupedVersions.length}`
          });
          currentNormalGroup = [];
        }
        
        // 添加重要版本
        groupedVersions.push({
          type: 'important',
          versions: [version],
          key: version.id
        });
      } else {
        // 如果是普通版本，添加到当前组
        currentNormalGroup.push(version);
      }
    });

    // 处理最后的普通版本组
    if (currentNormalGroup.length > 0) {
      groupedVersions.push({
        type: 'normal-group',
        versions: [...currentNormalGroup],
        key: `normal-group-${groupedVersions.length}`
      });
    }

    return (
      <div>
        {groupedVersions.map(group => {
          if (group.type === 'important') {
            const version = group.versions[0];
            return (
              <Card
                key={group.key}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ flex: 1, minWidth: 0 }}>{version.version.substring(0, 8)} - {version.description}</span>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      {version.changes.some(change => change.impact === 'breaking') && (
                        <Tag color="red" size="small">破坏性修改</Tag>
                      )}
                      {version.changes.some(change => change.category === 'structure' || change.description.includes('scss structure') || change.description.includes('redesign') || change.description.includes('重构')) && (
                        <Tag color="orange" size="small">重构</Tag>
                      )}
                    </div>
                  </div>
                }
                style={{ marginBottom: 16 }}
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>基本信息</div>
                      <div style={{ fontSize: '12px' }}>
                        <div>作者: {version.author}</div>
                        <div>分支: {version.branch}</div>
                        <div>时间: {new Date(version.timestamp).toLocaleString()}</div>
                        <div>类型: {getTypeText(version.type)}</div>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>代码变更</div>
                      <div style={{ fontSize: '12px' }}>
                        <div style={{ color: '#52c41a' }}>+{version.linesChanged.added} 行新增</div>
                        <div style={{ color: '#ff4d4f' }}>-{version.linesChanged.deleted} 行删除</div>
                        <div style={{ marginTop: 4 }}>
                          <strong>修改文件:</strong>
                          <div style={{ marginTop: 2 }}>
                            {version.filesModified.map(file => (
                              <div key={file} style={{ fontSize: '11px', color: '#666' }}>
                                • {file.replace('src/common/components/', '')}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>影响评估</div>
                      <div style={{ fontSize: '12px' }}>
                        <div>基准状态: <Tag color={getStatusColor(version.baselineStatus)} size="small">{version.baselineStatus}</Tag></div>
                        {version.performanceImpact && (
                          <div>性能影响: <Tag color={getPerformanceColor(version.performanceImpact)} size="small">{getPerformanceText(version.performanceImpact)}</Tag></div>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>

                <Divider />

                <List
                  size="small"
                  dataSource={version.changes}
                  renderItem={change => (
                    <List.Item>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            影响区域: {change.affectedAreas.join(', ')}
                          </div>
                          <Space>
                            <Tag color={getCategoryColor(change.category)} size="small">
                              {change.category}
                            </Tag>
                            <Tag color={getImpactColor(change.impact)} size="small">
                              {change.impact}
                            </Tag>
                          </Space>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            );
          } else {
            // 普通版本组 - 简单的时间和显示更多按钮
            const normalVersions = group.versions;
            const firstVersion = normalVersions[0];
            
            return (
              <div key={group.key} style={{ marginBottom: 16 }}>
                {expandedNormalGroups.has(group.key) ? (
                  // 展开状态：显示所有普通版本的Cards
                  <div>
                    {normalVersions.map((version, index) => (
                      <Card
                        key={version.id}
                        title={`${version.version.substring(0, 8)} - ${version.description}`}
                        style={{ marginBottom: 8 }}
                      >
                        <Row gutter={16}>
                          <Col span={8}>
                            <div style={{ marginBottom: 8 }}>
                              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>基本信息</div>
                              <div style={{ fontSize: '12px' }}>
                                <div>作者: {version.author}</div>
                                <div>分支: {version.branch}</div>
                                <div>时间: {new Date(version.timestamp).toLocaleString()}</div>
                                <div>类型: {getTypeText(version.type)}</div>
                              </div>
                            </div>
                          </Col>
                          <Col span={8}>
                            <div style={{ marginBottom: 8 }}>
                              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>代码变更</div>
                              <div style={{ fontSize: '12px' }}>
                                <div style={{ color: '#52c41a' }}>+{version.linesChanged.added} 行新增</div>
                                <div style={{ color: '#ff4d4f' }}>-{version.linesChanged.deleted} 行删除</div>
                                <div style={{ marginTop: 4 }}>
                                  <strong>修改文件:</strong>
                                  <div style={{ marginTop: 2 }}>
                                    {version.filesModified.map(file => (
                                      <div key={file} style={{ fontSize: '11px', color: '#666' }}>
                                        • {file.replace('src/common/components/', '')}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={8}>
                            <div style={{ marginBottom: 8 }}>
                              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>影响评估</div>
                              <div style={{ fontSize: '12px' }}>
                                <div>基准状态: <Tag color={getStatusColor(version.baselineStatus)} size="small">{version.baselineStatus}</Tag></div>
                                {version.performanceImpact && (
                                  <div>性能影响: <Tag color={getPerformanceColor(version.performanceImpact)} size="small">{getPerformanceText(version.performanceImpact)}</Tag></div>
                                )}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                      <Button 
                        type="primary"
                        ghost
                        size="small"
                        onClick={() => toggleNormalGroup(group.key)}
                        style={{ fontSize: '13px' }}
                      >
                        收起普通更新
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 折叠状态：更醒目的设计
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '16px 20px',
                    margin: '8px 0',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => toggleNormalGroup(group.key)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9ecef';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {normalVersions.length}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '2px' }}>
                          普通更新
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {normalVersions.length === 1 
                            ? new Date(firstVersion.timestamp).toLocaleDateString()
                            : `${new Date(normalVersions[normalVersions.length - 1].timestamp).toLocaleDateString()} - ${new Date(firstVersion.timestamp).toLocaleDateString()}`
                          }
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: '#1890ff', 
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      查看详情
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        style={{ marginLeft: '4px' }}
                      >
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    );
  };

  // 工具函数
  const getTimelineIcon = (type: string, changes: ChangeDetail[]) => {
    // 优先显示特殊类型的图标，使用更大更醒目的样式
    if (changes.some(change => change.impact === 'breaking')) {
      return <WarningOutlined style={{ color: '#ff4d4f', fontSize: '16px', fontWeight: 'bold' }} />;
    }
    if (changes.some(change => change.category === 'structure' || change.description.includes('scss structure') || change.description.includes('redesign'))) {
      return <SyncOutlined style={{ color: '#fa8c16', fontSize: '16px', fontWeight: 'bold' }} />;
    }
    
    // 默认根据类型显示图标
    const icons = {
      'baseline-created': <FileTextOutlined style={{ fontSize: '14px' }} />,
      'baseline-updated': <SyncOutlined style={{ fontSize: '14px' }} />,
      'component-modified': <CodeOutlined style={{ fontSize: '14px' }} />,
      'hotfix': <WarningOutlined style={{ fontSize: '14px' }} />,
      'feature-update': <PlusCircleOutlined style={{ fontSize: '14px' }} />
    };
    return icons[type as keyof typeof icons] || <ClockCircleOutlined style={{ fontSize: '14px' }} />;
  };

  const getTimelineColor = (type: string, changes?: ChangeDetail[]) => {
    // 优先根据修改重要性设置颜色
    if (changes) {
      if (changes.some(change => change.impact === 'breaking')) {
        return 'red';
      }
      if (changes.some(change => change.category === 'structure' || change.description.includes('scss structure') || change.description.includes('redesign'))) {
        return 'orange';
      }
    }
    
    // 默认根据类型设置颜色
    const colors = {
      'baseline-created': 'green',
      'baseline-updated': 'blue',
      'component-modified': 'blue',
      'hotfix': 'red',
      'feature-update': 'purple'
    };
    return colors[type as keyof typeof colors] || 'blue';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'baseline-created': 'green',
      'baseline-updated': 'blue',
      'component-modified': 'orange',
      'hotfix': 'red',
      'feature-update': 'purple'
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const getTypeText = (type: string) => {
    const texts = {
      'baseline-created': '基准创建',
      'baseline-updated': '基准更新',
      'component-modified': '组件修改',
      'hotfix': '紧急修复',
      'feature-update': '功能更新'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = { healthy: 'green', outdated: 'orange', corrupted: 'red' };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getPerformanceColor = (impact: string) => {
    const colors = { improved: 'green', degraded: 'red', neutral: 'blue' };
    return colors[impact as keyof typeof colors] || 'default';
  };

  const getPerformanceText = (impact: string) => {
    const texts = { improved: '性能提升', degraded: '性能降级', neutral: '性能无变化' };
    return texts[impact as keyof typeof texts] || impact;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      visual: 'blue',
      functional: 'green',
      performance: 'orange',
      props: 'purple',
      structure: 'cyan'
    };
    return colors[category as keyof typeof colors] || 'default';
  };

  const getImpactColor = (impact: string) => {
    const colors = { breaking: 'red', minor: 'orange', patch: 'green' };
    return colors[impact as keyof typeof colors] || 'default';
  };

  const tabItems = [
    {
      key: 'overview',
      label: '历史概览',
      children: renderHistoryOverview()
    },
    {
      key: 'timeline',
      label: '版本时间线',
      children: renderVersionTimeline()
    },
    {
      key: 'details',
      label: '详细变更',
      children: renderDetailedChanges()
    }
  ];

  return (
    <Modal
      title={`版本历史 - ${baseline?.component || ''}`}
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
    >
      <Tabs items={tabItems} />
    </Modal>
  );
};

// 临时图标组件（实际项目中应该从antd导入）
const ExclamationTriangleIcon = () => <span>⚠️</span>;
const PlusCircleIcon = () => <span>➕</span>;

export default VersionHistoryModal;