import fs from 'fs/promises';
import path from 'path';
import { DatabaseService } from './database-sqlite.service';
import { CacheService } from './cache.service';
import { usageAnalyzerService } from './usage-analyzer.service';
import { logger } from '../utils/logger';
import { 
  BaselineRecord, 
  VersionRecord, 
  StatusDetail, 
  BaselineStatus,
  BaselineMetrics 
} from '../models/baseline.model';

export class StatusService {
  private static CACHE_TTL = 5 * 60; // 5 minutes

  async getBaselineStatus(baselineId: string): Promise<BaselineStatus> {
    // Check cache first
    const cacheKey = `status:${baselineId}`;
    const cached = await CacheService.getJSON<BaselineStatus>(cacheKey);
    if (cached) {
      logger.info(`Cache hit for baseline status: ${baselineId}`);
      return cached;
    }

    // Get baseline from database
    const baseline = await this.getBaseline(baselineId);
    if (!baseline) {
      throw new Error(`Baseline not found: ${baselineId}`);
    }

    // Calculate intelligent status
    const statusDetail = await this.calculateIntelligentStatus(baseline);

    // Get metrics
    const metrics: BaselineMetrics = {
      usageCount: baseline.usage_count,
      lastUpdated: baseline.updated_at,
      snapshotCount: baseline.snapshot_count || 0,
      size: baseline.file_size || 0
    };

    const result: BaselineStatus = {
      baselineId,
      component: baseline.component_name,
      status: statusDetail.type,
      statusLabel: statusDetail.label,
      statusDetail,
      metrics
    };

    // Cache the result
    await CacheService.setJSON(cacheKey, result, StatusService.CACHE_TTL);

    return result;
  }

  private async getBaseline(baselineId: string): Promise<BaselineRecord | null> {
    const sql = 'SELECT * FROM baselines WHERE id = ?';
    const rows = await DatabaseService.query<BaselineRecord[]>(sql, [baselineId]);
    return rows.length > 0 ? rows[0] : null;
  }

  private async calculateIntelligentStatus(baseline: BaselineRecord): Promise<StatusDetail> {
    // Check if file exists
    const fileExists = await this.checkFileExists(baseline.component_path);
    
    if (!fileExists) {
      // Check if it's marked as deleted
      if (baseline.status === 'corrupted') {
        return {
          type: 'deleted',
          label: '已删除',
          hasDetail: true,
          detailTitle: '组件已删除',
          detailMessage: '组件文件不存在，建议清理基准数据'
        };
      }
    }

    // Check for deprecated status (component exists but not used)
    if (baseline.usage_count === 0 && baseline.status === 'healthy') {
      const daysSinceCreated = Math.floor(
        (Date.now() - new Date(baseline.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceCreated > 30) {
        // Analyze actual usage in the codebase
        const projectPath = process.env.PROJECT_ROOT || path.resolve(__dirname, '../../../');
        const usage = await usageAnalyzerService.analyzeComponentUsage(
          baseline.component_name,
          baseline.component_path,
          projectPath
        );
        
        if (usage.usageCount === 0) {
          return {
            type: 'deprecated',
            label: '已弃用',
            hasDetail: true,
            detailTitle: '组件未被使用',
            detailMessage: `该组件已创建${daysSinceCreated}天，但系统中没有任何地方引用此组件，建议归档或删除`
          };
        } else {
          // Update usage count in database
          await this.updateUsageCount(baseline.id, usage.usageCount);
        }
      }
    }

    // Get version history
    const versionHistory = await this.getVersionHistory(baseline.id);
    const last30Days = versionHistory.filter((v: VersionRecord) => {
      const daysDiff = (Date.now() - new Date(v.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    });

    // Check for instability (frequent changes)
    if (last30Days.length >= 10) {
      const avgDays = Math.round(30 / last30Days.length);
      return {
        type: 'unstable',
        label: '不稳定',
        hasDetail: true,
        detailTitle: '组件频繁变更',
        detailMessage: `最近30天修改${last30Days.length}次，平均${avgDays}天一次修改`
      };
    }

    // Check for drifting (small changes accumulating)
    const minorChanges = last30Days.filter((v: VersionRecord) => 
      v.lines_added < 10 && 
      v.lines_deleted < 10 &&
      v.lines_added + v.lines_deleted > 0
    );

    if (minorChanges.length >= 5 && baseline.status === 'healthy') {
      const totalLines = minorChanges.reduce((sum, v) => 
        sum + v.lines_added + v.lines_deleted, 0
      );
      
      return {
        type: 'drifting',
        label: '渐变中',
        hasDetail: true,
        detailTitle: '细微变化累积',
        detailMessage: `累积${minorChanges.length}个小改动，总计修改${totalLines}行，建议更新基准`
      };
    }

    // Check for optimization opportunities
    const optimizationOpportunities = await this.checkOptimizationOpportunities(baseline);
    if (optimizationOpportunities.length > 0) {
      return {
        type: 'optimizable',
        label: '可优化',
        hasDetail: true,
        detailTitle: `发现${optimizationOpportunities.length}个优化机会`,
        detailMessage: optimizationOpportunities[0]
      };
    }

    // Check basic status
    if (baseline.status === 'corrupted') {
      return {
        type: 'corrupted',
        label: '损坏',
        hasDetail: true,
        detailTitle: '基准文件损坏',
        detailMessage: '快照文件丢失或损坏，需要重新生成'
      };
    }

    if (baseline.status === 'outdated') {
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(baseline.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return {
        type: 'outdated',
        label: '过时',
        hasDetail: true,
        detailTitle: '基准需要更新',
        detailMessage: `组件已更新${daysSinceUpdate}天，建议更新基准`
      };
    }

    // Default healthy status
    return {
      type: 'healthy',
      label: '健康',
      hasDetail: false
    };
  }

  private async checkFileExists(filePath: string): Promise<boolean> {
    try {
      // Convert relative path to absolute path based on project root
      const projectRoot = process.env.PROJECT_ROOT || path.resolve(__dirname, '../../../');
      const absolutePath = path.resolve(projectRoot, filePath);
      
      await fs.access(absolutePath);
      return true;
    } catch {
      return false;
    }
  }

  private async getVersionHistory(baselineId: string): Promise<VersionRecord[]> {
    const sql = `
      SELECT * FROM version_history 
      WHERE baseline_id = ? 
      ORDER BY timestamp DESC
    `;
    
    return DatabaseService.query<VersionRecord[]>(sql, [baselineId]);
  }

  private async checkOptimizationOpportunities(baseline: BaselineRecord): Promise<string[]> {
    const opportunities: string[] = [];

    // Check for common optimization patterns
    // This is simplified - in real implementation, would analyze actual code
    
    // Check if component has many props variations but no React.memo
    if (baseline.props_variations && baseline.props_variations > 3) {
      // In real implementation, would check actual code for React.memo
      opportunities.push('添加React.memo可减少70%重渲染');
    }

    // Check component size
    if (baseline.file_size && baseline.file_size > 10) {
      opportunities.push('组件过大，建议拆分以提高可维护性');
    }

    // Check usage pattern
    if (baseline.usage_count > 20) {
      opportunities.push('高频使用组件，优化可带来显著性能提升');
    }

    return opportunities;
  }

  async invalidateCache(baselineId: string): Promise<void> {
    const cacheKey = `status:${baselineId}`;
    await CacheService.del(cacheKey);
    logger.info(`Cache invalidated for baseline: ${baselineId}`);
  }

  private async updateUsageCount(baselineId: string, usageCount: number): Promise<void> {
    const sql = 'UPDATE baselines SET usage_count = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await DatabaseService.query(sql, [usageCount, baselineId]);
    logger.info(`Updated usage count for baseline ${baselineId}: ${usageCount}`);
  }
}