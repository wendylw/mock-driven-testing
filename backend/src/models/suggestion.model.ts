// 可视化建议
export interface VisualSuggestion {
  id: string;
  type: 'accessibility' | 'design' | 'consistency';
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
      oneClickFix?: string;
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
    trend: 'increasing' | 'stable' | 'decreasing';
    recommendation: string;
  }>;
}

export interface SuggestionsResult {
  visualSuggestions: VisualSuggestion[];
  codeSuggestions: CodeSuggestion[];
  interactiveSuggestions: InteractiveSuggestion;
  progressiveLearning: ProgressiveLearning;
}