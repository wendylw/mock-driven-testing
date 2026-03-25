# Design System 数据表速查（用途一句话版）

> 目的：快速记住每张表“是干嘛的”。名称与字段以 design-system-json-spec.md 为准。

- tokenSets（主题/模式清单）
  - 定义 Token 的集合与模式（如 light/dark/brand），其他 Token 通过 set_id 归属到某集合。

- tokens（设计 Token 基座）
  - 所有可主题化的设计值（color/spacing/radius/shadow/font/lineHeight/letterSpacing/zIndex/breakpoint/width/motion/keyframes…）。包含来源与（B 系统）置信度。

- tokenAliases（Token 别名）
  - 记录历史/遗留的别名，指向规范化 token（用于聚合与治理）。

- components（组件主表，消费视图）
  - 组件元信息与分类；用 layer 区分 design-system vs feature，用 domain 指明归属业务；记录样式来源、可达性画像与可测性覆盖。

- primitives（布局原语，非主题）
  - 记录 tw-flex/tw-grid/align/justify/position/overflow 等“结构语义”，与 tokens 同级，用于结构统计与规范。

- componentSlots（组件插槽/视觉位）
  - 把组件拆成会消耗 Token 的“部位”（如 background/text/border/shadow/radius/padding/focusRing…），作为 Token 绑定的锚点。

- componentTokenUsage（插槽→Token 绑定）
  - 把某组件的某个 slot 具体绑定到一个 token（例如 Button.background → color.orange.DEFAULT），用于主题替换/影响面分析。

- componentPrimitiveUsage（组件使用原语）
  - 记录组件使用了哪些 primitives（例如 Button.layout → layout.display:flex），便于布局规范与替换分析。

- props（组件属性表）
  - 记录组件的 UI 相关属性（类型/必填/默认值/说明），用于 API 差异与迁移映射。

- variants（变体表）
  - 记录组件的外观/尺寸等变体（type/size/appearance），便于描述不同外观下的 Token/行为差异。

- states（状态/交互表）
  - 记录组件状态（disabled/loading/error/focused/active…）及可见效果（effects），辅助断言与使用规范。

- selectors（测试选择器表）
  - 汇总组件可用的 data-test-id（以及元素语义与稳定性），服务自动化测试与选择器治理。

- composition（屏-组-件 组合关系）
  - 连接 screens 与 components 的多对多关系（一个页面包含多个组件；一个组件被多个页面使用）。

- screens（页面/容器元数据，独立表）
  - 页面/容器的基本信息（name/path/domain/kind），不进入 components；与 composition 配合完成“屏-组-件”映射。

- styleTraits（样式特征）
  - 标记组件的样式特征（uses-portal/transitions/requires-z-index/focus-ring/rtl-aware/responsive…），用于排查跨层样式风险。

- usage（使用场景，治理可选）
  - 记录组件在特定上下文的使用备注（context/notes），辅助治理与迁移决策。

- mappings（A↔B 规范角色映射）
  - 跨系统的“角色对齐与替代关系”，含 propMap/tokenDiffs/behaviorDiffs/blockers/migration 等，用于共存期替换规划。

- utilityUsage（tw 类使用统计，选配）
  - 统计 tw- 类在项目中的使用（class/baseClass/mappingType(token|primitive)/mappedId/files/count/variants），用于统一化与清理。

