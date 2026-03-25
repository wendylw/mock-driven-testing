-- 初始化测试数据
USE mdt;

-- 插入测试用户
INSERT INTO users (id, username, email, password_hash, role) VALUES
('user-001', 'wendy', 'wendy@example.com', '$2b$10$YourHashedPasswordHere', 'admin'),
('user-002', 'developer1', 'dev1@example.com', '$2b$10$YourHashedPasswordHere', 'developer'),
('user-003', 'developer2', 'dev2@example.com', '$2b$10$YourHashedPasswordHere', 'developer');

-- 插入基准数据
INSERT INTO baselines (
  id, component_name, component_path, status, usage_count, 
  version, branch, commit_hash, file_size, snapshot_count, props_variations
) VALUES
-- Button组件 - 健康状态
('baseline-button-001', 'Button', 'src/common/components/Button/index.tsx', 'healthy', 8,
 '0.1.0', 'develop', 'a7f9d2c', 2.6, 15, 12),

-- CreateOrderButton组件 - 过时状态
('baseline-createorderbutton-001', 'CreateOrderButton', 'src/business/CreateOrderButton/index.tsx', 'outdated', 25,
 '0.1.0-beta', 'develop', 'a2d5c8f', 4.2, 8, 6),

-- Modal组件 - 损坏状态
('baseline-modal-001', 'Modal', 'src/common/components/Modal/index.tsx', 'corrupted', 15,
 '0.1.0', 'develop', 'd4e5f6g', 6.5, 6, 4),

-- Input组件 - 健康但可优化
('baseline-input-001', 'Input', 'src/common/components/Input/index.tsx', 'healthy', 12,
 '0.1.0', 'develop', 'b8g0e3d', 3.2, 12, 8),

-- OldCard组件 - 已删除
('baseline-oldcard-001', 'OldCard', 'src/common/components/OldCard/index.tsx', 'corrupted', 0,
 '1.2.0', 'develop', 'old123ab', 0, 6, 4);

-- 插入版本历史数据
INSERT INTO version_history (
  id, baseline_id, commit_hash, author, message, 
  lines_added, lines_deleted, change_type, timestamp
) VALUES
-- Button组件历史
('history-001', 'baseline-button-001', 'a7f9d2c', 'Wendy Lin', 'feat: 添加loading状态', 
 20, 5, 'normal', '2025-01-29 10:30:00'),
('history-002', 'baseline-button-001', 'b6e8c1b', 'Wendy Lin', 'fix: 修复样式问题', 
 5, 3, 'normal', '2025-01-25 14:20:00'),

-- CreateOrderButton频繁变更历史
('history-003', 'baseline-createorderbutton-001', 'a2d5c8f', 'Wendy Lin', 'feat: 新增支付功能', 
 50, 10, 'normal', '2025-01-28 09:00:00'),
('history-004', 'baseline-createorderbutton-001', 'b3d6c9e', 'Wendy Lin', 'fix: 修复按钮状态', 
 15, 8, 'normal', '2025-01-26 11:30:00'),
('history-005', 'baseline-createorderbutton-001', 'c4e7d0f', 'Wendy Lin', 'refactor: 优化代码结构', 
 30, 25, 'refactoring', '2025-01-24 16:45:00'),
('history-006', 'baseline-createorderbutton-001', 'd5f8e1g', 'Wendy Lin', 'fix: 修复支付流程', 
 12, 5, 'normal', '2025-01-22 10:15:00'),
('history-007', 'baseline-createorderbutton-001', 'e6g9f2h', 'Wendy Lin', 'feat: 添加订单确认', 
 40, 15, 'normal', '2025-01-20 13:20:00');

-- 插入问题诊断数据
INSERT INTO diagnostic_problems (
  id, baseline_id, severity, category, impact, 
  affected_scenarios, reproduction, frequency, evidence, root_cause, quick_fix
) VALUES
-- Button组件性能问题
('problem-001', 'baseline-button-001', 'warning', 'performance', 
 '渲染性能可提升15%', '列表页面中的按钮', '在商品列表快速滚动时', '每次滚动触发20+次',
 '{"type": "trace", "data": {"renderTime": 25, "threshold": 16}}',
 '{"what": "未使用React.memo", "why": "组件会随父组件重渲染"}',
 '{"available": true, "solution": "添加React.memo", "confidence": 95}'),

-- CreateOrderButton严重性能问题
('problem-002', 'baseline-createorderbutton-001', 'critical', 'performance',
 '导致结算页面卡顿，影响转化率', '购物车结算流程', '点击结算按钮时', '每次点击',
 '{"type": "trace", "data": {"renderTime": 85, "threshold": 16}}',
 '{"what": "组件过于复杂", "why": "包含太多业务逻辑"}',
 '{"available": true, "solution": "拆分组件，优化渲染", "confidence": 90}'),

-- Modal可访问性问题
('problem-003', 'baseline-modal-001', 'warning', 'accessibility',
 '屏幕阅读器无法正确识别', '所有使用Modal的场景', '使用屏幕阅读器时', '始终存在',
 '{"type": "code", "data": {"line": 45, "issue": "missing aria-label"}}',
 '{"what": "缺少ARIA属性", "why": "开发时未考虑可访问性"}',
 '{"available": true, "solution": "添加aria-label和role属性", "confidence": 100}');

-- 插入建议数据
INSERT INTO suggestions (id, baseline_id, suggestion_type, content) VALUES
('suggestion-001', 'baseline-button-001', 'code', 
 '{"title": "添加React.memo优化", "impact": "性能提升15%", "code": "export const Button = React.memo(...)"}'),
 
('suggestion-002', 'baseline-input-001', 'visual',
 '{"title": "优化focus状态样式", "description": "当前focus边框不够明显", "screenshot": "/snapshots/input-focus.png"}'),
 
('suggestion-003', 'baseline-createorderbutton-001', 'refactor',
 '{"title": "拆分复杂组件", "description": "建议将支付逻辑抽离到独立hook", "benefits": ["提高可维护性", "改善性能"]}');

-- 插入学习模式数据
INSERT INTO learning_patterns (id, user_id, pattern_type, pattern_data, confidence) VALUES
('pattern-001', 'user-001', 'code_style', 
 '{"preference": "React.memo", "frequency": 6, "context": "performance optimization"}', 95),
 
('pattern-002', 'user-001', 'workflow_pattern',
 '{"action": "always_fix_critical_first", "observed": 10}', 88);

-- 创建一个正在进行的分析任务
INSERT INTO analysis_queue (
  id, baseline_id, priority, status, progress, current_step
) VALUES
('analysis-001', 'baseline-button-001', 'normal', 'completed', 100, '分析完成'),
('analysis-002', 'baseline-createorderbutton-001', 'high', 'processing', 60, '生成建议');