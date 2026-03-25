import { logger } from '../utils/logger';
import { InteractiveSuggestion } from '../models/suggestion.model';
import { BaselineRecord } from '../models/baseline.model';

export class InteractiveEngine {
  private conversationStore = new Map<string, any>();

  async getInitialState(baselineId: string): Promise<InteractiveSuggestion> {
    // 根据基准ID获取组件信息来决定初始话题
    const topic = this.getInitialTopic(baselineId);
    
    return {
      currentTopic: topic.name,
      initialMessage: topic.message,
      options: topic.options
    };
  }

  async processInteraction({ baselineId, sessionId, action, context }: any): Promise<any> {
    // 获取或创建会话
    const session = this.conversationStore.get(sessionId) || {
      id: sessionId,
      baselineId,
      history: []
    };
    
    // 根据action生成响应
    let response;
    switch (action) {
      case 'show_detailed_suggestion':
        response = await this.generateDetailedSuggestion(baselineId, context);
        break;
      case 'show_best_practices':
        response = await this.fetchBestPractices(context.currentTopic);
        break;
      case 'auto_optimize':
        response = await this.generateAutoOptimization(baselineId);
        break;
      case 'apply_quick_fix':
        response = await this.applyQuickFix(baselineId, context);
        break;
      case 'customize_loading':
        response = await this.customizeLoading(baselineId);
        break;
      default:
        response = await this.generateDefaultResponse();
    }
    
    // 更新会话历史
    session.history.push({ action, response, timestamp: new Date() });
    this.conversationStore.set(sessionId, session);
    
    return response;
  }

  private getInitialTopic(baselineId: string) {
    // 根据组件类型返回不同的初始话题
    if (baselineId.includes('button')) {
      return {
        name: 'loading状态优化',
        message: '检测到Button组件的loading状态可能有更好的用户体验方案',
        options: [
          {
            id: 'show-suggestion',
            text: '显示具体建议',
            action: 'show_detailed_suggestion'
          },
          {
            id: 'show-best-practices',
            text: '查看其他项目的最佳实践',
            action: 'show_best_practices'
          },
          {
            id: 'auto-optimize',
            text: '自动优化并预览效果',
            action: 'auto_optimize'
          }
        ]
      };
    } else if (baselineId.includes('modal')) {
      return {
        name: '可访问性改进',
        message: '发现Modal组件存在可访问性问题，影响屏幕阅读器用户',
        options: [
          {
            id: 'show-a11y-issues',
            text: '查看具体问题',
            action: 'show_detailed_suggestion'
          },
          {
            id: 'auto-fix-a11y',
            text: '自动修复可访问性问题',
            action: 'auto_optimize'
          },
          {
            id: 'learn-a11y',
            text: '了解可访问性最佳实践',
            action: 'show_best_practices'
          }
        ]
      };
    }
    
    // 默认话题
    return {
      name: '组件优化建议',
      message: '我可以帮你分析和优化这个组件',
      options: [
        {
          id: 'analyze-performance',
          text: '分析性能问题',
          action: 'show_detailed_suggestion'
        },
        {
          id: 'check-best-practices',
          text: '检查最佳实践',
          action: 'show_best_practices'
        }
      ]
    };
  }

  private async generateDetailedSuggestion(baselineId: string, context: any) {
    return {
      nextMessage: "基于用户体验研究，建议loading状态显示进度而不是spinner",
      visualDemo: `/api/demos/loading-comparison.gif`,
      implementationOptions: [
        {
          title: "快速修复：使用内置进度组件",
          effort: "5分钟",
          impact: "用户体验提升20%"
        },
        {
          title: "自定义方案：制作品牌化loading动画",
          effort: "30分钟",
          impact: "品牌一致性+用户体验双重提升"
        }
      ],
      nextOptions: [
        {
          id: "apply-quick-fix",
          text: "应用快速修复",
          action: "apply_quick_fix"
        },
        {
          id: "customize-more",
          text: "我想进一步定制",
          action: "customize_loading"
        }
      ]
    };
  }

  private async fetchBestPractices(topic: string) {
    const practices: Record<string, any> = {
      'loading状态优化': {
        nextMessage: "以下是业界loading状态的最佳实践",
        examples: [
          {
            company: "Ant Design",
            approach: "使用Progress组件显示具体进度",
            preview: "/api/demos/antd-loading.gif"
          },
          {
            company: "Material UI",
            approach: "骨架屏预加载内容结构",
            preview: "/api/demos/mui-skeleton.gif"
          }
        ],
        nextOptions: [
          {
            id: "use-antd-style",
            text: "使用Ant Design风格",
            action: "apply_antd_style"
          },
          {
            id: "use-skeleton",
            text: "使用骨架屏方案",
            action: "apply_skeleton"
          }
        ]
      }
    };

    return practices[topic] || {
      nextMessage: "暂无相关最佳实践",
      nextOptions: [{
        id: "back",
        text: "返回",
        action: "back_to_main"
      }]
    };
  }

  private async generateAutoOptimization(baselineId: string) {
    return {
      nextMessage: "正在自动优化组件...",
      progress: {
        steps: [
          { name: "分析当前实现", status: "completed" },
          { name: "生成优化代码", status: "completed" },
          { name: "创建预览", status: "in_progress" },
          { name: "准备应用", status: "pending" }
        ]
      },
      preview: {
        before: `/api/preview/${baselineId}/before`,
        after: `/api/preview/${baselineId}/after`,
        improvements: [
          "加载时显示进度百分比",
          "添加了取消操作支持",
          "优化了动画流畅度"
        ]
      },
      nextOptions: [
        {
          id: "apply-changes",
          text: "应用这些改动",
          action: "confirm_apply"
        },
        {
          id: "modify",
          text: "调整优化方案",
          action: "modify_optimization"
        }
      ]
    };
  }

  private async applyQuickFix(baselineId: string, context: any) {
    return {
      nextMessage: "快速修复已应用成功！",
      changes: {
        filesModified: 1,
        linesChanged: 15,
        testsPassed: true
      },
      nextSteps: [
        "代码已自动格式化",
        "相关测试已更新",
        "请检查本地更改"
      ],
      nextOptions: [
        {
          id: "view-diff",
          text: "查看具体改动",
          action: "show_diff"
        },
        {
          id: "run-tests",
          text: "运行测试",
          action: "run_tests"
        },
        {
          id: "done",
          text: "完成",
          action: "close_session"
        }
      ]
    };
  }

  private async customizeLoading(baselineId: string) {
    return {
      nextMessage: "让我们一起定制你的loading状态",
      customizationOptions: {
        animationType: ["进度条", "骨架屏", "脉冲动画", "自定义SVG"],
        position: ["按钮内", "覆盖整个按钮", "按钮上方"],
        showText: ["显示百分比", "显示剩余时间", "显示步骤", "仅动画"]
      },
      nextOptions: [
        {
          id: "choose-progress",
          text: "我想要进度条",
          action: "customize_progress_bar"
        },
        {
          id: "choose-skeleton",
          text: "我想要骨架屏",
          action: "customize_skeleton"
        },
        {
          id: "upload-custom",
          text: "上传自定义动画",
          action: "upload_custom_animation"
        }
      ]
    };
  }

  private async generateDefaultResponse() {
    return {
      nextMessage: "我可以帮你做什么？",
      nextOptions: [
        {
          id: "back",
          text: "返回主菜单",
          action: "back_to_main"
        }
      ]
    };
  }
}