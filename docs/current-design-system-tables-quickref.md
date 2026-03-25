# MDT平台 Design System 数据表速查（用途一句话版）

> 目的：快速记住每张表"是干嘛的"。当前版本为现有实现的简化设计。

- design_systems（设计系统主表）
  - 存储项目的设计系统配置信息（如tailwind.config.js路径、预处理器类型等）。

- component_design_tokens（组件设计令牌）
  - 存储每个组件的所有计算后的CSS值（颜色、字体、间距、边框等），以JSON格式保存，避免前端解析。

- component_style_rules（样式规则表）
  - 存储组件的具体CSS规则，包括选择器、媒体查询、计算后的样式等。

- visual_problem_styles（视觉问题映射）
  - 将诊断出的视觉问题与具体的样式规则关联，记录期望值vs实际值的差异。

- font_resources（字体资源表）
  - 管理设计系统使用的字体资源（Google字体、本地字体、系统字体等）。

## 存储模式特点

1. **大JSON模式**: 大部分设计信息存储在JSON字段中（如`color_palette TEXT`包含所有颜色）
2. **粗粒度设计**: 每个组件一条记录，包含该组件的所有设计令牌
3. **静态提取**: 通过`extraction_method`标识数据是静态分析还是运行时提取
4. **问题关联**: 通过`visual_problem_styles`将视觉问题与样式规则关联

## 与分析系统的关系

- `component_design_tokens.baseline_id` → 关联到组件基准线
- `component_design_tokens.design_system_id` → 关联到设计系统
- `visual_problem_styles.problem_id` → 关联到诊断问题
- `visual_problem_styles.style_rule_id` → 关联到具体样式规则

## 局限性

- Token未细粒度拆分，查询需要JSON解析
- 无法支持Token级别的版本管理
- 主题切换需要整体替换JSON数据
- A/B系统迁移缺乏系统性支持