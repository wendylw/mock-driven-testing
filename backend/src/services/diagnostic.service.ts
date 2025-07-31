import { DatabaseService } from './database.service';
import { RedisService } from './redis.service';
import { PerformanceAnalyzer } from '../analyzers/performance.analyzer';
import { AccessibilityAnalyzer } from '../analyzers/accessibility.analyzer';
import { CodeQualityAnalyzer } from '../analyzers/code-quality.analyzer';
import { logger } from '../utils/logger';
import { 
  DiagnosticProblem, 
  DiagnosticResult,
  DiagnosticSummary,
  Severity,
  ProblemCategory 
} from '../models/diagnostic.model';

export class DiagnosticService {
  private static CACHE_TTL = 30 * 60; // 30 minutes
  private performanceAnalyzer: PerformanceAnalyzer;
  private accessibilityAnalyzer: AccessibilityAnalyzer;
  private codeQualityAnalyzer: CodeQualityAnalyzer;

  constructor() {
    this.performanceAnalyzer = new PerformanceAnalyzer();
    this.accessibilityAnalyzer = new AccessibilityAnalyzer();
    this.codeQualityAnalyzer = new CodeQualityAnalyzer();
  }

  async getDiagnostic(baselineId: string): Promise<DiagnosticResult> {
    // Check cache first
    const cacheKey = `diagnostic:${baselineId}`;
    const cached = await RedisService.getJSON<DiagnosticResult>(cacheKey);
    if (cached) {
      logger.info(`Cache hit for diagnostic: ${baselineId}`);
      return cached;
    }

    const problems: DiagnosticProblem[] = [];

    try {
      // Run all analyzers in parallel
      const [perfProblems, a11yProblems, codeProblems, dbProblems] = await Promise.all([
        this.performanceAnalyzer.analyze(baselineId),
        this.accessibilityAnalyzer.analyze(baselineId),
        this.codeQualityAnalyzer.analyze(baselineId),
        this.getStoredProblems(baselineId)
      ]);

      // Merge all problems
      problems.push(...perfProblems);
      problems.push(...a11yProblems);
      problems.push(...codeProblems);
      problems.push(...dbProblems);

      // Calculate summary
      const summary: DiagnosticSummary = {
        criticalCount: problems.filter(p => p.severity === 'critical').length,
        warningCount: problems.filter(p => p.severity === 'warning').length,
        infoCount: problems.filter(p => p.severity === 'info').length,
        fixableCount: problems.filter(p => p.quickFix?.available).length
      };

      const result: DiagnosticResult = {
        summary,
        problems: this.sortProblemsBySeverity(problems)
      };

      // Cache the result
      await RedisService.setJSON(cacheKey, result, DiagnosticService.CACHE_TTL);
      
      // Store in database for persistence
      await this.storeDiagnosticResult(baselineId, result);

      return result;
    } catch (error) {
      logger.error('Diagnostic analysis error:', error);
      throw error;
    }
  }

  private async getStoredProblems(baselineId: string): Promise<DiagnosticProblem[]> {
    const sql = `
      SELECT 
        id, severity, category, impact, affected_scenarios as affectedScenarios,
        reproduction, frequency, evidence, root_cause as rootCause, quick_fix as quickFix
      FROM diagnostic_problems 
      WHERE baseline_id = ? AND resolved_at IS NULL
    `;
    
    const rows = await DatabaseService.query<any[]>(sql, [baselineId]);
    
    return rows.map(row => ({
      id: row.id,
      severity: row.severity as Severity,
      category: row.category as ProblemCategory,
      impact: row.impact,
      affectedScenarios: row.affectedScenarios,
      reproduction: row.reproduction,
      frequency: row.frequency,
      evidence: typeof row.evidence === 'string' ? JSON.parse(row.evidence) : row.evidence,
      rootCause: typeof row.rootCause === 'string' ? JSON.parse(row.rootCause) : row.rootCause,
      quickFix: row.quickFix ? (typeof row.quickFix === 'string' ? JSON.parse(row.quickFix) : row.quickFix) : undefined
    }));
  }

  private sortProblemsBySeverity(problems: DiagnosticProblem[]): DiagnosticProblem[] {
    const severityOrder = { critical: 3, warning: 2, info: 1 };
    
    return problems.sort((a, b) => {
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      
      // If same severity, prioritize fixable problems
      const aFixable = a.quickFix?.available ? 1 : 0;
      const bFixable = b.quickFix?.available ? 1 : 0;
      return bFixable - aFixable;
    });
  }

  private async storeDiagnosticResult(baselineId: string, result: DiagnosticResult) {
    try {
      const analysisId = `diag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await DatabaseService.query(
        'INSERT INTO analysis_results (id, baseline_id, analysis_type, result_data) VALUES (?, ?, ?, ?)',
        [analysisId, baselineId, 'diagnostic', JSON.stringify(result)]
      );
      
      logger.info(`Diagnostic result stored for baseline: ${baselineId}`);
    } catch (error) {
      logger.error('Failed to store diagnostic result:', error);
      // Don't throw - this is not critical for the API response
    }
  }

  async invalidateCache(baselineId: string): Promise<void> {
    const cacheKey = `diagnostic:${baselineId}`;
    await RedisService.del(cacheKey);
    logger.info(`Diagnostic cache invalidated for baseline: ${baselineId}`);
  }

  async resolveProblem(problemId: string): Promise<void> {
    await DatabaseService.query(
      'UPDATE diagnostic_problems SET resolved_at = NOW() WHERE id = ?',
      [problemId]
    );
    
    logger.info(`Problem resolved: ${problemId}`);
  }
}