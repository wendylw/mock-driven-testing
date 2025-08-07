-- Component Variants Analysis Schema
-- This schema defines how to identify and analyze variants within Pure Components

-- Table to store variant identification patterns for each component type
CREATE TABLE IF NOT EXISTS component_variant_patterns (
  id VARCHAR(50) PRIMARY KEY,
  component_type VARCHAR(50) NOT NULL, -- e.g., 'Button', 'Input', 'Select'
  variant_dimension VARCHAR(50) NOT NULL, -- e.g., 'type', 'size', 'theme', 'state'
  pattern_type VARCHAR(30) NOT NULL, -- 'prop', 'class', 'attribute', 'combination'
  pattern_value TEXT NOT NULL, -- JSON: pattern definition
  priority INTEGER DEFAULT 0, -- Higher priority patterns are checked first
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table to store identified variants for each baseline
CREATE TABLE IF NOT EXISTS component_variants (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  variant_key VARCHAR(100) NOT NULL, -- e.g., 'primary-default', 'secondary-small'
  variant_dimensions TEXT NOT NULL, -- JSON: {type: 'primary', theme: 'default'}
  variant_styles TEXT, -- JSON: computed styles for this variant
  usage_count INTEGER DEFAULT 0,
  file_locations TEXT, -- JSON: array of files where this variant is used
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- Table to store variant-specific issues
CREATE TABLE IF NOT EXISTS variant_issues (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  variant_id VARCHAR(50) NOT NULL,
  issue_type VARCHAR(50) NOT NULL, -- 'color_contrast', 'spacing', 'sizing', etc.
  severity VARCHAR(20) NOT NULL,
  details TEXT NOT NULL, -- JSON: detailed issue information
  suggested_fix TEXT, -- JSON: fix recommendation
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES component_variants(id) ON DELETE CASCADE
);

-- Insert default variant patterns for common components
INSERT OR REPLACE INTO component_variant_patterns (id, component_type, variant_dimension, pattern_type, pattern_value, priority) VALUES
-- Button variants
('cvp-button-type', 'Button', 'type', 'prop', '{"propName": "type", "values": ["primary", "secondary", "text", "link", "ghost"]}', 100),
('cvp-button-size', 'Button', 'size', 'prop', '{"propName": "size", "values": ["small", "normal", "large"]}', 90),
('cvp-button-theme', 'Button', 'theme', 'prop', '{"propName": "theme", "values": ["default", "danger", "info", "success", "warning"]}', 80),
('cvp-button-state', 'Button', 'state', 'attribute', '{"attributes": ["disabled", "loading", "active", "hover", "focus"]}', 70),

-- Input variants
('cvp-input-type', 'Input', 'type', 'prop', '{"propName": "type", "values": ["text", "password", "email", "number", "search"]}', 100),
('cvp-input-size', 'Input', 'size', 'prop', '{"propName": "size", "values": ["small", "normal", "large"]}', 90),
('cvp-input-state', 'Input', 'state', 'attribute', '{"attributes": ["disabled", "readonly", "error", "focus"]}', 80),

-- Select variants
('cvp-select-size', 'Select', 'size', 'prop', '{"propName": "size", "values": ["small", "normal", "large"]}', 100),
('cvp-select-mode', 'Select', 'mode', 'prop', '{"propName": "mode", "values": ["single", "multiple", "tags"]}', 90),
('cvp-select-state', 'Select', 'state', 'attribute', '{"attributes": ["disabled", "loading", "open"]}', 80),

-- Card variants
('cvp-card-type', 'Card', 'type', 'prop', '{"propName": "type", "values": ["default", "inner", "bordered"]}', 100),
('cvp-card-size', 'Card', 'size', 'prop', '{"propName": "size", "values": ["default", "small"]}', 90),

-- Modal variants
('cvp-modal-size', 'Modal', 'size', 'prop', '{"propName": "width", "ranges": [{"name": "small", "min": 0, "max": 520}, {"name": "medium", "min": 521, "max": 768}, {"name": "large", "min": 769, "max": 1200}]}', 100),
('cvp-modal-type', 'Modal', 'type', 'prop', '{"propName": "type", "values": ["default", "confirm", "info", "success", "error", "warning"]}', 90);