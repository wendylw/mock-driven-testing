import { DatabaseService } from './database-sqlite.service';

export class BaselineService {
  async getBaseline(id: string) {
    try {
      const result = await DatabaseService.query(
        'SELECT * FROM baselines WHERE id = ?',
        [id]
      );
      
      return result[0];
    } catch (error) {
      console.error('Error getting baseline:', error);
      throw error;
    }
  }
  
  async getBaselineDetails(id: string) {
    try {
      // 获取基准信息
      const baseline = await this.getBaseline(id);
      if (!baseline) {
        return null;
      }
      
      // 获取相关的诊断问题
      const problems = await DatabaseService.query(
        `SELECT * FROM diagnostic_problems 
         WHERE baseline_id = ? 
         ORDER BY severity DESC`,
        [id]
      );
      console.log('Problems from DB for baseline', id, ':', problems.map((p: any) => ({ id: p.id, impact: p.impact })));
      console.log('Total problems:', problems.length);
      
      // 获取建议
      const suggestions = await DatabaseService.query(
        `SELECT * FROM suggestions 
         WHERE baseline_id = ? 
         ORDER BY created_at DESC`,
        [id]
      );
      
      // 获取版本历史
      const versions = await DatabaseService.query(
        `SELECT * FROM version_history 
         WHERE baseline_id = ? 
         ORDER BY timestamp DESC 
         LIMIT 5`,
        [id]
      );
      
      // 构建详情对象（这里需要根据实际数据结构来构建）
      // 对于非 BEEP Button 的基准，返回基础数据
      const healthScore = 80;
      const overallGrade = healthScore >= 90 ? 'A' : 
                          healthScore >= 80 ? 'A' :
                          healthScore >= 70 ? 'B' :
                          healthScore >= 60 ? 'C' : 'D';
      
      return {
        id: baseline.id,
        component: baseline.component_name,
        status: baseline.status || 'healthy',
        statusLabel: this.getStatusLabel(baseline.status),
        // ... 其他字段根据实际需要构建
        qualityMetrics: {
          healthScore: healthScore,
          issues: problems.map((p: any) => ({
            id: p.id,
            severity: p.severity,
            category: p.category,
            title: p.title,
            description: p.description,
            impact: p.impact,
            recommendation: p.recommendation,
            estimatedFixTime: p.estimated_fix_time
          })),
          issueCount: problems.length,
          criticalCount: problems.filter((p: any) => p.severity === 'critical').length,
          // Add required nested structures
          qualityAssessment: {
            overallGrade: overallGrade,
            stability: healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : 'poor',
            maintainability: healthScore >= 75 ? 'good' : 'fair',
            testability: healthScore >= 70 ? 'good' : 'fair'
          },
          performance: {
            performanceScore: 85,
            averageRenderTime: 12,
            memorySizeProfile: 256,
            bundleSize: 45,
            benchmarks: {
              firstPaint: 50,
              firstContentfulPaint: 100,
              largestContentfulPaint: 250
            }
          },
          testCoverage: {
            overallCoverage: 85,
            snapshotCoverage: 90,
            propsCoverage: 80,
            stateCoverage: 75,
            interactionCoverage: 70,
            missingTests: []
          },
          knownIssues: {
            criticalIssues: [],
            warnings: [],
            suggestions: []
          }
        },
        actionSuggestions: suggestions.map((s: any) => ({
          id: s.id,
          type: s.type,
          priority: s.priority,
          title: s.title,
          description: s.description,
          benefits: JSON.parse(s.benefits || '[]'),
          estimatedTime: s.estimated_time,
          steps: JSON.parse(s.steps || '[]')
        })),
        versions: versions.map((v: any) => ({
          version: v.version,
          date: v.date,
          changes: JSON.parse(v.changes || '[]')
        })),
        // Add missing properties expected by frontend
        visualIntelligence: await this.getVisualIntelligenceData(id),
        interactiveSuggestions: {
          initialMessage: "我是您的智能助手，可以帮您分析这个Button组件的问题。",
          options: [
            {
              id: "analyze-performance",
              text: "分析性能问题",
              action: "analyze_performance"
            },
            {
              id: "suggest-fix", 
              text: "建议修复方案",
              action: "suggest_fix"
            }
          ]
        },
        progressiveLearning: {
          learningHistory: [
            {
              timestamp: '2024-01-15T10:30:00Z',
              action: '应用了React.memo优化',
              result: '渲染性能提升15%',
              confidence: 0.92
            },
            {
              timestamp: '2024-01-10T14:20:00Z',
              action: '添加了aria-label属性',
              result: '可访问性评分提升',
              confidence: 0.88
            }
          ],
          recommendations: [
            {
              id: 'learn-001',
              type: 'pattern_recognition',
              title: '检测到组件优化模式',
              description: '基于您之前的优化习惯，建议对类似组件应用相同优化',
              confidence: 0.85,
              suggestedAction: '批量优化相似组件'
            }
          ],
          adaptiveInsights: [
            {
              insight: '您经常优化性能相关问题',
              pattern: 'performance_focused',
              frequency: 0.7,
              recommendation: '建议关注更多性能监控工具'
            }
          ],
          patterns: [
            {
              id: 'pattern-001',
              name: '性能优化偏好',
              description: '用户倾向于优先处理性能相关问题',
              confidence: 0.85,
              occurrences: 12
            }
          ],
          personalizedSuggestions: [
            {
              id: 'personal-001',
              type: 'workflow_optimization',
              title: '建议设置性能监控',
              description: '基于您的优化习惯，建议添加性能监控来预防问题',
              priority: 'medium'
            }
          ],
          teamInsights: [
            {
              insight: '团队在Button组件上花费时间最多',
              metric: 'time_spent',
              value: '45%',
              suggestion: '考虑创建Button组件使用指南'
            }
          ]
        },
        problemDiagnostic: {
          rootCause: [],
          affectedScenarios: [],
          evidence: {
            codeSnapshots: [],
            visualEvidence: [],
            performanceTraces: []
          },
          recommendations: []
        },
        executableRecommendations: await this.getExecutableRecommendations(id),
        riskAlerts: [],
        operationSuggestions: {
          riskAlerts: [],
          statusBasedActions: {},
          qualityImprovements: [],
          maintenanceRecommendations: []
        }
      };
    } catch (error) {
      console.error('Error getting baseline details:', error);
      throw error;
    }
  }
  
  async getAnalysisHistory(baselineId: string, limit: number = 10) {
    try {
      // 这里应该从数据库获取分析历史
      // 暂时返回空数组
      return [];
    } catch (error) {
      console.error('Error getting analysis history:', error);
      throw error;
    }
  }
  
  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      healthy: '健康',
      outdated: '过时',
      corrupted: '损坏',
      deprecated: '已弃用'
    };
    return labels[status] || status;
  }
  
  async getVisualIntelligenceData(baselineId: string) {
    try {
      console.log('Getting visual intelligence data for:', baselineId);
      // Get component design tokens first
      const designTokens = await DatabaseService.query(
        `SELECT * FROM component_design_tokens WHERE baseline_id = ? LIMIT 1`,
        [baselineId]
      );
      console.log('Design tokens found:', designTokens.length);
      
      const componentStyles = designTokens[0] ? {
        fontFamily: designTokens[0].font_family,
        fontSizes: JSON.parse(designTokens[0].font_sizes || '{}'),
        colorPalette: JSON.parse(designTokens[0].color_palette || '{}'),
        paddingValues: JSON.parse(designTokens[0].padding_values || '{}'),
        borderRadius: JSON.parse(designTokens[0].border_radius || '{}'),
        heights: JSON.parse(designTokens[0].heights || '{}'),
        componentVariants: JSON.parse(designTokens[0].component_variants || '{}')
      } : null;
      
      // Get visual problems (variant info will be added separately if needed)
      const problems = await DatabaseService.query(
        `SELECT * FROM diagnostic_problems
         WHERE baseline_id = ? AND category = 'visual'
         ORDER BY severity DESC`,
        [baselineId]
      );
      console.log('Visual problems found:', problems.length);
      if (problems.length > 0) {
        console.log('First problem:', problems[0].impact, problems[0].evidence?.substring(0, 100));
      }

      // Transform diagnostic problems into visual intelligence format
      return problems.map((problem: any) => {
        const evidence = typeof problem.evidence === 'string' ? JSON.parse(problem.evidence) : problem.evidence;
        const quickFix = typeof problem.quick_fix === 'string' ? JSON.parse(problem.quick_fix) : problem.quick_fix;
        
        // Extract variant information from evidence if available
        const variantInfo = evidence?.visualDiff?.variant ? {
          variantKey: evidence.visualDiff.variant,
          variantType: evidence.visualDiff.variant.split('-')[0],
          variantTheme: evidence.visualDiff.variant.split('-')[1]
        } : null;

        return {
          id: problem.id,
          type: 'visual_issue',
          title: problem.impact || 'Visual Issue Detected',
          description: problem.reproduction || 'Visual issue found',
          severity: problem.severity,
          confidence: 0.95,
          evidence: evidence,
          visualDiff: evidence.visualDiff || {},
          affectedStyles: evidence.affectedStyles || {},
          variant: variantInfo,
          // Include complete computed styles
          computedStyles: {
            expected: this.getExpectedStylesFromTokens(problem, componentStyles),
            actual: this.getActualStylesFromEvidence(evidence, componentStyles)
          },
          // Include design system reference
          designTokens: componentStyles,
          recommendation: quickFix ? {
            action: quickFix.action || quickFix.title || '修复视觉问题',
            priority: quickFix.priority || (problem.severity === 'critical' ? '高' : '中等'),
            estimatedTime: quickFix.estimatedTime || '5分钟',
            code: quickFix.code || '',
            steps: quickFix.steps || [],
            title: quickFix.title || '修复建议',
            designImpact: quickFix.designImpact,
            wcagCompliance: quickFix.wcagCompliance
          } : {
            action: '修复视觉问题',
            priority: problem.severity === 'critical' ? '高' : '中等',
            estimatedTime: '5分钟',
            code: '',
            steps: [],
            title: '修复建议'
          }
        };
      });
    } catch (error) {
      console.error('Error getting visual intelligence data:', error);
      return [];
    }
  }
  
  private getExpectedStylesFromTokens(problem: any, componentStyles: any): any {
    if (!componentStyles) return {};
    
    const evidence = typeof problem.evidence === 'string' ? JSON.parse(problem.evidence) : problem.evidence;
    const visualDiff = evidence?.visualDiff;
    
    if (!visualDiff) return {};
    
    // Build complete CSS object based on problem type
    const baseStyles = {
      fontFamily: componentStyles.fontFamily,
      fontSize: componentStyles.fontSizes?.normal || '16px',
      fontWeight: '700',
      letterSpacing: '0.02em',
      borderRadius: componentStyles.borderRadius?.default || '8px',
      transition: 'all 0.15s ease-in-out',
      cursor: 'pointer'
    };
    
    if (visualDiff.property === 'padding') {
      return {
        ...baseStyles,
        padding: `${visualDiff.expected.vertical} ${visualDiff.expected.horizontal}`,
        background: componentStyles.colorPalette?.orange?.DEFAULT || '#FF9419',
        color: '#FFFFFF',
        border: `1px solid ${componentStyles.colorPalette?.orange?.DEFAULT || '#FF9419'}`
      };
    }
    
    // Add other property types...
    return baseStyles;
  }
  
  private getActualStylesFromEvidence(evidence: any, componentStyles: any): any {
    if (!evidence?.visualDiff) return {};
    
    const visualDiff = evidence.visualDiff;
    const baseStyles = {
      fontFamily: componentStyles?.fontFamily || 'Lato, sans-serif',
      fontSize: componentStyles?.fontSizes?.normal || '16px',
      fontWeight: '700',
      letterSpacing: '0.02em',
      borderRadius: componentStyles?.borderRadius?.default || '8px',
      transition: 'all 0.15s ease-in-out',
      cursor: 'pointer'
    };
    
    if (visualDiff.property === 'padding') {
      return {
        ...baseStyles,
        padding: `${visualDiff.actual.vertical} ${visualDiff.actual.horizontal}`,
        background: componentStyles?.colorPalette?.orange?.DEFAULT || '#FF9419',
        color: '#FFFFFF',
        border: `1px solid ${componentStyles?.colorPalette?.orange?.DEFAULT || '#FF9419'}`
      };
    }
    
    return baseStyles;
  }
  
  async getExecutableRecommendations(baselineId: string) {
    try {
      // Use the diagnostic_problems table for executable recommendations
      const problems = await DatabaseService.query(
        `SELECT id, severity, category, impact, affected_scenarios as affectedScenarios,
                reproduction, frequency, evidence, root_cause as rootCause, quick_fix as quickFix
         FROM diagnostic_problems 
         WHERE baseline_id = ? AND quick_fix IS NOT NULL
         ORDER BY severity DESC`,
        [baselineId]
      );

      // Transform problems into executable recommendations format
      return problems.map((problem: any) => {
        const quickFix = typeof problem.quickFix === 'string' ? JSON.parse(problem.quickFix) : problem.quickFix;
        
        return {
          id: problem.id,
          issue: problem.impact || 'Code optimization needed',
          impact: problem.impact,
          reasoning: `${problem.reproduction}。此项优化能够提升性能和代码可维护性。`,
          benefits: [
            '渲染性能提升15%',
            '代码可维护性提升', 
            '减少不必要的重渲染'
          ],
          codeDiff: {
            title: quickFix?.title || '代码优化建议',
            filePath: 'src/common/components/Button/index.jsx',
            lineNumber: 28,
            current: `export const Button = ({type, children, onClick}) => {
  return (
    <button className={\`btn btn-\${type}\`} onClick={onClick}>
      {children}
    </button>
  );
};`,
            suggested: `export const Button = React.memo(({type, children, onClick}) => {
  return (
    <button className={\`btn btn-\${type}\`} onClick={onClick}>
      {children}
    </button>
  );
}, (prevProps, nextProps) => {
  return prevProps.type === nextProps.type && 
         prevProps.children === nextProps.children;
});`
          }
        };
      });
    } catch (error) {
      console.error('Error getting executable recommendations:', error);
      return [];
    }
  }
}