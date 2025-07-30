const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * 基准状态服务 - 负责计算组件基准状态
 * 这是正确的架构：状态判断逻辑在后端，前端只负责展示
 */
class BaselineService {
  constructor() {
    this.beepRepoPath = '/Users/wendylin/workspace/beep-v1-webapp';
    this.analysisReportPath = path.join(__dirname, '../../../analysis-report.json');
  }

  /**
   * 获取所有组件的基准状态
   */
  async getAllBaselines() {
    try {
      // 1. 读取组件分析数据
      const analysisData = JSON.parse(fs.readFileSync(this.analysisReportPath, 'utf8'));
      
      // 2. 为每个组件计算基准状态
      const baselines = [];
      for (const [componentName, componentInfo] of Object.entries(analysisData.components)) {
        const baseline = await this.calculateBaselineStatus(componentName, componentInfo);
        baselines.push(baseline);
      }

      // 3. 添加已删除组件示例
      baselines.push(this.createDeletedComponentExample());

      // 4. 计算统计信息
      const meta = this.calculateStats(baselines);

      return {
        success: true,
        data: baselines,
        meta
      };
    } catch (error) {
      console.error('获取基准数据失败:', error);
      return {
        success: false,
        error: error.message,
        data: [],
        meta: { total: 0, healthy: 0, outdated: 0, corrupted: 0, healthPercentage: 0 }
      };
    }
  }

  /**
   * 计算单个组件的基准状态
   * 核心逻辑：基准快照 vs 当前组件状态
   */
  async calculateBaselineStatus(componentName, componentInfo) {
    try {
      // 1. 获取组件当前的git信息
      const componentPath = this.getComponentPath(componentName, componentInfo);
      const currentCommit = this.getCurrentComponentCommit(componentPath);
      
      // 2. 获取基准快照信息（模拟从基准存储中读取）
      const baselineCommit = this.getBaselineCommit(componentName);
      
      // 3. 判断基准状态
      const status = this.determineStatus(currentCommit, baselineCommit, componentPath);
      
      // 4. 组装完整的基准数据
      return {
        id: `baseline-${componentName.toLowerCase()}-001`,
        component: componentName,
        path: componentPath,
        version: this.getComponentVersion(componentName),
        createdAt: this.getBaselineCreatedTime(componentName),
        lastUpdated: this.getLastUpdateTime(componentPath),
        snapshotCount: this.getSnapshotCount(componentName),
        propsVariations: this.getPropsVariations(componentName),
        status: status.status,
        corruptionType: status.corruptionType,
        branch: 'develop',
        commit: currentCommit ? currentCommit.substring(0, 8) : 'unknown',
        size: this.getBaselineSize(componentName),
        usageCount: componentInfo.usageCount,
        riskLevel: componentInfo.riskLevel,
        businessImpact: this.getBusinessImpact(componentName, componentInfo),
        criticalUsageScenarios: this.getCriticalScenarios(componentName, componentInfo.usedIn),
        baselineDetails: {
          currentComponentCommit: currentCommit,
          baselineCommit: baselineCommit,
          statusReason: status.reason
        }
      };
    } catch (error) {
      console.error(`计算${componentName}基准状态失败:`, error);
      return this.createErrorBaseline(componentName, componentInfo, error);
    }
  }

  /**
   * 核心状态判断逻辑
   */
  determineStatus(currentCommit, baselineCommit, componentPath) {
    // 1. 检查组件文件是否存在
    if (!fs.existsSync(path.join(this.beepRepoPath, componentPath))) {
      return {
        status: 'corrupted',
        corruptionType: 'componentDeleted',
        reason: '组件文件已从develop分支删除'
      };
    }

    // 2. 检查基准文件完整性（模拟）
    if (!this.checkBaselineIntegrity(componentPath)) {
      return {
        status: 'corrupted',
        corruptionType: 'fileCorrupted',
        reason: '基准快照文件损坏或丢失'
      };
    }

    // 3. 比较基准快照与当前组件状态
    if (!currentCommit || !baselineCommit) {
      return {
        status: 'corrupted',
        corruptionType: 'fileCorrupted',
        reason: '无法获取commit信息'
      };
    }

    if (currentCommit === baselineCommit) {
      return {
        status: 'healthy',
        corruptionType: null,
        reason: '基准快照与当前组件状态完全一致'
      };
    } else {
      return {
        status: 'outdated',
        corruptionType: null,
        reason: '组件已更新但基准快照还是旧状态，需要更新基准'
      };
    }
  }

  /**
   * 获取组件当前的最新commit
   */
  getCurrentComponentCommit(componentPath) {
    try {
      const fullPath = path.join(this.beepRepoPath, componentPath);
      if (!fs.existsSync(fullPath)) {
        return null;
      }

      const command = `git -C "${this.beepRepoPath}" log -1 --format="%H" -- "${componentPath}"`;
      const result = execSync(command, { encoding: 'utf8' }).trim();
      return result || null;
    } catch (error) {
      console.error(`获取${componentPath}的git信息失败:`, error);
      return null;
    }
  }

  /**
   * 获取基准快照对应的commit（模拟从基准存储读取）
   */
  getBaselineCommit(componentName) {
    // 模拟不同组件的基准commit状态
    const baselineCommits = {
      'Button': '68bb4f503d46bc5c32527ca1b946c3294ef47f7c', // 与当前一致 = healthy
      'CreateOrderButton': 'a2d5c8f1234567890abcdef1234567890abcdef12', // 模拟旧基准 = outdated
      'Modal': 'b7086be5b570b1799afdf1acbf23e691da2c2a83', // 基准存在但文件损坏 = corrupted
      'Input': 'd9059fad6427fb00c65775c5d181cc599105e974' // 与当前一致 = healthy
    };
    
    return baselineCommits[componentName] || '0000000000000000000000000000000000000000';
  }

  /**
   * 检查基准文件完整性（模拟）
   */
  checkBaselineIntegrity(componentPath) {
    // 模拟Modal组件的基准文件损坏
    if (componentPath.includes('Modal')) {
      return false; // 模拟文件损坏
    }
    return true; // 其他组件基准完整
  }

  /**
   * 获取组件路径
   */
  getComponentPath(componentName, componentInfo) {
    if (componentInfo.definedIn) {
      // 转换绝对路径为相对路径
      return componentInfo.definedIn.replace('/Users/wendylin/workspace/beep-v1-webapp/', '');
    }
    
    // 根据组件名称推断路径
    const pathMapping = {
      'Button': 'src/common/components/Button/index.jsx',
      'CreateOrderButton': 'src/ordering/components/CreateOrderButton/index.jsx',
      'Modal': 'src/common/components/Modal/index.jsx',
      'Input': 'src/common/components/Input/Input.jsx'
    };
    
    return pathMapping[componentName] || `src/common/components/${componentName}/index.jsx`;
  }

  /**
   * 其他辅助方法...
   */
  getLastUpdateTime(componentPath) {
    try {
      const command = `git -C "${this.beepRepoPath}" log -1 --format="%ad" --date=iso -- "${componentPath}"`;
      const result = execSync(command, { encoding: 'utf8' }).trim();
      return result ? new Date(result).toISOString() : new Date().toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }

  getSnapshotCount(componentName) {
    const counts = {
      'Button': 15, // 3type × 5state
      'CreateOrderButton': 8, // 支付场景
      'Modal': 6, // 不同尺寸
      'Input': 12 // 4type × 3state
    };
    return counts[componentName] || 10;
  }

  getPropsVariations(componentName) {
    const variations = {
      'Button': 12,
      'CreateOrderButton': 6,
      'Modal': 4,
      'Input': 8
    };
    return variations[componentName] || 6;
  }

  getBaselineSize(componentName) {
    const sizes = {
      'Button': 245.6,
      'CreateOrderButton': 156.3,
      'Modal': 89.7,
      'Input': 201.3
    };
    return sizes[componentName] || 120.0;
  }

  getComponentVersion(componentName) {
    return '2.1.4'; // 模拟版本号
  }

  getBaselineCreatedTime(componentName) {
    // 模拟不同的创建时间
    if (componentName === 'Button') {
      return '2024-09-25T17:56:47+0800'; // 真实时间
    }
    return '2025-01-15T10:00:00+0800'; // 模拟时间
  }

  getBusinessImpact(componentName, componentInfo) {
    if (componentName === 'CreateOrderButton') return '直接影响营收';
    if (componentInfo.usageCount > 20) return '影响用户体验';
    return '数据质量相关';
  }

  getCriticalScenarios(componentName, usedIn = []) {
    const scenarios = [];
    
    if (componentName === 'Button') {
      if (usedIn.some(file => file.includes('MiniCart'))) scenarios.push('购物车操作');
      if (usedIn.some(file => file.includes('Search'))) scenarios.push('搜索功能');
      if (usedIn.some(file => file.includes('Confirm'))) scenarios.push('确认对话');
    } else if (componentName === 'CreateOrderButton') {
      scenarios.push('支付流程', '订单创建', '购物车结算');
    } else if (componentName === 'Modal') {
      scenarios.push('确认对话', '警告提示', '信息展示');
    } else if (componentName === 'Input') {
      scenarios.push('用户信息收集', '表单输入');
    }
    
    return scenarios.slice(0, 3);
  }

  createDeletedComponentExample() {
    return {
      id: 'baseline-oldcard-001',
      component: 'OldCard',
      path: 'src/common/components/OldCard/index.jsx',
      version: '1.2.0',
      createdAt: '2025-01-10T10:00:00+0800',
      lastUpdated: '2025-01-15T14:30:00+0800',
      snapshotCount: 6,
      propsVariations: 4,
      status: 'corrupted',
      corruptionType: 'componentDeleted',
      branch: 'develop',
      commit: 'old123ab',
      size: 87.5,
      usageCount: 0,
      riskLevel: 'low',
      businessImpact: '组件已删除',
      criticalUsageScenarios: [],
      baselineDetails: {
        currentComponentCommit: null,
        baselineCommit: 'old123abc1234567890abcdef1234567890abcdef12',
        statusReason: '组件已从develop分支删除，基准数据需要清理',
        corruptionDetails: '组件文件不存在'
      }
    };
  }

  createErrorBaseline(componentName, componentInfo, error) {
    return {
      id: `baseline-${componentName.toLowerCase()}-001`,
      component: componentName,
      path: 'unknown',
      version: 'unknown',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      snapshotCount: 0,
      propsVariations: 0,
      status: 'corrupted',
      corruptionType: 'fileCorrupted',
      branch: 'develop',
      commit: 'unknown',
      size: 0,
      usageCount: componentInfo.usageCount || 0,
      riskLevel: componentInfo.riskLevel || 'low',
      businessImpact: '状态获取失败',
      criticalUsageScenarios: [],
      baselineDetails: {
        currentComponentCommit: null,
        baselineCommit: null,
        statusReason: `状态计算失败: ${error.message}`
      }
    };
  }

  calculateStats(baselines) {
    const total = baselines.length;
    const healthy = baselines.filter(b => b.status === 'healthy').length;
    const outdated = baselines.filter(b => b.status === 'outdated').length;
    const corrupted = baselines.filter(b => b.status === 'corrupted').length;
    
    return {
      total,
      healthy,
      outdated,
      corrupted,
      healthPercentage: total > 0 ? Math.round((healthy / total) * 100) : 0,
      lastCheck: new Date().toISOString()
    };
  }
}

module.exports = BaselineService;