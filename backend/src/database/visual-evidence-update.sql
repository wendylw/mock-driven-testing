-- Update visual issue evidence to be more descriptive

UPDATE diagnostic_problems SET 
  evidence = JSON('{
    "description": "在检查Secondary类型按钮的禁用状态样式时，发现文字颜色过浅，导致在白色背景上几乎无法辨识",
    "context": {
      "component": "Button组件",
      "variant": "Secondary按钮",
      "state": "禁用状态(disabled)",
      "scenario": "表单验证未通过时的提交按钮"
    },
    "preconditions": [
      "按钮类型(type)设置为\"secondary\"",
      "按钮禁用(disabled)属性为true",
      "按钮渲染在标准白色背景(#FFFFFF)上"
    ],
    "observations": {
      "visual": "灰色文字(#DEDEDF)在白色背景上几乎看不见，需要仔细观察才能发现按钮文字",
      "technical": "CSS规则使用了disabled:tw-text-gray-400，对应颜色值#DEDEDF",
      "measurement": "经过对比度计算工具测量，实际对比度仅为1.3:1"
    },
    "standards": {
      "wcagRequirement": "WCAG AA标准要求普通文本对比度至少4.5:1",
      "actualValue": "1.3:1",
      "gap": "需要提升3.2倍对比度才能达标"
    },
    "affectedUsers": [
      "色弱或色盲用户（约8%的男性用户）",
      "老年用户（视力下降）",
      "在强光环境下使用的移动用户",
      "使用低质量或老旧显示器的用户"
    ],
    "businessImpact": {
      "severity": "中等",
      "description": "用户可能不清楚按钮为何不可点击，影响表单填写体验",
      "metrics": "可能导致表单放弃率增加"
    },
    "reproducibility": {
      "frequency": "100%",
      "browser": "所有浏览器",
      "steps": [
        "在任意页面创建Secondary类型的Button组件",
        "设置disabled={true}",
        "确保按钮在白色背景上渲染",
        "观察文字可见度或使用对比度检测工具"
      ]
    },
    "visualComparison": {
      "current": {
        "textColor": "#DEDEDF",
        "backgroundColor": "#FFFFFF",
        "borderColor": "#DEDEDF",
        "appearance": "文字极淡，边框也很淡"
      },
      "recommended": {
        "textColor": "#757575",
        "backgroundColor": "#FFFFFF",
        "borderColor": "#DEDEDF",
        "appearance": "文字清晰可见，保持禁用感"
      }
    },
    "references": {
      "wcagGuideline": "WCAG 2.1 Level AA - 1.4.3 对比度（最低）",
      "codeLocation": "Button.module.scss 第39行",
      "cssSelector": ".button.type-secondary:disabled",
      "tailwindClass": "disabled:tw-text-gray-400"
    }
  }')
WHERE id = 'dp-button-visual-001';