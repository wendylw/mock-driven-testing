-- Pure Component Design System Database Schema
-- Store computed CSS values for each component to avoid frontend parsing

-- Design System Table - Store the overall design system for each project
CREATE TABLE IF NOT EXISTS design_systems (
  id VARCHAR(50) PRIMARY KEY,
  project_name VARCHAR(100) NOT NULL,
  project_path VARCHAR(255) NOT NULL,
  config_file_path VARCHAR(255), -- e.g., tailwind.config.js path
  preprocessor VARCHAR(20), -- sass, less, postcss, etc.
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Component Design Tokens - Store computed CSS values for each component
CREATE TABLE IF NOT EXISTS component_design_tokens (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  design_system_id VARCHAR(50) NOT NULL,
  component_name VARCHAR(100) NOT NULL,
  component_path VARCHAR(255) NOT NULL,
  
  -- Typography
  font_family TEXT, -- Computed font stack
  font_sizes TEXT, -- JSON: {"small": "14px", "normal": "16px", "large": "18px"}
  font_weights TEXT, -- JSON: {"normal": "400", "bold": "700"}
  line_heights TEXT, -- JSON: {"normal": "1.4", "relaxed": "1.5"}
  letter_spacings TEXT, -- JSON: {"normal": "0", "wide": "0.01em"}
  
  -- Colors
  color_palette TEXT, -- JSON: Complete color mapping
  primary_colors TEXT, -- JSON: {"default": "#FF9419", "dark": "#FC7118", "light": "#FEC788"}
  text_colors TEXT, -- JSON: {"primary": "#303030", "secondary": "#666", "disabled": "#9E9E9E"}
  background_colors TEXT, -- JSON: {"primary": "#FF9419", "disabled": "#DEDEDF"}
  
  -- Spacing
  padding_values TEXT, -- JSON: {"small": "8px 16px", "normal": "12px 16px", "large": "16px 24px"}
  margin_values TEXT, -- JSON: spacing values
  gap_values TEXT, -- JSON: gap values for flex/grid
  
  -- Borders
  border_radius TEXT, -- JSON: {"default": "8px", "small": "4px", "large": "12px"}
  border_widths TEXT, -- JSON: {"thin": "1px", "medium": "2px"}
  border_styles TEXT, -- JSON: border style mappings
  
  -- Sizing
  heights TEXT, -- JSON: {"small": "40px", "normal": "50px", "large": "60px"}
  widths TEXT, -- JSON: width values
  min_max_sizes TEXT, -- JSON: min/max width/height
  
  -- Layout
  display_types TEXT, -- JSON: display property variations
  flex_properties TEXT, -- JSON: flex-related properties
  grid_properties TEXT, -- JSON: grid-related properties
  
  -- Effects
  box_shadows TEXT, -- JSON: {"default": "0 2px 16px rgba(0,0,0,0.06)", ...}
  transitions TEXT, -- JSON: {"default": "all 0.15s ease", ...}
  transforms TEXT, -- JSON: transform values
  opacity_values TEXT, -- JSON: opacity levels
  
  -- States
  hover_styles TEXT, -- JSON: Complete hover state styles
  active_styles TEXT, -- JSON: Complete active state styles
  focus_styles TEXT, -- JSON: Complete focus state styles
  disabled_styles TEXT, -- JSON: Complete disabled state styles
  
  -- Responsive
  breakpoints TEXT, -- JSON: {"sm": "420px", "md": "770px", "lg": "1030px"}
  responsive_overrides TEXT, -- JSON: Responsive style overrides
  
  -- Component-specific
  component_variants TEXT, -- JSON: All variants (primary, secondary, etc.)
  component_sizes TEXT, -- JSON: Size variations with full styles
  custom_properties TEXT, -- JSON: Any component-specific CSS custom properties
  
  -- Metadata
  last_extracted DATETIME DEFAULT CURRENT_TIMESTAMP,
  extraction_method VARCHAR(50), -- 'static_analysis', 'runtime_extraction', 'manual'
  
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE,
  FOREIGN KEY (design_system_id) REFERENCES design_systems(id) ON DELETE CASCADE
);

-- Component Style Rules - Store actual CSS rules for each component state
CREATE TABLE IF NOT EXISTS component_style_rules (
  id VARCHAR(50) PRIMARY KEY,
  component_token_id VARCHAR(50) NOT NULL,
  selector VARCHAR(255) NOT NULL, -- e.g., '.btn-primary', '.btn-primary:hover'
  rule_type VARCHAR(50), -- 'base', 'hover', 'active', 'disabled', 'responsive'
  media_query VARCHAR(255), -- e.g., '@media (min-width: 768px)'
  computed_styles TEXT, -- JSON: Complete computed CSS properties
  source_reference TEXT, -- JSON: {"file": "Button.module.scss", "line": 89}
  specificity_score INTEGER, -- CSS specificity score
  
  FOREIGN KEY (component_token_id) REFERENCES component_design_tokens(id) ON DELETE CASCADE
);

-- Visual Problem Mappings - Link visual problems to specific style rules
CREATE TABLE IF NOT EXISTS visual_problem_styles (
  id VARCHAR(50) PRIMARY KEY,
  problem_id VARCHAR(50) NOT NULL,
  style_rule_id VARCHAR(50) NOT NULL,
  expected_styles TEXT, -- JSON: Expected CSS values
  actual_styles TEXT, -- JSON: Actual CSS values
  diff_details TEXT, -- JSON: Detailed diff information
  
  FOREIGN KEY (problem_id) REFERENCES diagnostic_problems(id) ON DELETE CASCADE,
  FOREIGN KEY (style_rule_id) REFERENCES component_style_rules(id) ON DELETE CASCADE
);

-- Font Resources - Store font information separately
CREATE TABLE IF NOT EXISTS font_resources (
  id VARCHAR(50) PRIMARY KEY,
  design_system_id VARCHAR(50) NOT NULL,
  font_name VARCHAR(100) NOT NULL,
  font_source VARCHAR(20), -- 'google', 'local', 'system', 'adobe'
  font_url TEXT, -- URL for web fonts
  font_fallbacks TEXT, -- Fallback font stack
  font_display VARCHAR(20), -- font-display value
  preload BOOLEAN DEFAULT FALSE,
  
  FOREIGN KEY (design_system_id) REFERENCES design_systems(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_component_tokens_baseline ON component_design_tokens(baseline_id);
CREATE INDEX IF NOT EXISTS idx_component_tokens_design_system ON component_design_tokens(design_system_id);
CREATE INDEX IF NOT EXISTS idx_style_rules_component ON component_style_rules(component_token_id);
CREATE INDEX IF NOT EXISTS idx_style_rules_selector ON component_style_rules(selector);
CREATE INDEX IF NOT EXISTS idx_visual_problems_style ON visual_problem_styles(style_rule_id);
CREATE INDEX IF NOT EXISTS idx_font_resources_system ON font_resources(design_system_id);

-- Example data for BEEP Button component
INSERT OR REPLACE INTO design_systems (
  id, project_name, project_path, config_file_path, preprocessor
) VALUES (
  'ds-beep-001',
  'beep-v1-webapp',
  '/Users/wendylin/workspace/beep-v1-webapp',
  '/Users/wendylin/workspace/beep-v1-webapp/tailwind.config.js',
  'sass'
);

INSERT OR REPLACE INTO component_design_tokens (
  id, baseline_id, design_system_id, component_name, component_path,
  font_family, font_sizes, font_weights, color_palette,
  padding_values, border_radius, heights, transitions,
  hover_styles, disabled_styles, component_variants
) VALUES (
  'cdt-button-001',
  'baseline-button-001',
  'ds-beep-001',
  'Button',
  'src/common/components/Button/index.jsx',
  
  -- Typography (computed from Tailwind + SCSS)
  'Lato, "Open Sans", Helvetica, Arial, sans-serif',
  '{"small": "14px", "normal": "16px", "large": "18px"}',
  '{"normal": "400", "bold": "700", "black": "900"}',
  
  -- Colors (computed values)
  '{
    "orange": {"DEFAULT": "#FF9419", "dark": "#FC7118", "light": "#FEC788"},
    "gray": {"400": "#DEDEDF", "600": "#9E9E9E", "800": "#303030"},
    "white": "#FFFFFF"
  }',
  
  -- Spacing (computed from tw-py-12 tw-px-16)
  '{
    "primary": {"small": "10px 16px", "normal": "12px 16px"},
    "secondary": {"small": "10px 16px", "normal": "12px 16px"},
    "text": {"all": "8px"}
  }',
  
  -- Border radius (computed from tw-rounded)
  '{"default": "8px", "small": "4px", "large": "12px"}',
  
  -- Heights
  '{"small": "40px", "normal": "50px"}',
  
  -- Transitions
  '{"default": "all 0.15s ease-in-out"}',
  
  -- Hover styles (complete computed styles)
  '{
    "primary": {
      "background": "#FC7118",
      "borderColor": "#FC7118"
    },
    "secondary": {
      "borderColor": "#FC7118",
      "color": "#FC7118"
    }
  }',
  
  -- Disabled styles (complete computed styles)
  '{
    "all": {
      "background": "#DEDEDF",
      "borderColor": "#DEDEDF",
      "color": "#9E9E9E",
      "cursor": "not-allowed"
    }
  }',
  
  -- Component variants (complete style sets)
  '{
    "type-primary-default": {
      "background": "#FF9419",
      "color": "#FFFFFF",
      "border": "1px solid #FF9419"
    },
    "type-secondary-default": {
      "background": "#FFFFFF",
      "color": "#FF9419",
      "border": "1px solid #FF9419"
    },
    "type-text-default": {
      "background": "transparent",
      "color": "#FF9419",
      "border": "1px solid transparent"
    }
  }'
);