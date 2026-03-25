# MDT平台 Design System JSON 规范（当前实现版本）
> 易读版摘要（5 分钟掌握）
>
> 这份文档描述MDT平台当前的设计系统数据模型，主要特点是：
> 1) 以组件为中心，设计令牌作为组件的属性存储；
> 2) 使用大JSON字段存储复杂的设计信息；
> 3) 支持BEEP项目的Button等组件分析。
>
> 你真正需要知道的：
> - 设计令牌存储：所有Token信息以JSON格式存储在`component_design_tokens`表的各个TEXT字段中
> - 样式规则：通过`component_style_rules`存储具体的CSS规则和选择器
> - 视觉问题追踪：`visual_problem_styles`连接问题诊断和样式差异
> - 字体管理：`font_resources`单独管理字体资源

---

版本：v0.5.0（现有实现）
状态：生产环境使用中

## 1. 目标与范围
- 存储组件的计算后CSS值，避免前端重复解析
- 支持组件级别的设计分析和问题诊断
- 为BEEP等项目提供设计系统数据支持
- 仅限UI维度：样式、颜色、间距、字体等视觉属性

## 2. 顶层结构（数据库表关系）
```sql
-- 主要表结构关系
design_systems (1) ─── (n) component_design_tokens
                           │
                           └─── (n) component_style_rules
                                    │
diagnostic_problems ─────────────── visual_problem_styles
```

## 3. 表模型（组件中心设计）

### 3.1 design_systems（设计系统表）
- 主键：id (VARCHAR 50)
- 字段：
  - id (PK)
  - project_name: 项目名称（如 beep-v1-webapp）
  - project_path: 项目路径
  - config_file_path: 配置文件路径（如 tailwind.config.js）
  - preprocessor: 预处理器类型（sass|less|postcss）
  - created_at: 创建时间
  - updated_at: 更新时间

### 3.2 component_design_tokens（组件设计令牌表）
- 主键：id (VARCHAR 50)
- 外键：baseline_id, design_system_id
- 核心字段（均为TEXT/JSON格式）：
  
  #### Typography（排版）
  - font_family: 计算后的字体栈
  - font_sizes: {"small": "14px", "normal": "16px", "large": "18px"}
  - font_weights: {"normal": "400", "bold": "700"}
  - line_heights: {"normal": "1.4", "relaxed": "1.5"}
  - letter_spacings: {"normal": "0", "wide": "0.01em"}
  
  #### Colors（颜色）
  - color_palette: 完整的颜色映射
  - primary_colors: {"default": "#FF9419", "dark": "#FC7118", "light": "#FEC788"}
  - text_colors: {"primary": "#303030", "secondary": "#666"}
  - background_colors: {"primary": "#FF9419", "disabled": "#DEDEDF"}
  
  #### Spacing（间距）
  - padding_values: {"small": "8px 16px", "normal": "12px 16px"}
  - margin_values: 外边距值集合
  - gap_values: Flex/Grid间隙值
  
  #### Borders（边框）
  - border_radius: {"default": "8px", "small": "4px", "large": "12px"}
  - border_widths: {"thin": "1px", "medium": "2px"}
  - border_styles: 边框样式映射
  
  #### States（状态样式）
  - hover_styles: 完整的悬停状态样式
  - active_styles: 激活状态样式
  - focus_styles: 焦点状态样式
  - disabled_styles: 禁用状态样式
  
  #### Component Specific（组件特定）
  - component_variants: 所有变体定义（primary, secondary等）
  - component_sizes: 尺寸变化的完整样式
  - custom_properties: CSS自定义属性
  
  #### Metadata（元数据）
  - last_extracted: 最后提取时间
  - extraction_method: 提取方法（static_analysis|runtime_extraction|manual）

### 3.3 component_style_rules（组件样式规则表）
- 主键：id (VARCHAR 50)
- 外键：component_token_id
- 字段：
  - selector: CSS选择器（如 .btn-primary, .btn-primary:hover）
  - rule_type: 规则类型（base|hover|active|disabled|responsive）
  - media_query: 媒体查询（如 @media (min-width: 768px)）
  - computed_styles: 计算后的CSS属性（JSON）
  - source_reference: 源文件引用 {"file": "Button.module.scss", "line": 89}
  - specificity_score: CSS特异性分数

### 3.4 visual_problem_styles（视觉问题样式映射表）
- 主键：id (VARCHAR 50)
- 外键：problem_id, style_rule_id
- 字段：
  - expected_styles: 期望的CSS值（JSON）
  - actual_styles: 实际的CSS值（JSON）
  - diff_details: 详细的差异信息（JSON）

### 3.5 font_resources（字体资源表）
- 主键：id (VARCHAR 50)
- 外键：design_system_id
- 字段：
  - font_name: 字体名称
  - font_source: 字体来源（google|local|system|adobe）
  - font_url: Web字体URL
  - font_fallbacks: 后备字体栈
  - font_display: font-display属性值
  - preload: 是否预加载

## 4. 数据示例（BEEP Button组件）

```json
// component_design_tokens记录示例
{
  "id": "cdt-button-001",
  "baseline_id": "baseline-button-001",
  "design_system_id": "ds-beep-001",
  "component_name": "Button",
  "font_family": "Lato, \"Open Sans\", Helvetica, Arial, sans-serif",
  "font_sizes": "{\"small\": \"14px\", \"normal\": \"16px\", \"large\": \"18px\"}",
  "color_palette": "{
    \"orange\": {\"DEFAULT\": \"#FF9419\", \"dark\": \"#FC7118\"},
    \"gray\": {\"400\": \"#DEDEDF\", \"600\": \"#9E9E9E\"}
  }",
  "padding_values": "{
    \"primary\": {\"small\": \"10px 16px\", \"normal\": \"12px 16px\"},
    \"secondary\": {\"small\": \"10px 16px\", \"normal\": \"12px 16px\"}
  }",
  "component_variants": "{
    \"type-primary-default\": {
      \"background\": \"#FF9419\",
      \"color\": \"#FFFFFF\",
      \"border\": \"1px solid #FF9419\"
    }
  }"
}
```

## 5. 查询示例

```sql
-- 获取组件的所有颜色信息
SELECT 
  component_name,
  JSON_EXTRACT(color_palette, '$.orange.DEFAULT') as primary_color,
  JSON_EXTRACT(text_colors, '$.primary') as text_color
FROM component_design_tokens
WHERE baseline_id = 'baseline-button-001';

-- 查找使用特定颜色的组件
SELECT component_name 
FROM component_design_tokens
WHERE color_palette LIKE '%#FF9419%';

-- 获取组件的视觉问题
SELECT 
  vps.expected_styles,
  vps.actual_styles,
  csr.selector
FROM visual_problem_styles vps
JOIN component_style_rules csr ON vps.style_rule_id = csr.id
WHERE vps.problem_id IN (
  SELECT id FROM diagnostic_problems 
  WHERE baseline_id = 'baseline-button-001'
);
```

## 6. 限制与问题

### 6.1 设计限制
- **Token粒度**: 所有Token信息混在JSON中，无法单独版本管理
- **查询性能**: 需要JSON解析，大量数据时性能差
- **类型安全**: TEXT字段存储JSON，缺乏数据库级别的类型验证
- **主题支持**: 无内置的主题切换机制

### 6.2 扩展性问题
- **A/B系统**: 无法优雅处理多个设计系统共存
- **Token继承**: 无法表达Token之间的继承关系
- **迁移路径**: 缺乏系统化的设计迁移支持

### 6.3 维护挑战
- **数据一致性**: JSON数据的更新需要整体替换
- **版本追踪**: 设计变更历史难以追踪
- **跨组件复用**: Token无法在组件间共享

## 7. 与其他系统的集成

```mermaid
graph LR
    A[组件文件] --> B[静态分析器]
    B --> C[component_design_tokens]
    C --> D[分析系统]
    D --> E[diagnostic_problems]
    E --> F[visual_problem_styles]
    F --> G[建议生成]
```

## 8. 索引策略

```sql
-- 性能优化索引
CREATE INDEX idx_component_tokens_baseline ON component_design_tokens(baseline_id);
CREATE INDEX idx_component_tokens_design_system ON component_design_tokens(design_system_id);
CREATE INDEX idx_style_rules_component ON component_style_rules(component_token_id);
CREATE INDEX idx_visual_problems_style ON visual_problem_styles(style_rule_id);
```

## 9. 迁移考虑

如需迁移到Token-first架构：
1. 解析现有JSON字段，提取独立Token
2. 建立Token表和关联关系
3. 保留原表作为缓存/快照
4. 逐步迁移查询逻辑

—— 以上为MDT平台当前设计系统的实现规范。