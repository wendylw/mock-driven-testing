import { DatabaseService } from './database.service';
import { RedisService } from './redis.service';
import { VisualSuggestionEngine } from '../analyzers/visual-suggestion.engine';
import { CodeSuggestionEngine } from '../analyzers/code-suggestion.engine';
import { InteractiveEngine } from '../analyzers/interactive.engine';
import { LearningEngine } from '../analyzers/learning.engine';
import { logger } from '../utils/logger';
import { SuggestionsResult } from '../models/suggestion.model';

export class SuggestionService {
  private static CACHE_TTL = 30 * 60; // 30 minutes
  private visualSuggestionEngine: VisualSuggestionEngine;
  private codeSuggestionEngine: CodeSuggestionEngine;
  private interactiveEngine: InteractiveEngine;
  private learningEngine: LearningEngine;
  
  constructor() {
    this.visualSuggestionEngine = new VisualSuggestionEngine();
    this.codeSuggestionEngine = new CodeSuggestionEngine();
    this.interactiveEngine = new InteractiveEngine();
    this.learningEngine = new LearningEngine();
  }

  async getSuggestions(baselineId: string): Promise<SuggestionsResult> {
    // Check cache first
    const cacheKey = `suggestions:${baselineId}`;
    const cached = await RedisService.getJSON<SuggestionsResult>(cacheKey);
    if (cached) {
      logger.info(`Cache hit for suggestions: ${baselineId}`);
      return cached;
    }

    try {
      // 并行生成所有建议
      const [
        visualSuggestions,
        codeSuggestions,
        interactiveSuggestions,
        progressiveLearning
      ] = await Promise.all([
        this.visualSuggestionEngine.generate(baselineId),
        this.codeSuggestionEngine.generate(baselineId),
        this.interactiveEngine.getInitialState(baselineId),
        this.learningEngine.getLearningData(baselineId)
      ]);

      const result: SuggestionsResult = {
        visualSuggestions,
        codeSuggestions,
        interactiveSuggestions,
        progressiveLearning
      };

      // Cache the result
      await RedisService.setJSON(cacheKey, result, SuggestionService.CACHE_TTL);
      
      // Store in database for persistence
      await this.storeSuggestionResult(baselineId, result);

      return result;
    } catch (error) {
      logger.error('Suggestion generation error:', error);
      throw error;
    }
  }

  async handleInteraction(baselineId: string, sessionId: string, action: string, context: any): Promise<any> {
    try {
      const response = await this.interactiveEngine.processInteraction({
        baselineId,
        sessionId,
        action,
        context
      });
      
      // 记录用户交互用于学习
      await this.learningEngine.recordUserChoice('user-001', {
        baselineId,
        action,
        timestamp: new Date()
      });
      
      return response;
    } catch (error) {
      logger.error('Interaction handling error:', error);
      throw error;
    }
  }

  private async storeSuggestionResult(baselineId: string, result: SuggestionsResult) {
    try {
      const analysisId = `suggest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await DatabaseService.query(
        'INSERT INTO analysis_results (id, baseline_id, analysis_type, result_data) VALUES (?, ?, ?, ?)',
        [analysisId, baselineId, 'suggestions', JSON.stringify(result)]
      );
      
      // 存储每个建议到suggestions表
      for (const visual of result.visualSuggestions) {
        await this.storeSuggestion(baselineId, 'visual', visual);
      }
      
      for (const code of result.codeSuggestions) {
        await this.storeSuggestion(baselineId, 'code', code);
      }
      
      logger.info(`Suggestions stored for baseline: ${baselineId}`);
    } catch (error) {
      logger.error('Failed to store suggestion result:', error);
      // Don't throw - this is not critical for the API response
    }
  }

  private async storeSuggestion(baselineId: string, type: string, content: any) {
    const id = `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await DatabaseService.query(
      'INSERT INTO suggestions (id, baseline_id, suggestion_type, content) VALUES (?, ?, ?, ?)',
      [id, baselineId, type, JSON.stringify(content)]
    );
  }

  async invalidateCache(baselineId: string): Promise<void> {
    const cacheKey = `suggestions:${baselineId}`;
    await RedisService.del(cacheKey);
    logger.info(`Suggestions cache invalidated for baseline: ${baselineId}`);
  }

  async applySuggestion(suggestionId: string): Promise<void> {
    await DatabaseService.query(
      'UPDATE suggestions SET applied = 1, applied_at = CURRENT_TIMESTAMP WHERE id = ?',
      [suggestionId]
    );
    
    logger.info(`Suggestion applied: ${suggestionId}`);
  }
}