-- Visual Issues Seed Data for BEEP Button Component
-- Based on actual Button implementation analysis

-- Clear existing visual issues first
DELETE FROM diagnostic_problems WHERE category = 'visual' AND baseline_id = 'baseline-button-001';

-- Add actual visual observations
INSERT OR REPLACE INTO diagnostic_problems (
  id, baseline_id, severity, category, impact, 
  affected_scenarios, reproduction, frequency, evidence, root_cause, quick_fix
) VALUES 
-- Visual Enhancement: Font Weight Consistency
(
  'dp-button-visual-001',
  'baseline-button-001',
  'info',
  'visual',
  '字体粗细可优化',
  '所有按钮文本',
  '按钮使用font-bold但未指定具体数值，建议明确指定font-weight: 700',
  '每次渲染',
  JSON('{
    "visualDiff": {
      "property": "font-weight",
      "expected": {"value": "700", "token": "tw-font-bold"},
      "actual": {"value": "bold", "computed": "700"},
      "location": {"file": "Button.module.scss", "line": 81},
      "selector": ".buttonContent"
    },
    "designSystemRef": {
      "token": "tw-font-bold",
      "recommendation": "使用明确的font-weight数值以确保跨浏览器一致性"
    }
  }'),
  JSON('{
    "analysis": "使用了相对字体粗细值",
    "bestPractice": "使用数值型font-weight确保一致性"
  }'),
  JSON('{
    "title": "明确指定字体粗细",
    "action": "将font-bold改为明确的font-weight: 700",
    "code": ".buttonContent { font-weight: 700; }",
    "steps": ["在Button.module.scss中明确指定font-weight", "确保所有浏览器显示一致"],
    "estimatedTime": "2分钟",
    "priority": "低"
  }')
),

-- Visual Enhancement: Hover Transition
(
  'dp-button-visual-002',
  'baseline-button-001',
  'info',
  'visual', 
  '过渡动画可增强',
  '按钮hover状态',
  '按钮使用了tw-transition但未指定具体的过渡属性，可能影响性能',
  'hover交互时',
  JSON('{
    "visualDiff": {
      "property": "transition",
      "expected": {"value": "background-color 0.15s ease-in-out, border-color 0.15s ease-in-out"},
      "actual": {"value": "all 150ms ease-in-out"},
      "location": {"file": "Button.module.scss", "line": 78},
      "selector": ".button"
    },
    "performanceImpact": {
      "current": "过渡所有属性可能导致不必要的重绘",
      "optimized": "仅过渡需要的属性可提升性能"
    }
  }'),
  JSON('{
    "analysis": "使用了transition: all",
    "optimization": "明确指定需要过渡的属性"
  }'),
  JSON('{
    "title": "优化过渡动画性能",
    "action": "将transition: all改为仅过渡background-color和border-color",
    "code": "transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;",
    "steps": ["修改transition属性", "测试hover效果", "验证性能提升"],
    "estimatedTime": "5分钟",
    "priority": "低"
  }')
),

-- Visual Enhancement: Focus Ring Style
(
  'dp-button-visual-003',
  'baseline-button-001',
  'warning',
  'visual',
  '焦点样式可改进',
  '键盘导航时',
  '按钮focus状态缺少明显的焦点环，影响可访问性',
  '键盘Tab导航',
  JSON('{
    "visualDiff": {
      "property": "focus-ring",
      "expected": {"outline": "2px solid #FF9419", "outlineOffset": "2px"},
      "actual": {"outline": "none", "border": "1px solid"},
      "location": {"file": "Button.module.scss", "line": 28},
      "selector": ":focus"
    },
    "accessibilityImpact": {
      "wcag": "2.4.7 Focus Visible",
      "current": "焦点指示不够明显",
      "requirement": "需要清晰的焦点指示器"
    }
  }'),
  JSON('{
    "analysis": "仅通过边框颜色变化表示焦点",
    "a11yRequirement": "需要更明显的焦点指示"
  }'),
  JSON('{
    "title": "增强焦点可见性",
    "action": "添加明显的焦点环以提升可访问性",
    "code": "&:focus-visible { outline: 2px solid #FF9419; outline-offset: 2px; }",
    "steps": ["添加focus-visible样式", "使用2px的outline", "设置2px的offset确保间距", "测试键盘导航效果"],
    "estimatedTime": "5分钟",
    "priority": "中等",
    "wcagCompliance": "符合WCAG 2.4.7焦点可见性要求"
  }')
);