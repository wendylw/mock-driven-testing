import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Analysis routes (placeholder for now)
router.get('/:id/progress', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      analysisId: req.params.id,
      status: 'processing',
      progress: 60,
      currentStep: '分析代码结构',
      completedSteps: ['收集文件', '解析AST'],
      remainingSteps: ['视觉对比', '生成建议']
    }
  });
});

export default router;