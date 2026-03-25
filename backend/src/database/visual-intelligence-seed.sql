-- Visual Intelligence Detection Data for Button Component
-- This data provides visual problem detection for the BEEP Button component

INSERT OR REPLACE INTO visual_intelligence_data (
  id, baseline_id, detection_type, problem_summary, visual_evidence, severity, category, confidence_score, suggested_action, implementation_guide
) VALUES 

-- Visual Issue 1: Color Contrast Problem
(
  'vi-button-001',
  'baseline-button-001',
  'color_contrast',
  '按钮在浅色背景下对比度不足',
  JSON('[
    {
      "type": "screenshot",
      "url": "/evidence/button-contrast-issue.png",
      "description": "当前按钮在浅灰色背景下文字难以识别"
    },
    {
      "type": "color_analysis", 
      "current_contrast": "3.1:1",
      "required_contrast": "4.5:1",
      "affected_elements": ["button text", "button border"]
    }
  ]'),
  'warning',
  'accessibility',
  0.92,
  '调整按钮颜色以提高对比度',
  JSON('{
    "steps": [
      "将按钮背景色从 #e6e6e6 改为 #666666",
      "确保文字颜色为白色 #ffffff",
      "测试在不同背景下的显示效果"
    ],
    "code_changes": {
      "file": "src/common/components/Button/index.jsx",
      "line": 45,
      "before": "background: #e6e6e6;",
      "after": "background: #666666;"
    }
  }')
),

-- Visual Issue 2: Layout Inconsistency
(
  'vi-button-002', 
  'baseline-button-001',
  'layout_inconsistency',
  '按钮在不同屏幕尺寸下布局不一致',
  JSON('[
    {
      "type": "responsive_test",
      "mobile_view": "/evidence/button-mobile-layout.png",
      "desktop_view": "/evidence/button-desktop-layout.png",
      "description": "移动端按钮高度和间距与桌面端不匹配"
    },
    {
      "type": "measurement",
      "mobile_height": "32px",
      "desktop_height": "40px",
      "inconsistency": "25% height difference"
    }
  ]'),
  'info',
  'layout',
  0.88,
  '统一不同设备下的按钮尺寸',
  JSON('{
    "steps": [
      "定义统一的按钮高度变量",
      "使用rem单位确保响应式适配",
      "在所有断点下测试显示效果"
    ],
    "code_changes": {
      "file": "src/common/components/Button/index.jsx", 
      "line": 23,
      "before": "height: 40px;",
      "after": "height: clamp(32px, 4vw, 40px);"
    }
  }')
),

-- Visual Issue 3: Loading State Visibility
(
  'vi-button-003',
  'baseline-button-001', 
  'loading_visibility',
  '加载状态下的视觉反馈不够明显',
  JSON('[
    {
      "type": "user_test_video",
      "url": "/evidence/button-loading-confusion.mp4",
      "description": "用户测试显示67%的用户未注意到按钮处于加载状态"
    },
    {
      "type": "loading_comparison",
      "current_indicator": "small spinner",
      "visibility_score": "3/10",
      "user_confusion_rate": "67%"
    }
  ]'),
  'warning',
  'user_experience',
  0.91,
  '增强加载状态的视觉提示',
  JSON('{
    "steps": [
      "增加加载时的文字提示",
      "使用更明显的加载动画",
      "添加按钮颜色变化来指示状态"
    ],
    "code_changes": {
      "file": "src/common/components/Button/index.jsx",
      "line": 67,
      "before": "{loading && <Spinner />}",
      "after": "{loading && (<><Spinner /> <span>加载中...</span></>)}"
    }
  }')
);