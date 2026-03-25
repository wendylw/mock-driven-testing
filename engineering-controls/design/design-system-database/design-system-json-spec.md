# Beep UI Design System JSON 规范（A/B 并存，统一项目索引）
> 易读版摘要（5 分钟掌握）
>
> 这份文档描述同一项目下两套 UI 设计体系（A 与 B）的“Token‑first”数据模型，用于生成单一 JSON（未来可落库）。
> 记住三件事：
> 1) Token 是基座，组件只是 Token 的消费者；
> 2) A 来自 Tailwind（tw‑ 与 *.module.scss 与 common/styles 基础样式），B 来自全局 SCSS 与 legacy；
> 3) tw‑ 类分两类：可主题（进 tokens）与布局原语（进 primitives）。
>
> 你真正需要知道的：
> - A/B 判定：tw‑ / *.module.scss / common/styles/{animation,variables,base} → A；普通 *.scss 与 legacy‑common → B
> - 可主题（Token）：颜色/间距/圆角/阴影/字号/行高/字距/zIndex/断点/宽度比例/动效
> - 布局原语（Primitive）：flex/grid/display/position/overflow/align/justify/whitespace 等
> - 组件如何链接到 Token：componentSlots（插槽） + componentTokenUsage（插槽→Token）
> - JSON 顶层：projectIndex + systems(A/B) + mappings（A↔B 角色与 Token 差异）
> - 样式隔离（styleIsolation）四种取值：
>   - utility-only：仅使用 tw，未引入任何 scss
>   - module-scss：仅使用 *.module.scss（样式局部隔离）
>   - global-scss：仅使用全局 *.scss（易与他处互相影响）
>   - mixed：同时存在多种来源（例如 tw + module-scss 或 tw + global-scss）

> - 层级（layer）取值：
>   - design-system：两套 UI 设计系统层（A=src/common/components/**；B=src/components/** 等遗留 DS）
>   - feature：业务复用 UI 组件（如 src/ordering/components/** 等），页面/容器不在此表
>   - 页面/容器请见 screens 表（kind: "page"|"container"）
> - 边界与关联：本规范仅限 UI 设计系统（tokens/primitives/components/screens）；数据依赖（selectors）独立子系统，通过外键关联（见 data-deps-json-spec.md）。


---


版本：v1.0.0
状态：可落地规范（仅文档）

## 1. 目标与范围
- 在单一 JSON 中管理同一项目下两套 UI 设计体系：
> - 收录范围：components 表覆盖“设计系统层（ds）+ 业务复用 UI 层（feature）”；页面/容器（screens/containers）不混入，单独 screens 表管理。

  - System A（较新）：src/common/components/**（SCSS Modules + tw- 工具类）
  - System B（遗留）：src/components/**（全局 SCSS）
- JSON 可直接迁移至数据库：字段天然可索引、主/外键明确。
- 仅限 UI 维度：组件、属性、变体、状态、选择器、样式特征；不包含业务/网络/Redux。

## 2. 顶层结构（单 JSON 文件）
```json
{
  "projectIndex": {
    "projectId": "beep-v1-webapp",
    "schemaVersion": "1.0.0",
    "dataVersion": "YYYY.MM.DD",
    "notes": "UI-only; A=common/components, B=components",
    "classificationRules": {
      "classPrefixA": "tw-",
      "scssModuleA": "**/*.module.scss",
      "stylesA": [
        "src/common/styles/animation/**/*.scss",
        "src/common/styles/variables/**/*.scss",
        "src/common/styles/base/**/*.scss",
        "src/common/styles/animates.scss"
      ],
      "scssGlobalB": "**/*.scss (exclude **/*.module.scss)",
      "legacyB": "src/common/styles/legacy-common/**"
    }
  },
  "systems": {
    "A": { "tables": { /* A 系统的各表 */ } },
    "B": { "tables": { /* B 系统的各表 */ } }
  },
  "mappings": [ /* A↔B 的规范角色映射与替代关系 */ ]
}
```

说明：
- systems.A 与 systems.B 彼此独立、同构（拥有相同的“表模型”）；
- mappings 仅做跨系统参考（表达替代关系），不改变 AB 独立性。

## 3. 表模型（Token‑first，两套系统同构但来源不同）
以下以“设计 Token”为基座；组件是 Token 的消费者。A 来源于 Tailwind 配置与 tw‑ 实际使用；B 来源于全局 SCSS/字面量的反推。

### 3.1 tokenSets（主题/模式）
- 主键：set_id
- 字段：set_id (PK), name, mode("light"|"dark"|"brand"), description
- 说明：若暂不做主题切换，可仅有一个默认集合（如 light）。

### 3.2 tokens（设计 Token 主表，基座）
- 主键：token_id（建议命名：group.scope.key，例如 color.orange.DEFAULT、radius.lg、font.size.sm）
- 外键：set_id → tokenSets.set_id
- 字段：
  - token_id (PK)
  - set_id (FK)
  - group: "color"|"spacing"|"radius"|"shadow"|"fontFamily"|"fontSize"|"fontWeight"|"lineHeight"|"letterSpacing"|"zIndex"|"breakpoint"|"width"|"motion"|"keyframes"|"opacity?"|"borderWidth?"
    - 说明：
      - spacing 同时包含 vw 刻度与 px 刻度（例如 spacing.vw.8、spacing.px.12）
      - motion 组按 type 区分 duration/easing（token_id 可写为 motion.duration.short）
      - keyframes 存储关键帧名称（值可为名称/描述，具体帧定义留在样式源）
      - opacity/borderWidth 为 B 系统可选组（若从 SCSS 变量/字面量反推出现）
  - name: 语义名（如 orange.DEFAULT / gray.500 / vw.8 / px.12）
  - type: "color"|"length(px|vw|rem|em)"|"number"|"shadow"|"string"|"ratio"
  - value: 原始值（例如 #FF9419、0.512820vw、1.1428rem）
  - alias_of?: string（若是别名，指向规范 token）
  - source: "tailwind"|"scss_variable"|"literal"（A 多为 tailwind；B 为 scss_variable/literal）
  - confidence?: number(0..1)（B 反推时的置信度）
- 索引：idx(group,name), idx(set_id)


### 3.3 primitives（布局原语，非主题）
- 说明：承载 tw‑flex/tw-grid/tw-block 等非主题化类的语义，用于结构与排版，不进入 tokens。
- 主键：primitive_id
- 字段：
  - primitive_id (PK)
  - group（如 layout.display / layout.flex.direction / layout.flex.wrap / layout.align.items / layout.justify.content / layout.position / layout.overflow / typography.align / typography.style / whitespace / visibility / opacity 等）
  - name 或 property/value（按实现二选一）
  - source: "tailwind-core"|"scss_global"|"legacy_common"
- 索引：idx(group)

### 3.4 tokenAliases（可选）
- 主键：alias_id
- 外键：token_id → tokens.token_id
- 字段：alias_id (PK), token_id (FK), alias_name（历史/遗留别名）

### 3.5 components（组件主表，消费视图）
- 主键：component_id = "<system>:<ComponentName>"（system ∈ {"A","B"}）
- 字段：
  - component_id (PK): string
  - system: "A"|"B"
  - name: string
  - path: string
  - layer: "design-system"|"feature"
  - domain?: string（ds 层填 "common"；feature 层填业务域名，如 ordering/rewards/user 等）
  - category: "foundation"|"inputs"|"form"|"feedback"|"overlay"|"data-display"|"layout"|"navigation"|"assets"
  - a11yProfile: { keyboard: "ok|partial|missing", roles: "ok|partial|missing", labeling: "ok|partial|missing", focus: "ok|partial|na", liveRegion: "ok|na" }
  - styleIsolation: "utility-only"|"module-scss"|"global-scss"|"mixed"
  - styleSources: string[]（建议取值集合：["tw","module-scss","global-scss","legacy-common","styles-base","styles-variables","styles-animation"]；按实际出现记录组合即可）
  - hasTwUtils: boolean（仅 A 常见）
  - dataTestIdCoverage: "none"|"partial"|"full"
  - status: "active"|"deprecated"|"experimental"
  - description?: string
  - usageCount?: number
  - crossSystemUsage?: boolean（组件在 A 但消费 B 的 Token/反之）
  - zIndexFootprint?: "none"|"low"|"high"
  - notes?: string
- 索引：idx(system,name)、idx(system,category)、idx(status)

### 3.6 componentSlots（组件插槽/视觉位）
- 主键：slot_id = "<component_id>#slot:<slotName>"
- 外键：component_id → components.component_id
- 字段：slot_id (PK), component_id (FK), name（如 background|text|border|focusRing|shadow|radius|padding|gap|iconColor）

### 3.7 componentTokenUsage（组件消费 Token 映射）
- 主键：ct_id = "<component_id>#slot:<slotName>#token:<token_id>"
- 外键：component_id、slot_id、token_id
- 字段：ct_id (PK), component_id (FK), slot_id (FK), token_id (FK), notes?
- 用途：回答“组件用了哪些 Token”，支持 A↔B 差异对比。

### 3.8 componentPrimitiveUsage（组件使用布局原语）
- 主键：cpu_id = "<component_id>#primitive:<primitive_id>"
- 外键：component_id, primitive_id
- 字段：cpu_id (PK), component_id (FK), primitive_id (FK), notes?
- 说明：screens 与 primitives 的关系通过“屏-组-件”组合关系建立（见 3.14 screens 与 3.15 composition）。

### 3.9 props（组件属性表，UI 相关）
- 主键：prop_id = "<component_id>#prop:<propName>"
- 外键：component_id → components.component_id
- 字段：name、type（string|number|bool|node|func|object|array|enum:...）、required(bool)、default(string?)、description?

### 3.10 variants（变体表）
- 主键：variant_id = "<component_id>#variant:<variantName>"
- 外键：component_id
- 字段：name、group?("type"|"size"|"appearance")、description?

### 3.11 states（状态/交互表）
- 主键：state_id = "<component_id>#state:<stateName>"
- 外键：component_id
- 字段：name（"disabled"|"loading"|"error"|"focused"|"active"|"selected"|"open"|"closed"…）、effects(string[])、notes?

### 3.12 selectors（测试选择器，仅 UI）
- 主键：selector_id = "<component_id>#selector:<testId>"
- 外键：component_id
- 字段：testId、element?(如 increase-button/close-btn/container)、reliability("high"|"medium"|"low")、notes?





### 3.14 screens（页面/容器元数据，独立表）【与 components 通过 composition 关联】
- 说明：页面/容器不进入 components 表，统一在 screens 记录元信息，便于组合分析。
- 主键：screen_id
- 字段：screen_id (PK), name, path, domain（如 ordering/rewards/user 等）, kind:"page|container", notes?

- 主键：screen_id
- 字段：screen_id (PK), name, path, domain（如 ordering/rewards/user 等）, kind:"page|container", notes?

### 3.15 composition（屏-组-件 组合关系）
- 说明：建立 screen 与 components 的多对多关系（一个页面包含多个组件，一个组件被多个页面使用）。
- 主键：comp_id
- 字段：comp_id (PK), screen_id (FK), component_id (FK)

### 3.16 styleTraits（样式特征，可选）
- 主键：trait_id = "<component_id>#trait:<traitName>"
- 外键：component_id
- 字段：trait（"uses-portal"|"transitions"|"requires-z-index"|"focus-ring"|"rtl-aware"|"responsive"…）、notes?

### 3.17 usage（使用场景，可选，仅治理）
- 主键：usage_id = "<component_id>#usage:<contextKey>"
- 外键：component_id
- 字段：context、notes?

## 4. 跨系统映射（mappings）
- 用于共存期的替代规划；表达“规范角色”的 A↔B 对应关系与 Token 差异。

字段：
- id = canonicalRole（如 "Button","Modal","Input","Radio","Switch","Tag","Toast","Alert","Drawer","QuantityAdjuster"）
- canonicalRole, preferred("A:…"), fallback("B:…"), equivalence("full"|"partial"|"none")
- propMap?: [{ from: "B:prop", to: "A:prop", transform?: "enum"|"boolean"|"merge"|"split"|"none", notes?: string }]
- tokenDiffs?: [{ slot: string, A_token: string, B_token: string, status: "equal"|"similar"|"conflict" }]
- behaviorDiffs?: string[]
- blockers?: string[]
- migration?: { readinessScore: 0..100, owner?: string, targetVersion?: string, notes?: string }

备注：mappings 不改变 AB 基表独立性。

## 5. 命名与约束
- token_id：group.scope.key（例 color.orange.DEFAULT / spacing.vw.8 / spacing.px.12 / radius.lg / shadow.xl / zIndex.200 / breakpoint.sm）
- component_id："<system>:<ComponentName>"；复合主键："<component_id>#<kind>:<name>"
- 受控枚举：category/styleIsolation/status/reliability/equivalence/group/type/mode 等需通过 Schema 校验。

## 6. 生成与维护（只读扫描 → JSON）
- 扫描范围：
  - A（Tailwind）：tailwind.config.js + src/**/*（tw- 类名使用）+ src/common/components/** + src/common/styles/{animation,variables,base}/**/*.scss + src/common/styles/animates.scss
  - B（SCSS）：src/components/**/*.{scss,jsx} + src/common/styles/legacy-common/**
- A 的自动提取：
  - 从 tailwind.config.js 生成 tokenSets/tokens（颜色、spacing、radius、shadow、font、lineHeight、letterSpacing、zIndex、breakpoint、width、motion）
  - 扫描 tw- 前缀 utility → 映射到 tokens 或 primitives；记录 utilityUsage（class, baseClass, mappingType(token|primitive), mappedId, variants[], files[], count）
  - 为常用组件建立 componentSlots/componentTokenUsage 与 componentPrimitiveUsage（如 Button.background → color.orange.DEFAULT；Button.layout → layout.display:flex）
  - 解析 *.module.scss 与 styles/{variables,base,animation} → 补充 tokens（source=scss_module|styles_*）
- B 的自动/半自动提取：
  - 解析 SCSS 变量与字面量 → tokens（source=scss_global|legacy_common|literal，confidence 估计）
  - 归纳组件的关键 slot（background/text/border/shadow/radius/spacing）→ componentSlots
  - 绑定 componentTokenUsage 与 componentPrimitiveUsage；尽量 alias_of 到 A 的规范 token
- 通用补充：
  - props/variants/states/selectors/styleTraits → 解析/规则+人工校核
- 输出：单 JSON（本规范结构）；按表导出 CSV/NDJSON（DB 导入）

## 7. 迁移至数据库（映射建议）
- 方案一（推荐）：统一表 + system 列
  - token_sets(system, set_id PK, name, mode, description)
  - tokens(system, token_id PK, set_id FK, group, name, type, value, alias_of, source, confidence)
  - components(system, component_id PK, name, path, category, a11ySupport, styleIsolation, hasTwUtils, status, description)
  - component_slots(system, slot_id PK, component_id FK, name)
  - component_token_usage(system, ct_id PK, component_id FK, slot_id FK, token_id FK, notes)
  - props/variants/states/selectors/style_traits/usage：同样含 system, component_id
  - mappings 单表：含 tokenDiffs/propMap 等 JSONB 字段
- 方案二：按系统分区表 + 视图统一
- 索引：按上表各自主键与常用查询键建立；selectors 可选 unique(testId)

## 8. 版本与校验
- schemaVersion 使用 semver；dataVersion 为导出时间戳/流水号
- 提供 JSON Schema：根对象 + 各表子 Schema；CI 校验必过
- 变更需要 CHANGELOG 与迁移说明

## 9. 查询与治理示例（思路）
- 列出 A:Button 在 light 主题使用的颜色 Token：
  - join components→component_slots→component_token_usage→tokens where system='A' and component='A:Button' and group='color'
- 对比“Modal”角色下 A 与 B 的背景 Token：
  - 从 mappings.canonicalRole='Modal' 读取 tokenDiffs；或动态 join 两侧 usage
- 找出 B 中未对齐到 A 的 raw token：
  - tokens where system='B' and source in ('literal','scss_variable') and alias_of is null

## 10. 路线图（不改代码，仅数据）
1) A：从 tailwind.config.js 生成 tokenSets/tokens；扫描 tw- 使用（可选 utilityUsage）。
2) B：从 SCSS 抽取 tokens，并 alias_of 对齐到 A 的规范 token。
3) 建立 componentSlots/componentTokenUsage（先覆盖 Top 10 组件角色）。
4) 补 props/variants/states/selectors/styleTraits；完善 mappings（含 tokenDiffs）。
5) 导出 CSV/NDJSON 以便 DB 导入；建立只读看板。

—— 以上为 Token‑first 修订版规范。确认后我可按此结构做只读扫描产出首版 JSON（不改项目代码）。
