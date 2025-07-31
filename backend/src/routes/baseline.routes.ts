import { Router } from 'express';
import { BaselineController } from '../controllers/baseline.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const baselineController = new BaselineController();

// Baseline routes
router.get('/', authMiddleware, baselineController.getBaselines);
router.get('/:id/status', authMiddleware, baselineController.getStatus);
router.get('/:id/diagnostic', authMiddleware, baselineController.getDiagnostic);
router.get('/:id/suggestions', authMiddleware, baselineController.getSuggestions);
router.post('/:id/suggestions/interact', authMiddleware, baselineController.handleSuggestionInteraction);
router.post('/:id/suggestions/:suggestionId/apply', authMiddleware, baselineController.applySuggestion);
router.post('/:id/analyze', authMiddleware, baselineController.triggerAnalyze);
router.get('/:id/analyze/history', authMiddleware, baselineController.getAnalysisHistory);

export default router;