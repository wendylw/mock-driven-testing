// 基准列表项
export interface BaselineListItem {
  id: string;
  component: string;
  path: string;
  status: 'healthy' | 'outdated' | 'corrupted' | 'unstable' | 'drifting' | 'optimizable';
  usageCount: number;
}

// 基准状态详情
export interface StatusDetail {
  type: 'healthy' | 'outdated' | 'corrupted' | 'unstable' | 'drifting' | 'optimizable' | 'deleted';
  label: string;
  hasDetail: boolean;
  detailTitle?: string;
  detailMessage?: string;
}

// 基准指标
export interface BaselineMetrics {
  usageCount: number;
  lastUpdated: string;
  snapshotCount: number;
  size: number;
}

// 基准状态响应
export interface BaselineStatus {
  baselineId: string;
  component: string;
  status: string;
  statusLabel: string;
  statusDetail: StatusDetail;
  metrics: BaselineMetrics;
}

// 诊断问题
export interface DiagnosticProblem {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'performance' | 'compatibility' | 'code-quality' | 'accessibility';
  impact: string;
  affectedScenarios: string;
  reproduction: string;
  frequency: string;
  evidence: {
    type: string;
    data: any;
  };
  rootCause: {
    what: string;
    why: string;
    where: {
      file: string;
      line: number;
      code: string;
    };
  };
  quickFix?: {
    available: boolean;
    solution: string;
    confidence: number;
    estimatedTime: string;
  };
}

// 诊断结果
export interface DiagnosticResult {
  baselineId: string;
  healthScore: number;
  problems: DiagnosticProblem[];
  rootCauses: string[];
  recommendations: string[];
  evidence: any;
}

// 视觉建议
export interface VisualSuggestion {
  id: string;
  type: 'accessibility' | 'design';
  title: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  affectedElements: number;
  visualEvidence: {
    screenshotUrl: string;
    annotations: Array<{
      position: { x: number; y: number };
      issue: string;
      suggestion: string;
      oneClickFix: string;
    }>;
  };
  beforeAfter?: {
    beforeUrl: string;
    afterUrl: string;
  };
}

// 代码建议
export interface CodeSuggestion {
  id: string;
  issue: string;
  impact: string;
  reasoning: string;
  benefits: string[];
  codeDiff: {
    title: string;
    current: string;
    suggested: string;
    filePath: string;
    lineNumber: number;
  };
  autoFix: {
    available: boolean;
    confidence: number;
    estimatedTime: string;
    command?: string;
  };
}

// 交互式建议
export interface InteractiveSuggestion {
  currentTopic: string;
  initialMessage: string;
  options: Array<{
    id: string;
    text: string;
    action: string;
  }>;
}

// 渐进式学习
export interface ProgressiveLearning {
  patterns: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    confidence: number;
    examples: number;
    lastSeen: string;
  }>;
  personalizedSuggestions: Array<{
    id: string;
    title: string;
    reason: string;
    basedOnPattern: string;
    confidence: number;
    learnedFrom: {
      similarComponents: string[];
      teamPreferences: string[];
      historicalChoices: string[];
    };
  }>;
  teamInsights: Array<{
    pattern: string;
    adoption: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    recommendation: string;
  }>;
}

// 建议结果
export interface SuggestionsResult {
  visualSuggestions: VisualSuggestion[];
  codeSuggestions: CodeSuggestion[];
  interactiveSuggestions: InteractiveSuggestion;
  progressiveLearning: ProgressiveLearning;
}

// 分析结果
export interface AnalysisResult {
  id: string;
  baselineId: string;
  timestamp: string;
  status: BaselineStatus;
  diagnostic: DiagnosticResult;
  suggestions: SuggestionsResult;
  duration: number;
}

// 交互响应
export interface InteractionResponse {
  nextMessage: string;
  visualDemo?: string;
  implementationOptions?: Array<{
    title: string;
    effort: string;
    impact: string;
  }>;
  nextOptions?: Array<{
    id: string;
    text: string;
    action: string;
  }>;
  progress?: {
    steps: Array<{
      name: string;
      status: 'pending' | 'in_progress' | 'completed';
    }>;
  };
  preview?: {
    before: string;
    after: string;
    improvements: string[];
  };
  changes?: {
    filesModified: number;
    linesChanged: number;
    testsPassed: boolean;
  };
  nextSteps?: string[];
  customizationOptions?: {
    animationType: string[];
    position: string[];
    showText: string[];
  };
  examples?: Array<{
    company: string;
    approach: string;
    preview: string;
  }>;
}