import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Select, Tag, Switch, Popconfirm, Card, Divider, Typography, Row, Col, Statistic, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ApiOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
import { useMockStore } from '../../stores/mockStore';
import { Mock } from '../../services/types/mock';
import { getMethodColor, getStatusColor, formatDate } from '../../utils/helpers';

const { Search } = Input;
const { Option } = Select;

const MockList: React.FC = () => {
  const { 
    mocks, 
    loading, 
    fetchMocks, 
    deleteMock, 
    updateMock, 
    setFilters 
  } = useMockStore();

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    fetchMocks();
  }, [fetchMocks]);

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: Mock) => (
        <a onClick={() => handleEdit(record)}>{text}</a>
      )
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 80,
      render: (method: string) => (
        <Tag color={getMethodColor(method)}>{method}</Tag>
      )
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true
    },
    {
      title: '状态码',
      dataIndex: ['response', 'status'],
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      sorter: (a: Mock, b: Mock) => a.priority - b.priority
    },
    {
      title: '状态',
      dataIndex: 'active',
      key: 'active',
      width: 80,
      render: (active: boolean, record: Mock) => (
        <Switch
          checked={active}
          onChange={(checked) => handleToggleActive(record.id, checked)}
        />
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (date: string) => formatDate(date, 'MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Mock) => (
        <Space >
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定删除这个Mock吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleEdit = (mock: Mock) => {
    console.log('Edit mock:', mock);
    // TODO: 打开编辑对话框
  };

  const handleDelete = async (id: string) => {
    await deleteMock(id);
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    await updateMock(id, { active });
  };

  const handleBatchDelete = async () => {
    // TODO: 批量删除
    console.log('Batch delete:', selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys as string[]);
    },
  };

  // 计算统计数据
  const activeMocks = mocks.filter(mock => mock.active).length;
  const totalMocks = mocks.length;
  const mocksByMethod = mocks.reduce((acc, mock) => {
    acc[mock.method] = (acc[mock.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      {/* 页面标题和统计 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#262626' }}>
          <ApiOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Mock 规则管理
        </Title>
        <Text style={{ fontSize: 16, color: '#666' }}>
          管理和配置API Mock规则，支持多种HTTP方法和响应场景
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} md={6}>
          <Card>
            <Statistic
              title="总Mock数"
              value={totalMocks}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card>
            <Statistic
              title="激活中"
              value={activeMocks}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card>
            <Statistic
              title="未激活"
              value={totalMocks - activeMocks}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
              prefix={<PauseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                {totalMocks > 0 ? Math.round((activeMocks / totalMocks) * 100) : 0}%
              </div>
              <div style={{ color: '#666' }}>激活率</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 快速提示 */}
      {totalMocks === 0 && (
        <Alert
          message="🎭 欢迎开始使用Mock管理"
          description="您还没有创建任何Mock规则。点击右上角的'创建Mock'按钮来创建您的第一个API Mock规则。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Card>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 24
        }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>Mock规则列表</Title>
            <Text type="secondary">
              共 {totalMocks} 条规则，其中 {activeMocks} 条已激活
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => console.log('Create mock')}
          >
            创建Mock规则
          </Button>
        </div>

        {/* 搜索和筛选区域 */}
        <div style={{ 
          padding: 16,
          background: '#fafafa',
          borderRadius: 8,
          marginBottom: 16
        }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="🔍 搜索Mock名称或URL路径"
                onSearch={(value) => setFilters({ search: value })}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="HTTP方法"
                style={{ width: '100%' }}
                size="large"
                allowClear
                onChange={(value) => setFilters({ method: value })}
              >
                <Option value="GET"><Tag color="green">GET</Tag></Option>
                <Option value="POST"><Tag color="blue">POST</Tag></Option>
                <Option value="PUT"><Tag color="orange">PUT</Tag></Option>
                <Option value="DELETE"><Tag color="red">DELETE</Tag></Option>
                <Option value="PATCH"><Tag color="purple">PATCH</Tag></Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="激活状态"
                style={{ width: '100%' }}
                size="large"
                allowClear
                onChange={(value) => setFilters({ active: value })}
              >
                <Option value={true}>
                  <Tag color="success">✅ 激活中</Tag>
                </Option>
                <Option value={false}>
                  <Tag color="default">⏸️ 未激活</Tag>
                </Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              {selectedRowKeys.length > 0 ? (
                <Space>
                  <Text strong>已选择 {selectedRowKeys.length} 条规则</Text>
                  <Button danger onClick={handleBatchDelete}>
                    🗑️ 批量删除
                  </Button>
                  <Button onClick={() => setSelectedRowKeys([])}>
                    取消选择
                  </Button>
                </Space>
              ) : (
                <Text type="secondary">💡 支持多选批量操作</Text>
              )}
            </Col>
          </Row>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={mocks}
          loading={loading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default MockList;