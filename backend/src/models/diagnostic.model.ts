export type Severity = 'critical' | 'warning' | 'info';
export type ProblemCategory = 'performance' | 'accessibility' | 'compatibility' | 'security' | 'ux' | 'code-quality';
export type EvidenceType = 'trace' | 'code' | 'screenshot' | 'video';

export interface Evidence {
  type: EvidenceType;
  data: any;
}

export interface RootCause {
  what: string;
  why: string;
  where?: {
    file: string;
    line: number;
    code: string;
  };
  when?: string;
}

export interface QuickFix {
  available: boolean;
  solution: string;
  confidence: number;
  estimatedTime: string;
  command?: string;
}

export interface DiagnosticProblem {
  id: string;
  severity: Severity;
  category: ProblemCategory;
  impact: string;
  affectedScenarios: string;
  reproduction: string;
  frequency: string;
  evidence: Evidence;
  rootCause: RootCause;
  quickFix?: QuickFix;
}

export interface DiagnosticSummary {
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  fixableCount: number;
}

export interface DiagnosticResult {
  summary: DiagnosticSummary;
  problems: DiagnosticProblem[];
}