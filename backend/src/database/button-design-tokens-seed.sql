-- Button Component Design Tokens from BEEP v1 webapp
-- Based on actual values from tailwind.config.js and Button.module.scss

INSERT OR REPLACE INTO component_design_tokens (
  id, 
  baseline_id, 
  design_system_id,
  component_name,
  component_path,
  font_family,
  font_sizes,
  font_weights,
  color_palette,
  padding_values,
  border_radius,
  heights,
  transitions,
  hover_styles,
  disabled_styles,
  component_variants,
  last_extracted
) VALUES (
  'cdt-button-001',
  'baseline-button-001',
  'ds-beep-001',
  'Button',
  'src/common/components/Button/index.jsx',
  'Lato, "Open Sans", Helvetica, Arial, sans-serif',
  JSON('{"small": "14px", "normal": "16px", "large": "18px"}'),
  JSON('{"normal": "400", "bold": "700"}'),
  JSON('{
    "orange": {"DEFAULT": "#FF9419", "dark": "#FC7118", "light": "#FEC788"},
    "red": {"DEFAULT": "#E74C3C", "dark": "#C0392B", "light": "#EC7063"},
    "blue": {"DEFAULT": "#3498DB", "dark": "#2874A6", "light": "#5DADE2"},
    "gray": {"400": "#DEDEDF", "600": "#9E9E9E", "700": "#757575", "800": "#303030", "900": "#212121"},
    "white": "#FFFFFF"
  }'),
  JSON('{
    "primary-normal": "12px 16px",
    "primary-small": "12px 16px",
    "secondary-normal": "12px 16px", 
    "secondary-small": "12px 16px",
    "text-all": "8px"
  }'),
  JSON('{"default": "8px", "sm": "4px", "lg": "12px"}'),
  JSON('{"small": "40px", "normal": "50px", "text": "auto"}'),
  JSON('{"default": "all 150ms ease-in-out"}'),
  JSON('{
    "primary": {
      "background": "var(--color-dark)",
      "borderColor": "var(--color-dark)"
    },
    "secondary": {
      "borderColor": "var(--color-dark)",
      "color": "var(--color-dark)"
    },
    "text": {
      "color": "var(--color-dark)"
    }
  }'),
  JSON('{
    "primary": {
      "background": "#DEDEDF",
      "borderColor": "#DEDEDF",
      "color": "#FFFFFF",
      "cursor": "not-allowed"
    },
    "secondary": {
      "borderColor": "#DEDEDF",
      "color": "#DEDEDF",
      "cursor": "not-allowed"
    },
    "text": {
      "color": "#DEDEDF",
      "cursor": "not-allowed"
    }
  }'),
  JSON('{
    "primary-default": {
      "background": "#FF9419",
      "border": "1px solid #FF9419",
      "color": "#FFFFFF",
      "padding": "12px 16px",
      "borderRadius": "8px",
      "fontWeight": "700",
      "letterSpacing": "0.05em"
    },
    "primary-danger": {
      "background": "#E74C3C",
      "border": "1px solid #E74C3C",
      "color": "#FFFFFF",
      "padding": "12px 16px",
      "borderRadius": "8px",
      "fontWeight": "700",
      "letterSpacing": "0.05em"
    },
    "secondary-default": {
      "background": "#FFFFFF",
      "border": "1px solid #FF9419",
      "color": "#FF9419",
      "padding": "12px 16px",
      "borderRadius": "8px",
      "fontWeight": "700",
      "letterSpacing": "0.05em"
    },
    "text-default": {
      "background": "transparent",
      "border": "none",
      "color": "#FF9419",
      "padding": "8px",
      "borderRadius": "8px",
      "fontWeight": "700",
      "letterSpacing": "0.025em"
    }
  }'),
  CURRENT_TIMESTAMP
);