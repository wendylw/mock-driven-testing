import { Request, Response, NextFunction } from 'express';
import { StatusService } from '../services/status.service';
import { DiagnosticService } from '../services/diagnostic.service';
import { SuggestionService } from '../services/suggestion.service';
import { AnalyzeService } from '../services/analyze.service';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

export class BaselineController {
  private statusService: StatusService;
  private diagnosticService: DiagnosticService;
  private suggestionService: SuggestionService;
  private analyzeService: AnalyzeService;

  constructor() {
    this.statusService = new StatusService();
    this.diagnosticService = new DiagnosticService();
    this.suggestionService = new SuggestionService();
    this.analyzeService = new AnalyzeService();
  }

  /**
   * GET /api/baselines/:id/status
   * 获取基准状态
   */
  getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: baselineId } = req.params;
      
      if (!baselineId || !baselineId.match(/^baseline-[\w-]+$/)) {
        throw new AppError('无效的基准ID格式', 400, 'INVALID_BASELINE_ID');
      }

      logger.info(`Getting status for baseline: ${baselineId}`);
      
      const status = await this.statusService.getBaselineStatus(baselineId);
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        next(new AppError('基准不存在', 404, 'BASELINE_NOT_FOUND'));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/baselines
   * 获取基准列表
   */
  getBaselines = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 暂时返回模拟数据，后续实现完整的列表查询
      const baselines = [
        {
          id: 'baseline-button-001',
          component: 'Button',
          path: 'src/common/components/Button/index.tsx',
          status: 'healthy',
          usageCount: 8
        },
        {
          id: 'baseline-createorderbutton-001',
          component: 'CreateOrderButton',
          path: 'src/business/CreateOrderButton/index.tsx',
          status: 'outdated',
          usageCount: 25
        },
        {
          id: 'baseline-modal-001',
          component: 'Modal',
          path: 'src/common/components/Modal/index.tsx',
          status: 'corrupted',
          usageCount: 15
        },
        {
          id: 'baseline-input-001',
          component: 'Input',
          path: 'src/common/components/Input/index.tsx',
          status: 'healthy',
          usageCount: 12
        }
      ];

      res.json({
        success: true,
        data: baselines,
        meta: {
          total: baselines.length,
          healthy: baselines.filter(b => b.status === 'healthy').length,
          outdated: baselines.filter(b => b.status === 'outdated').length,
          corrupted: baselines.filter(b => b.status === 'corrupted').length
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/baselines/:id/diagnostic
   * 获取问题诊断数据
   */
  getDiagnostic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: baselineId } = req.params;
      
      if (!baselineId || !baselineId.match(/^baseline-[\w-]+$/)) {
        throw new AppError('无效的基准ID格式', 400, 'INVALID_BASELINE_ID');
      }

      logger.info(`Getting diagnostic for baseline: ${baselineId}`);
      
      const diagnostic = await this.diagnosticService.getDiagnostic(baselineId);
      
      res.json({
        success: true,
        data: diagnostic
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        next(new AppError('基准不存在', 404, 'BASELINE_NOT_FOUND'));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/baselines/:id/suggestions
   * 获取智能建议
   */
  getSuggestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: baselineId } = req.params;
      
      if (!baselineId || !baselineId.match(/^baseline-[\w-]+$/)) {
        throw new AppError('无效的基准ID格式', 400, 'INVALID_BASELINE_ID');
      }

      logger.info(`Getting suggestions for baseline: ${baselineId}`);
      
      const suggestions = await this.suggestionService.getSuggestions(baselineId);
      
      res.json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        next(new AppError('基准不存在', 404, 'BASELINE_NOT_FOUND'));
      } else {
        next(error);
      }
    }
  };

  /**
   * POST /api/baselines/:id/suggestions/interact
   * 处理智能建议的交互
   */
  handleSuggestionInteraction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: baselineId } = req.params;
      const { sessionId, action, context } = req.body;
      
      if (!baselineId || !baselineId.match(/^baseline-[\w-]+$/)) {
        throw new AppError('无效的基准ID格式', 400, 'INVALID_BASELINE_ID');
      }

      if (!sessionId || !action) {
        throw new AppError('缺少必需参数', 400, 'MISSING_PARAMETERS');
      }

      logger.info(`Handling interaction for baseline: ${baselineId}, action: ${action}`);
      
      const response = await this.suggestionService.handleInteraction(
        baselineId, 
        sessionId, 
        action, 
        context
      );
      
      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/baselines/:id/suggestions/:suggestionId/apply
   * 应用某个建议
   */
  applySuggestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: baselineId, suggestionId } = req.params;
      
      if (!baselineId || !baselineId.match(/^baseline-[\w-]+$/)) {
        throw new AppError('无效的基准ID格式', 400, 'INVALID_BASELINE_ID');
      }

      if (!suggestionId) {
        throw new AppError('缺少建议ID', 400, 'MISSING_SUGGESTION_ID');
      }

      logger.info(`Applying suggestion ${suggestionId} for baseline: ${baselineId}`);
      
      await this.suggestionService.applySuggestion(suggestionId);
      
      res.json({
        success: true,
        message: '建议已成功应用'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/baselines/:id/analyze
   * 触发基准分析
   */
  triggerAnalyze = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: baselineId } = req.params;
      const { force = false } = req.body;
      
      if (!baselineId || !baselineId.match(/^baseline-[\w-]+$/)) {
        throw new AppError('无效的基准ID格式', 400, 'INVALID_BASELINE_ID');
      }

      logger.info(`Triggering analysis for baseline: ${baselineId}, force: ${force}`);
      
      const analysisResult = await this.analyzeService.analyzeBaseline(baselineId, { force });
      
      res.json({
        success: true,
        data: {
          analysisId: analysisResult.id,
          status: 'processing',
          estimatedTime: '30秒',
          progress: 0
        }
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        next(new AppError('基准不存在', 404, 'BASELINE_NOT_FOUND'));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/baselines/:id/analyze/history
   * 获取分析历史
   */
  getAnalysisHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: baselineId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!baselineId || !baselineId.match(/^baseline-[\w-]+$/)) {
        throw new AppError('无效的基准ID格式', 400, 'INVALID_BASELINE_ID');
      }

      logger.info(`Getting analysis history for baseline: ${baselineId}`);
      
      const history = await this.analyzeService.getAnalysisHistory(baselineId, limit);
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      next(error);
    }
  };
}