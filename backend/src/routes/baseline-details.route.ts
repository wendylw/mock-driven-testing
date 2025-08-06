import { Router } from 'express';
import { BaselineService } from '../services/baseline.service';
import { BeepButtonData } from '../data/beep-button-data';

const router = Router();
const baselineService = new BaselineService();

// 获取基准详情
router.get('/baselines/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 如果是 BEEP Button，返回真实数据
    if (id === 'baseline-button-beep-001') {
      const beepData = BeepButtonData.getFullDetails();
      return res.json({
        success: true,
        data: beepData
      });
    }
    
    // 否则从数据库获取
    const baseline = await baselineService.getBaseline(id);
    if (!baseline) {
      return res.status(404).json({
        success: false,
        error: 'Baseline not found'
      });
    }
    
    // 构建详情数据
    const details = await baselineService.getBaselineDetails(id);
    
    res.json({
      success: true,
      data: details
    });
  } catch (error) {
    console.error('Error getting baseline details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get baseline details'
    });
  }
});

// 获取基准分析历史
router.get('/baselines/:id/analysis-history', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;
    
    const history = await baselineService.getAnalysisHistory(id, Number(limit));
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error getting analysis history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get analysis history'
    });
  }
});

export default router;