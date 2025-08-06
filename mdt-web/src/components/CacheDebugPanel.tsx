import React, { useState } from 'react';
import { Card, Button, Space, Statistic, Row, Col, List, Tag, Modal, message } from 'antd';
import { DeleteOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { memoryCache, persistentCache } from '../services/cache.service';

export const CacheDebugPanel: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const refreshStats = () => {
    setStats({
      memory: memoryCache.getStats(),
      persistent: persistentCache.getStats()
    });
  };

  const clearMemoryCache = () => {
    memoryCache.clear();
    message.success('内存缓存已清空');
    refreshStats();
  };

  const clearPersistentCache = () => {
    persistentCache.clear();
    message.success('持久缓存已清空');
    refreshStats();
  };

  const clearSpecificKey = (key: string) => {
    memoryCache.delete(key);
    message.success(`已删除缓存: ${key}`);
    refreshStats();
  };

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <Button
        icon={<InfoCircleOutlined />}
        onClick={() => {
          refreshStats();
          setVisible(true);
        }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 999
        }}
      >
        缓存调试
      </Button>

      <Modal
        title="缓存调试面板"
        visible={visible}
        onCancel={() => setVisible(false)}
        width={800}
        footer={null}
      >
        {stats && (
          <>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="内存缓存"
                    value={stats.memory.size}
                    suffix={`/ ${stats.memory.maxSize}`}
                    valueStyle={{ color: '#3f8600' }}
                  />
                  <Space style={{ marginTop: 16 }}>
                    <Button
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={refreshStats}
                    >
                      刷新
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={clearMemoryCache}
                    >
                      清空
                    </Button>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="持久缓存"
                    value={stats.persistent.size}
                    suffix={`/ ${stats.persistent.maxSize}`}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Space style={{ marginTop: 16 }}>
                    <Button
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={refreshStats}
                    >
                      刷新
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={clearPersistentCache}
                    >
                      清空
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Card title="缓存键列表" size="small">
              <List
                size="small"
                dataSource={stats.memory.keys}
                renderItem={(key: string) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        danger
                        size="small"
                        onClick={() => clearSpecificKey(key)}
                      >
                        删除
                      </Button>
                    ]}
                  >
                    <Space>
                      <Tag color={key.startsWith('baseline:') ? 'blue' : 'green'}>
                        {key.split(':')[0]}
                      </Tag>
                      <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {key}
                      </span>
                    </Space>
                  </List.Item>
                )}
                style={{ maxHeight: 400, overflow: 'auto' }}
              />
            </Card>
          </>
        )}
      </Modal>
    </>
  );
};