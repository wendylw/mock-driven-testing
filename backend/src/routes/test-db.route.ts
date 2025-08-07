import { Router } from 'express';
import { DatabaseService } from '../services/database-sqlite.service';

const router = Router();

router.get('/test/db-problems/:baselineId', async (req, res) => {
  try {
    const { baselineId } = req.params;
    
    const problems = await DatabaseService.query(
      'SELECT id, category, impact FROM diagnostic_problems WHERE baseline_id = ? ORDER BY id',
      [baselineId]
    );
    
    return res.json({
      success: true,
      count: problems.length,
      problems: problems
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

export default router;