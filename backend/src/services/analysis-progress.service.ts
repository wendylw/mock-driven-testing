import { DatabaseService } from './database.service';
import { RedisService } from './redis.service';
import { wsService } from './websocket.service';
import { logger } from '../utils/logger';

export interface AnalysisStep {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface AnalysisProgress {
  analysisId: string;
  baselineId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  steps: AnalysisStep[];
  estimatedTime?: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

export class AnalysisProgressService {
  private progressMap = new Map<string, AnalysisProgress>();
  private static CACHE_TTL = 60 * 60; // 1 hour

  /**
   * 创建新的分析任务
   */
  async createAnalysis(baselineId: string): Promise<string> {
    const analysisId = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const progress: AnalysisProgress = {
      analysisId,
      baselineId,
      status: 'queued',
      progress: 0,
      currentStep: '准备分析',
      steps: [
        { name: '收集文件信息', status: 'pending' },
        { name: '代码质量分析', status: 'pending' },
        { name: '性能分析', status: 'pending' },
        { name: '可访问性分析', status: 'pending' },
        { name: '视觉对比分析', status: 'pending' },
        { name: '生成智能建议', status: 'pending' },
        { name: '计算健康评分', status: 'pending' }
      ],
      estimatedTime: 30, // 秒
      startTime: new Date()
    };

    // 保存到内存和缓存
    this.progressMap.set(analysisId, progress);
    await this.saveProgress(analysisId, progress);
    
    logger.info(`Created analysis: ${analysisId} for baseline: ${baselineId}`);
    
    return analysisId;
  }

  /**
   * 获取分析进度
   */
  async getProgress(analysisId: string): Promise<AnalysisProgress | null> {
    // 优先从内存获取
    if (this.progressMap.has(analysisId)) {
      return this.progressMap.get(analysisId)!;
    }

    // 从缓存获取
    const cacheKey = `analysis-progress:${analysisId}`;
    const cached = await RedisService.getJSON<AnalysisProgress>(cacheKey);
    if (cached) {
      this.progressMap.set(analysisId, cached);
      return cached;
    }

    // 从数据库获取
    const sql = 'SELECT * FROM analysis_progress WHERE analysis_id = ?';
    const rows = await DatabaseService.query<any[]>(sql, [analysisId]);
    
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    const progress: AnalysisProgress = {
      analysisId: row.analysis_id,
      baselineId: row.baseline_id,
      status: row.status,
      progress: row.progress,
      currentStep: row.current_step,
      steps: JSON.parse(row.steps),
      estimatedTime: row.estimated_time,
      startTime: new Date(row.start_time),
      endTime: row.end_time ? new Date(row.end_time) : undefined,
      error: row.error
    };

    // 缓存结果
    this.progressMap.set(analysisId, progress);
    await RedisService.setJSON(cacheKey, progress, AnalysisProgressService.CACHE_TTL);

    return progress;
  }

  /**
   * 更新分析进度
   */
  async updateProgress(
    analysisId: string, 
    stepName: string, 
    status: 'processing' | 'completed' | 'failed',
    error?: string
  ): Promise<void> {
    const progress = await this.getProgress(analysisId);
    if (!progress) {
      throw new Error(`Analysis not found: ${analysisId}`);
    }

    // 更新步骤状态
    const stepIndex = progress.steps.findIndex(s => s.name === stepName);
    if (stepIndex === -1) {
      throw new Error(`Step not found: ${stepName}`);
    }

    const step = progress.steps[stepIndex];
    step.status = status;
    
    if (status === 'processing') {
      step.startTime = new Date();
      progress.currentStep = stepName;
      progress.status = 'processing';
    } else if (status === 'completed') {
      step.endTime = new Date();
    } else if (status === 'failed') {
      step.endTime = new Date();
      step.error = error;
      progress.status = 'failed';
      progress.error = error;
    }

    // 计算总进度
    const completedSteps = progress.steps.filter(s => s.status === 'completed').length;
    progress.progress = Math.round((completedSteps / progress.steps.length) * 100);

    // 检查是否全部完成
    if (completedSteps === progress.steps.length) {
      progress.status = 'completed';
      progress.endTime = new Date();
      progress.currentStep = '分析完成';
    } else if (status === 'processing') {
      // 找到下一个待处理的步骤
      const nextStep = progress.steps.find(s => s.status === 'pending');
      if (nextStep) {
        progress.currentStep = nextStep.name;
      }
    }

    // 保存更新
    this.progressMap.set(analysisId, progress);
    await this.saveProgress(analysisId, progress);
    
    // 通过WebSocket广播进度更新
    wsService.broadcastAnalysisProgress(analysisId, {
      status: progress.status,
      progress: progress.progress,
      currentStep: progress.currentStep,
      completedSteps: progress.steps.filter(s => s.status === 'completed').map(s => s.name),
      remainingSteps: progress.steps.filter(s => s.status === 'pending').map(s => s.name),
      estimatedTime: progress.estimatedTime
    });
    
    logger.info(`Updated analysis ${analysisId}: ${stepName} -> ${status}`);
  }

  /**
   * 标记分析完成
   */
  async completeAnalysis(analysisId: string): Promise<void> {
    const progress = await this.getProgress(analysisId);
    if (!progress) {
      throw new Error(`Analysis not found: ${analysisId}`);
    }

    progress.status = 'completed';
    progress.progress = 100;
    progress.endTime = new Date();
    progress.currentStep = '分析完成';

    // 确保所有步骤都标记为完成
    progress.steps.forEach(step => {
      if (step.status !== 'completed') {
        step.status = 'completed';
        step.endTime = new Date();
      }
    });

    this.progressMap.set(analysisId, progress);
    await this.saveProgress(analysisId, progress);
    
    // 通过WebSocket广播分析完成
    wsService.broadcastAnalysisComplete(analysisId, {
      status: 'completed',
      progress: 100
    });
    
    logger.info(`Analysis completed: ${analysisId}`);
  }

  /**
   * 标记分析失败
   */
  async failAnalysis(analysisId: string, error: string): Promise<void> {
    const progress = await this.getProgress(analysisId);
    if (!progress) {
      throw new Error(`Analysis not found: ${analysisId}`);
    }

    progress.status = 'failed';
    progress.error = error;
    progress.endTime = new Date();

    this.progressMap.set(analysisId, progress);
    await this.saveProgress(analysisId, progress);
    
    logger.error(`Analysis failed: ${analysisId} - ${error}`);
  }

  /**
   * 保存进度到缓存和数据库
   */
  private async saveProgress(analysisId: string, progress: AnalysisProgress): Promise<void> {
    // 保存到缓存
    const cacheKey = `analysis-progress:${analysisId}`;
    await RedisService.setJSON(cacheKey, progress, AnalysisProgressService.CACHE_TTL);

    // 保存到数据库
    try {
      await DatabaseService.query(
        `INSERT INTO analysis_progress 
         (analysis_id, baseline_id, status, progress, current_step, steps, 
          estimated_time, start_time, end_time, error) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(analysis_id) DO UPDATE SET
           status = excluded.status,
           progress = excluded.progress,
           current_step = excluded.current_step,
           steps = excluded.steps,
           end_time = excluded.end_time,
           error = excluded.error`,
        [
          progress.analysisId,
          progress.baselineId,
          progress.status,
          progress.progress,
          progress.currentStep,
          JSON.stringify(progress.steps),
          progress.estimatedTime,
          progress.startTime.toISOString(),
          progress.endTime?.toISOString() || null,
          progress.error || null
        ]
      );
    } catch (error) {
      logger.error('Failed to save progress to database:', error);
      // 不抛出错误，因为缓存已经保存
    }
  }

  /**
   * 获取基准的分析历史
   */
  async getAnalysisHistory(baselineId: string, limit: number = 10): Promise<AnalysisProgress[]> {
    const sql = `
      SELECT * FROM analysis_progress 
      WHERE baseline_id = ? 
      ORDER BY start_time DESC 
      LIMIT ?
    `;
    
    const rows = await DatabaseService.query<any[]>(sql, [baselineId, limit]);
    
    return rows.map(row => ({
      analysisId: row.analysis_id,
      baselineId: row.baseline_id,
      status: row.status,
      progress: row.progress,
      currentStep: row.current_step,
      steps: JSON.parse(row.steps),
      estimatedTime: row.estimated_time,
      startTime: new Date(row.start_time),
      endTime: row.end_time ? new Date(row.end_time) : undefined,
      error: row.error
    }));
  }

  /**
   * 清理过期的进度数据
   */
  async cleanupOldProgress(daysToKeep: number = 7): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const sql = 'DELETE FROM analysis_progress WHERE start_time < ?';
    const result = await DatabaseService.query(sql, [cutoffDate.toISOString()]);
    
    logger.info(`Cleaned up old analysis progress records: ${result}`);
  }
}

export const analysisProgressService = new AnalysisProgressService();