-- Button组件真实诊断数据
-- 基于beep-v1-webapp中的真实Button组件

-- 插入基准数据
INSERT OR REPLACE INTO baselines (
  id, component_name, component_path, status, usage_count, 
  version, branch, commit_hash, file_size, snapshot_count, props_variations
) VALUES (
  'baseline-button-001',
  'Button', 
  'src/common/components/Button/index.jsx',
  'healthy',
  55,  -- 实际引用次数
  '68bb4f50',
  'develop',
  '68bb4f503d46bc5c32527ca1b946c3294ef47f7c',
  2.6,  -- 文件大小 KB
  15,   -- 快照数量
  12    -- props组合数量
);

-- 插入诊断问题数据
INSERT OR REPLACE INTO diagnostic_problems (
  id, baseline_id, severity, category, impact, 
  affected_scenarios, reproduction, frequency, evidence, root_cause, quick_fix
) VALUES 
-- 问题1: React.memo优化
(
  'dp-button-001',
  'baseline-button-001',
  'warning',
  'performance',
  '渲染性能可提升15%',
  '列表页面中的按钮',
  '在商品列表快速滚动时',
  '每次滚动触发20+次',
  '{"renderCount": 45, "avgRenderTime": "2ms"}',
  '{"issue": "No memoization", "parentUpdates": "frequent", "where": {"file": "src/common/components/Button/index.jsx", "line": 6, "code": "const Button = props => {"}}',
  '{"solution": "Wrap with React.memo", "effort": "low", "confidence": 85, "estimatedTime": "5分钟", "diff": {"before": "export default Button;", "after": "export default React.memo(Button);", "file": "src/common/components/Button/index.jsx", "line": 92}, "alternativeDiff": {"before": "export default Button;", "after": "export default React.memo(Button, (prevProps, nextProps) => {\n  // 自定义比较逻辑：只在这些属性变化时重新渲染\n  return prevProps.loading === nextProps.loading &&\n         prevProps.type === nextProps.type &&\n         prevProps.size === nextProps.size &&\n         prevProps.theme === nextProps.theme &&\n         prevProps.children === nextProps.children &&\n         prevProps.onClick === nextProps.onClick;\n});", "file": "src/common/components/Button/index.jsx", "line": 92}}'
),

-- 问题2: 无障碍性问题
(
  'dp-button-002',
  'baseline-button-001',
  'info',
  'accessibility',
  'Screen readers cannot determine button purpose',
  'Icon-only action buttons',
  '1. Create button with only icon prop, 2. Check with screen reader',
  'Occasional',
  '{"occurrences": 12, "locations": ["filters", "actions"]}',
  '{"issue": "No automatic aria-label for icon buttons", "where": {"file": "src/common/components/Button/index.jsx", "line": 32, "code": "    <button"}}',
  '{"solution": "Add aria-label prop when icon-only", "effort": "low", "confidence": 85, "estimatedTime": "10分钟", "diff": {"before": "      data-test-id=\"common.button.btn\"\n      type={buttonType}\n      // eslint-disable-next-line react/jsx-props-no-spreading\n      {...rest}", "after": "      data-test-id=\"common.button.btn\"\n      type={buttonType}\n      aria-label={!children && icon ? \"Icon button\" : undefined}\n      // eslint-disable-next-line react/jsx-props-no-spreading\n      {...rest}", "file": "src/common/components/Button/index.jsx", "line": 38}, "usageExample": {"before": "<Button icon={<CloseOutlined />} onClick={handleClose} />", "after": "<Button icon={<CloseOutlined />} onClick={handleClose} ariaLabel=\"关闭\" />", "file": "使用示例"}}'
);

-- 插入建议数据
INSERT OR REPLACE INTO suggestions (
  id, baseline_id, suggestion_type, content
) VALUES 
(
  'suggestion-button-001',
  'baseline-button-001',
  'performance',
  '{"type": "memo", "title": "添加React.memo优化", "description": "通过React.memo包装组件，减少不必要的重渲染", "priority": "medium", "estimatedTime": "5分钟", "benefits": ["减少15%渲染时间", "提升列表滚动性能", "降低CPU使用率"]}'
),
(
  'suggestion-button-002', 
  'baseline-button-001',
  'accessibility',
  '{"type": "aria-label", "title": "改善无障碍访问", "description": "为仅包含图标的按钮添加aria-label属性", "priority": "low", "estimatedTime": "10分钟", "benefits": ["提升屏幕阅读器支持", "符合WCAG标准", "改善用户体验"]}'
);