-- Update evidence structure to use natural language descriptions

-- Update Secondary button disabled state contrast issue
UPDATE diagnostic_problems SET 
  evidence = JSON('{
    "description": "在测试Secondary类型按钮的禁用状态时，发现文字颜色与背景色的对比度不符合无障碍标准",
    "context": {
      "component": "Button组件",
      "variant": "type=secondary, state=disabled",
      "testScenario": "禁用表单提交按钮时的视觉效果检查"
    },
    "preconditions": [
      "按钮类型设置为secondary",
      "按钮状态为disabled",
      "背景色为白色(#FFFFFF)"
    ],
    "observations": {
      "visual": "禁用状态下的灰色文字在白色背景上难以辨识",
      "technical": "使用了tw-text-gray-400类，生成的颜色值为#DEDEDF",
      "measurement": "对比度计算结果为1.3:1，远低于WCAG AA标准要求的4.5:1"
    },
    "affectedUsers": [
      "视力较弱的用户",
      "在强光环境下使用的用户",
      "使用低质量显示器的用户"
    ],
    "reproducibility": {
      "frequency": "100%",
      "steps": [
        "创建一个Secondary类型的Button组件",
        "设置disabled属性为true",
        "在白色背景上查看按钮",
        "使用对比度检测工具测量文字与背景的对比度"
      ]
    },
    "references": {
      "wcagGuideline": "WCAG 2.1 Success Criterion 1.4.3 (Contrast Minimum)",
      "codeLocation": "Button.module.scss第39行",
      "cssSelector": ".type-secondary:disabled"
    }
  }'),
  reproduction = 'Secondary按钮在禁用状态下，文字颜色(#DEDEDF)与白色背景的对比度仅为1.3:1，难以辨识。这种情况在表单提交按钮被禁用时尤其明显，影响用户理解按钮当前状态。'
WHERE id = 'dp-button-visual-001';

-- Update accessibility issue
UPDATE diagnostic_problems SET
  evidence = JSON('{
    "description": "在对Button组件进行无障碍测试时，发现部分按钮实例缺少必要的描述信息，导致屏幕阅读器无法正确传达按钮用途",
    "context": {
      "component": "Button组件",
      "usagePattern": "仅包含图标的按钮",
      "affectedInstances": "购物车添加按钮、收藏按钮、删除按钮等"
    },
    "preconditions": [
      "按钮仅包含图标元素，没有文字内容",
      "未设置aria-label或aria-labelledby属性",
      "用户使用屏幕阅读器访问"
    ],
    "observations": {
      "screenReaderOutput": "屏幕阅读器仅读出\"button\"，没有任何功能描述",
      "userExperience": "视障用户无法理解按钮的具体用途",
      "codePattern": "<Button icon={<AddIcon />} onClick={handleAdd} />"
    },
    "affectedUsers": [
      "使用屏幕阅读器的视障用户",
      "使用键盘导航的用户",
      "认知障碍用户（需要明确的功能说明）"
    ],
    "reproducibility": {
      "frequency": "100%",
      "steps": [
        "创建一个仅包含图标的Button组件",
        "不设置aria-label属性",
        "使用屏幕阅读器（如NVDA或JAWS）访问该按钮",
        "观察屏幕阅读器的输出"
      ]
    },
    "impact": {
      "severity": "中等",
      "scope": "发现12个按钮实例存在此问题",
      "businessImpact": "可能导致视障用户无法完成关键操作，如添加商品到购物车"
    },
    "references": {
      "wcagGuideline": "WCAG 2.1 Success Criterion 4.1.2 (Name, Role, Value)",
      "bestPractice": "所有交互元素都应有可访问的名称"
    }
  }'),
  reproduction = '图标按钮缺少描述性标签，屏幕阅读器用户无法理解按钮功能。例如，购物车添加按钮仅读出"button"而不是"添加到购物车"。'
WHERE id = 'dp-button-002';

-- Update performance issue
UPDATE diagnostic_problems SET
  evidence = JSON('{
    "description": "在商品列表页面进行性能分析时，发现Button组件在父组件状态更新时会产生不必要的重渲染",
    "context": {
      "component": "Button组件",
      "usageScenario": "商品列表中的\"加入购物车\"按钮",
      "parentComponent": "ProductList",
      "renderCount": "每次列表滚动时，可见的20个按钮全部重渲染"
    },
    "preconditions": [
      "Button组件未使用React.memo优化",
      "父组件(ProductList)频繁更新状态",
      "列表中包含大量Button实例（通常20-50个）"
    ],
    "observations": {
      "performance": {
        "unnecessaryRenders": "滚动时触发了约70%的不必要渲染",
        "renderTime": "每个按钮平均渲染时间0.8ms，累计16ms",
        "userPerception": "在低端设备上可感知到轻微卡顿"
      },
      "technical": {
        "cause": "Button组件的props（type、children、onClick）实际未变化，但仍然重渲染",
        "pattern": "父组件更新scrollPosition状态 → 所有子组件重渲染"
      }
    },
    "measurements": {
      "tool": "React DevTools Profiler",
      "metrics": {
        "renderFrequency": "滚动1秒内平均触发15次重渲染",
        "totalTime": "累计渲染时间240ms",
        "improvement": "使用React.memo后可减少70%的渲染"
      }
    },
    "affectedScenarios": [
      "商品列表页快速滚动",
      "订单列表页加载更多",
      "搜索结果页实时筛选"
    ],
    "businessImpact": {
      "userExperience": "影响列表流畅度，特别是在移动设备上",
      "conversionRate": "可能因卡顿导致用户放弃浏览"
    }
  }'),
  reproduction = '在商品列表快速滚动时，每个商品的"加入购物车"按钮都会重渲染，即使按钮的props没有变化。使用React DevTools Profiler可以观察到大量灰色（不必要）的渲染。'
WHERE id = 'dp-button-001';