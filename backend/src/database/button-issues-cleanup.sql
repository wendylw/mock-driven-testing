-- Clean up Button component issues and add accurate ones

-- First, let's see what we have
SELECT id, category, impact FROM diagnostic_problems WHERE baseline_id = 'baseline-button-001';

-- Delete any incorrect visual issues
DELETE FROM diagnostic_problems WHERE baseline_id = 'baseline-button-001' AND impact IN (
  '按钮内边距不一致',
  '圆角不一致',
  '颜色对比度不足'
);

-- Add real, accurate visual enhancements (not bugs, but improvements)
INSERT OR REPLACE INTO diagnostic_problems (
  id, baseline_id, severity, category, impact, 
  affected_scenarios, reproduction, frequency, evidence, root_cause, quick_fix
) VALUES 
-- Visual Enhancement: Focus visibility
(
  'dp-button-visual-001',
  'baseline-button-001',
  'info',
  'visual',
  '焦点可见性可增强',
  '键盘导航时',
  '当前仅通过边框颜色变化显示焦点，建议添加更明显的焦点环',
  '键盘Tab导航时',
  JSON('{
    "currentBehavior": "focus时边框颜色变化",
    "suggestion": "添加2px的outline以提升可见性",
    "wcagReference": "WCAG 2.4.7 Focus Visible"
  }'),
  JSON('{
    "analysis": "符合基本可访问性要求，但可以更明显",
    "bestPractice": "使用outline而非仅依赖边框变化"
  }'),
  JSON('{
    "title": "增强焦点可见性",
    "action": "为按钮添加更明显的焦点样式",
    "code": "&:focus-visible { outline: 2px solid #FF9419; outline-offset: 2px; }",
    "steps": ["在Button.module.scss中添加focus-visible样式", "使用2px的橙色outline", "设置2px的offset确保间距"],
    "estimatedTime": "5分钟",
    "priority": "低"
  }')
);

-- Update suggestions table to ensure Chinese
UPDATE suggestions SET 
  title = CASE 
    WHEN title LIKE '%performance%' THEN '性能优化建议'
    WHEN title LIKE '%accessibility%' THEN '无障碍访问建议'
    ELSE title
  END,
  description = CASE
    WHEN description LIKE '%React.memo%' THEN '使用React.memo优化组件渲染性能'
    WHEN description LIKE '%aria-label%' THEN '添加aria-label属性提升无障碍访问'
    ELSE description
  END
WHERE baseline_id = 'baseline-button-001';

-- Update any remaining English text in diagnostic_problems
UPDATE diagnostic_problems SET
  impact = REPLACE(impact, 'Screen readers cannot determine button purpose', '屏幕阅读器无法确定按钮用途'),
  impact = REPLACE(impact, 'Minor performance degradation', '性能略有下降')
WHERE baseline_id = 'baseline-button-001';