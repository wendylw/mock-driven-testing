import { Router } from 'express';
import { VariantAnalysisService } from '../services/variant-analysis.service';

const router = Router();

// Get variant analysis for a baseline
router.get('/baselines/:id/variants', async (req, res) => {
  try {
    const { id } = req.params;
    
    const summary = await VariantAnalysisService.getVariantSummary(id);
    
    return res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error getting variant analysis:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get variant analysis'
    });
  }
});

// Analyze variants for a component
router.post('/baselines/:id/analyze-variants', async (req, res) => {
  try {
    const { id } = req.params;
    const { componentType, componentCode } = req.body;
    
    const variants = await VariantAnalysisService.analyzeComponentVariants(
      id,
      componentType,
      componentCode
    );
    
    const issues = await VariantAnalysisService.analyzeVariantIssues(
      id,
      componentType
    );
    
    return res.json({
      success: true,
      data: {
        variants,
        issues
      }
    });
  } catch (error) {
    console.error('Error analyzing variants:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze variants'
    });
  }
});

export default router;