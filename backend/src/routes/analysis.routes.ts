import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { AnalyzeService } from '../services/analyze.service';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

const router = Router();
const analyzeService = new AnalyzeService();

/**
 * GET /api/analysis/:id/progress
 * 获取分析进度
 */
router.get('/:id/progress', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: analysisId } = req.params;
    
    if (!analysisId || !analysisId.match(/^analysis-[\w-]+$/)) {
      throw new AppError('无效的分析ID格式', 400, 'INVALID_ANALYSIS_ID');
    }

    logger.info(`Getting progress for analysis: ${analysisId}`);
    
    const progress = await analyzeService.getAnalysisProgress(analysisId);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      next(new AppError('分析任务不存在', 404, 'ANALYSIS_NOT_FOUND'));
    } else {
      next(error);
    }
  }
});

export default router;