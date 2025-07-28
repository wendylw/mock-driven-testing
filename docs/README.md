# Mock-Driven Testing (MDT) 文档中心

## 📚 文档结构

### 核心文档

#### 🎯 [MDT智能化平台总体计划](MDT-PLATFORM-MASTER-PLAN.md) **[最新]**
MDT平台的最新规划，从特定项目方案升级为通用智能化平台。
- 平台愿景与架构
- 14周详细实施计划
- 技术选型和创新点
- 预期成果和推广策略

#### 1. [系统概述](01-SYSTEM-OVERVIEW.md)
了解Mock-Driven Testing的核心理念、目标价值和整体架构。
- 系统目标与价值
- 核心理念
- 系统架构
- 使用场景

#### 2. [实施计划](02-IMPLEMENTATION-PLAN.md)
详细的实施路线图和技术方案。
- 当前状态
- 实施阶段（MVP → 企业级）
- 技术架构
- 资源需求
- 风险管理

#### 3. [开发者指南](03-DEVELOPER-GUIDE.md)
前端开发人员如何使用Mock-Driven Testing提升开发效率。
- 快速开始
- 开发工作流程
- 调试技巧
- 最佳实践
- 常见问题

#### 4. [测试人员指南](04-TESTER-GUIDE.md)
测试人员如何利用平台进行高效测试。
- 全新工作模式
- 核心工作流程
- 高级测试功能
- 测试效率工具
- 最佳实践

#### 5. [契约规范](05-CONTRACT-SPECIFICATION.md)
API契约的定义规范和编写指南。
- 契约结构
- 数据类型定义
- 业务规则
- 版本管理
- 编写最佳实践

### 技术深度文档

- [MDT智能分析引擎](MDT-INTELLIGENT-ANALYSIS-ENGINE.md) - 场景分解与颗粒度区分机制
- [MDT跨层测试支持](MDT-CROSS-LAYER-SUPPORT.md) - 测试金字塔各层支持
- [组件测试类型](COMPONENT-TESTING-TYPES.md) - 组件测试分类和策略
- [集成测试层级](INTEGRATION-TEST-LAYERS.md) - 集成测试层级设计

### 工作流文档

- [新功能开发流程](NEW-FEATURE-WORKFLOW.md)
- [协作API设计流程](COLLABORATIVE-API-DESIGN-WORKFLOW.md)
- [契约确认流程](CONTRACT-CONFIRMATION-WORKFLOW.md)
- [纯后端开发流程](BACKEND-ONLY-WORKFLOW.md)

### 归档文档

- [archive/](archive/) - 历史文档和已废弃方案
  - [beep-plan/](archive/beep-plan/) - BEEP项目特定实施方案（已废弃）

## 🎯 核心价值

### 对开发者
- **并行开发**：不再等待后端API完成
- **即时反馈**：实时验证API使用正确性
- **完整测试**：轻松测试各种异常场景

### 对测试人员
- **自动化测试**：基于契约自动生成测试用例
- **独立环境**：不依赖后端环境进行测试
- **全面覆盖**：轻松构造边界和异常场景

### 对团队
- **明确契约**：API设计清晰，减少沟通成本
- **质量保证**：持续验证实现与设计的一致性
- **效率提升**：整体开发效率提升30-50%

## 🚀 最新进展

### 平台升级公告（2025-07-28）
MDT已从特定项目解决方案升级为**通用的智能化Mock管理平台**！

**主要变化**：
- ✅ 从BEEP特定方案升级为通用平台
- ✅ 增加智能分析引擎
- ✅ 支持多项目管理
- ✅ 插件生态系统
- ✅ 零侵入架构

详见 [MDT智能化平台总体计划](MDT-PLATFORM-MASTER-PLAN.md)

## 📈 实施路线（最新）

基于14周的开发计划：

1. **Phase 0 (第1周)**：基础准备 - 项目架构搭建
2. **Phase 1 (第2-5周)**：核心功能 - Mock管理 + 场景系统
3. **Phase 2 (第6-9周)**：智能分析 - 代码分析 + 策略引擎
4. **Phase 3 (第10-12周)**：用户界面 - Web管理 + CLI工具
5. **Phase 4 (第13-14周)**：优化发布 - 性能优化 + 文档完善

## 🛠 技术栈

- **前端**：React + TypeScript + Ant Design
- **后端**：Node.js + Express + TypeScript
- **数据库**：SQLite（开发）/ PostgreSQL（生产）
- **代理**：HTTP/HTTPS Proxy Server

## 📞 获取帮助

- **Slack**: #mock-driven-testing
- **邮箱**: mock-platform@storehub.com
- **Issues**: [GitHub Issues](https://github.com/storehub/mock-driven-testing/issues)

## 🏆 成功案例

> "使用Mock-Driven Testing后，我们的前后端并行开发效率提升了40%，联调时间减少了70%。" - Beep Team

> "自动化测试覆盖率从60%提升到了95%，生产环境问题减少了80%。" - QA Team

---

**让我们一起构建更高效、更可靠的开发测试体系！**