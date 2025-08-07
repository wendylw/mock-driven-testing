-- Button Component Variants from BEEP webapp
-- Based on Button.module.scss $attributes array

-- Insert actual Button variants
INSERT OR REPLACE INTO component_variants (
  id, baseline_id, variant_key, variant_dimensions, variant_styles, usage_count
) VALUES 
-- Primary variants
('var-button-001', 'baseline-button-001', 'primary-default', 
 '{"type": "primary", "theme": "default", "color": "orange"}',
 '{"background": "#FF9419", "color": "#FFFFFF", "border": "1px solid #FF9419", "padding": "12px 16px"}',
 25),
('var-button-002', 'baseline-button-001', 'primary-danger',
 '{"type": "primary", "theme": "danger", "color": "red"}',
 '{"background": "#E74C3C", "color": "#FFFFFF", "border": "1px solid #E74C3C", "padding": "12px 16px"}',
 8),
('var-button-003', 'baseline-button-001', 'primary-info',
 '{"type": "primary", "theme": "info", "color": "blue"}',
 '{"background": "#3498DB", "color": "#FFFFFF", "border": "1px solid #3498DB", "padding": "12px 16px"}',
 5),

-- Secondary variants
('var-button-004', 'baseline-button-001', 'secondary-default',
 '{"type": "secondary", "theme": "default", "color": "orange"}',
 '{"background": "#FFFFFF", "color": "#FF9419", "border": "1px solid #FF9419", "padding": "12px 16px"}',
 12),
('var-button-005', 'baseline-button-001', 'secondary-danger',
 '{"type": "secondary", "theme": "danger", "color": "red"}',
 '{"background": "#FFFFFF", "color": "#E74C3C", "border": "1px solid #E74C3C", "padding": "12px 16px"}',
 3),
('var-button-006', 'baseline-button-001', 'secondary-info',
 '{"type": "secondary", "theme": "info", "color": "blue"}',
 '{"background": "#FFFFFF", "color": "#3498DB", "border": "1px solid #3498DB", "padding": "12px 16px"}',
 2),

-- Text variants
('var-button-007', 'baseline-button-001', 'text-default',
 '{"type": "text", "theme": "default", "color": "orange"}',
 '{"background": "transparent", "color": "#FF9419", "border": "none", "padding": "8px"}',
 15),
('var-button-008', 'baseline-button-001', 'text-ghost',
 '{"type": "text", "theme": "ghost", "color": "gray"}',
 '{"background": "transparent", "color": "#9E9E9E", "border": "none", "padding": "8px"}',
 8),
('var-button-009', 'baseline-button-001', 'text-danger',
 '{"type": "text", "theme": "danger", "color": "red"}',
 '{"background": "transparent", "color": "#E74C3C", "border": "none", "padding": "8px"}',
 4),
('var-button-010', 'baseline-button-001', 'text-info',
 '{"type": "text", "theme": "info", "color": "blue"}',
 '{"background": "transparent", "color": "#3498DB", "border": "none", "padding": "8px"}',
 3);

-- Now add variant-specific issues
INSERT OR REPLACE INTO variant_issues (
  id, baseline_id, variant_id, issue_type, severity, details, suggested_fix
) VALUES
-- Secondary disabled button color contrast issue
('vi-button-001', 'baseline-button-001', 'var-button-004', 'color_contrast', 'warning',
 '{"message": "Secondary按钮禁用状态文字对比度不足", "expected": {"contrast": "4.5:1", "foreground": "#757575"}, "actual": {"contrast": "1.3:1", "foreground": "#DEDEDF", "background": "#FFFFFF"}, "location": "Button.module.scss line 39", "wcagLevel": "Fail AA"}',
 '{"action": "将disabled:tw-text-gray-400改为disabled:tw-text-gray-700", "code": "disabled:tw-text-gray-700", "impact": "提升无障碍访问性，符合WCAG AA标准", "estimatedTime": "2分钟"}'),

-- Text ghost button visibility issue
('vi-button-002', 'baseline-button-001', 'var-button-008', 'visibility', 'info',
 '{"message": "Text-ghost按钮在浅色背景上可见性较低", "expected": {"color": "#757575"}, "actual": {"color": "#9E9E9E"}, "location": "Button.module.scss line 10", "context": "用于次要操作时可能不够明显"}',
 '{"action": "考虑为ghost按钮使用稍深的灰色", "code": "text-ghost使用gray-700而非gray-600", "impact": "提升在浅色背景上的可见性", "estimatedTime": "5分钟"}');