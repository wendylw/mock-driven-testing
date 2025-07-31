import { DatabaseService } from '../services/database.service';
import { logger } from '../utils/logger';
import { CodeSuggestion } from '../models/suggestion.model';
import { BaselineRecord } from '../models/baseline.model';

export class CodeSuggestionEngine {
  async generate(baselineId: string): Promise<CodeSuggestion[]> {
    const suggestions: CodeSuggestion[] = [];
    
    try {
      const baseline = await this.getBaseline(baselineId);
      if (!baseline) {
        logger.warn(`Baseline not found for code suggestions: ${baselineId}`);
        return suggestions;
      }

      // React.memo优化建议
      if (this.shouldSuggestReactMemo(baseline)) {
        suggestions.push({
          id: `code-${baselineId}-memo`,
          issue: `${baseline.component_name}组件重复渲染`,
          impact: baseline.usage_count > 20 ? '性能降低40%' : '性能降低15%',
          reasoning: '当前组件在父组件重渲染时会无条件重渲染',
          benefits: [
            `渲染性能提升${baseline.usage_count > 20 ? '40' : '15'}%`,
            `重渲染次数减少${baseline.usage_count > 20 ? '80' : '60'}%`,
            '降低CPU使用率',
            '改善用户体验'
          ],
          codeDiff: {
            title: '添加React.memo优化',
            current: `export const ${baseline.component_name} = ({type, children, onClick}) => {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  );
};`,
            suggested: `export const ${baseline.component_name} = React.memo(({type, children, onClick}) => {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  );
});`,
            filePath: baseline.component_path,
            lineNumber: 12
          },
          autoFix: {
            available: true,
            confidence: 95,
            estimatedTime: '30秒',
            command: `apply-react-memo-${baselineId}`
          }
        });
      }

      // Props类型优化
      if (baseline.props_variations && baseline.props_variations > 5) {
        suggestions.push({
          id: `code-${baselineId}-types`,
          issue: 'Props缺少严格的TypeScript类型定义',
          impact: '类型安全性降低，易产生运行时错误',
          reasoning: '使用了过于宽松的类型定义，无法在编译时捕获错误',
          benefits: [
            '编译时类型检查',
            '更好的IDE智能提示',
            '减少运行时错误',
            '提高代码可维护性'
          ],
          codeDiff: {
            title: '添加严格的TypeScript类型',
            current: `interface ${baseline.component_name}Props {
  type?: any;
  children?: any;
  onClick?: any;
}`,
            suggested: `interface ${baseline.component_name}Props {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}`,
            filePath: baseline.component_path,
            lineNumber: 5
          },
          autoFix: {
            available: true,
            confidence: 90,
            estimatedTime: '1分钟',
            command: `add-strict-types-${baselineId}`
          }
        });
      }

      // 组件拆分建议（针对复杂组件）
      if (baseline.component_name === 'CreateOrderButton' || (baseline.file_size && baseline.file_size > 10)) {
        suggestions.push({
          id: `code-${baselineId}-split`,
          issue: '组件过于复杂，职责不单一',
          impact: '维护困难，测试复杂度高',
          reasoning: '组件包含过多业务逻辑和状态管理，违反单一职责原则',
          benefits: [
            '提高代码可读性',
            '便于单元测试',
            '提高组件复用性',
            '降低耦合度'
          ],
          codeDiff: {
            title: '拆分业务逻辑到自定义Hook',
            current: `export const ${baseline.component_name} = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 大量业务逻辑...
  const handleClick = async () => {
    // 复杂的处理逻辑...
  };
  return <button onClick={handleClick}>创建订单</button>;
};`,
            suggested: `// useCreateOrder.ts
export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const createOrder = async () => {
    // 业务逻辑移到这里
  };
  return { createOrder, loading, error };
};

// ${baseline.component_name}.tsx
export const ${baseline.component_name} = () => {
  const { createOrder, loading } = useCreateOrder();
  return <button onClick={createOrder} disabled={loading}>创建订单</button>;
};`,
            filePath: baseline.component_path,
            lineNumber: 1
          },
          autoFix: {
            available: false,
            confidence: 70,
            estimatedTime: '30分钟',
            command: `refactor-split-${baselineId}`
          }
        });
      }

      // 错误边界建议
      if (baseline.usage_count > 15) {
        suggestions.push({
          id: `code-${baselineId}-error-boundary`,
          issue: '缺少错误处理机制',
          impact: '组件错误会导致整个应用崩溃',
          reasoning: '高频使用的组件应该有错误边界保护',
          benefits: [
            '提高应用稳定性',
            '改善错误体验',
            '便于错误追踪',
            '防止白屏'
          ],
          codeDiff: {
            title: '添加错误边界',
            current: `<${baseline.component_name} />`,
            suggested: `<ErrorBoundary fallback={<ButtonErrorFallback />}>
  <${baseline.component_name} />
</ErrorBoundary>`,
            filePath: 'src/App.tsx',
            lineNumber: 45
          },
          autoFix: {
            available: true,
            confidence: 85,
            estimatedTime: '5分钟'
          }
        });
      }

    } catch (error) {
      logger.error('Code suggestion generation error:', error);
    }

    return suggestions;
  }

  private async getBaseline(baselineId: string): Promise<BaselineRecord | null> {
    const sql = 'SELECT * FROM baselines WHERE id = ?';
    const rows = await DatabaseService.query<BaselineRecord[]>(sql, [baselineId]);
    return rows.length > 0 ? rows[0] : null;
  }

  private shouldSuggestReactMemo(baseline: BaselineRecord): boolean {
    return (baseline.props_variations || 0) > 3 && baseline.usage_count > 5;
  }
}