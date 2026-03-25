-- Seed data for BEEP webapp Button component baseline

-- Clear existing Button baseline if exists
DELETE FROM baselines WHERE component_name = 'Button' AND component_path LIKE '%beep-v1-webapp%';

-- Insert BEEP Button baseline
INSERT INTO baselines (
  id,
  component_name,
  component_path,
  props_variations,
  status,
  file_size,
  usage_count,
  version,
  branch,
  commit_hash,
  created_at,
  updated_at
) VALUES (
  'baseline-button-beep-001',
  'Button',
  'beep-v1-webapp/src/common/components/Button/index.jsx',
  12, -- Different prop combinations
  'healthy',
  3.2, -- KB
  242, -- Based on analysis
  '1.0.0',
  'develop',
  'abc123',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert version history for Button
INSERT INTO version_history (
  id,
  baseline_id,
  commit_hash,
  author,
  message,
  timestamp,
  lines_added,
  lines_deleted,
  change_type
) VALUES
  ('vh-button-001', 'baseline-button-beep-001', 'abc123', 'Wendy Lin', 'feat: Add loading state to Button', datetime('now', '-30 days'), 15, 3, 'normal'),
  ('vh-button-002', 'baseline-button-beep-001', 'def456', 'Wendy Lin', 'fix: Button icon alignment issue', datetime('now', '-20 days'), 8, 5, 'normal'),
  ('vh-button-003', 'baseline-button-beep-001', 'ghi789', 'Wendy Lin', 'style: Update Button hover states', datetime('now', '-10 days'), 12, 10, 'normal');

-- Insert diagnostic problems
INSERT INTO diagnostic_problems (
  id,
  baseline_id,
  severity,
  category,
  impact,
  affected_scenarios,
  reproduction,
  frequency,
  evidence,
  root_cause,
  quick_fix
) VALUES
  (
    'dp-button-001',
    'baseline-button-beep-001',
    'warning',
    'performance',
    'Minor performance degradation in lists with many buttons',
    'Product lists, menu items with multiple buttons',
    '1. Place Button in frequently updating parent\n2. Observe re-renders with React DevTools',
    'Common in lists',
    '{"renderCount": 45, "avgRenderTime": "2ms"}',
    '{"issue": "No memoization", "parentUpdates": "frequent"}',
    '{"solution": "Wrap with React.memo", "effort": "low"}'
  ),
  (
    'dp-button-002',
    'baseline-button-beep-001',
    'info',
    'accessibility',
    'Screen readers cannot determine button purpose',
    'Icon-only action buttons',
    '1. Create button with only icon prop\n2. Check with screen reader',
    'Occasional',
    '{"occurrences": 12, "locations": ["filters", "actions"]}',
    '{"issue": "No automatic aria-label for icon buttons"}',
    '{"solution": "Add aria-label prop when icon-only", "effort": "low"}'
  );

-- Insert suggestions
INSERT INTO suggestions (
  id,
  baseline_id,
  suggestion_type,
  content
) VALUES
  (
    'sg-button-001',
    'baseline-button-beep-001',
    'performance',
    '{"title": "Add React.memo for performance", "description": "Memoize Button component to prevent unnecessary re-renders", "impact": "high", "effort": "low", "priority": "medium", "code_example": "export default React.memo(Button);", "implementation_guide": "1. Wrap Button export with React.memo\\n2. Add custom comparison function if needed\\n3. Test in high-frequency update scenarios"}'
  ),
  (
    'sg-button-002',
    'baseline-button-beep-001',
    'feature',
    '{"title": "Add ripple effect animation", "description": "Enhance user feedback with material design ripple effect", "impact": "medium", "effort": "medium", "priority": "low", "visual_example": {"type": "animation", "duration": "300ms", "effect": "ripple"}, "implementation_guide": "1. Create ripple animation CSS\\n2. Add touch event handlers\\n3. Implement ripple component"}'
  ),
  (
    'sg-button-003',
    'baseline-button-beep-001',
    'api',
    '{"title": "Support as prop for polymorphic button", "description": "Allow Button to render as different elements (a, div, etc)", "impact": "high", "effort": "medium", "priority": "medium", "code_example": "<Button as=\\"a\\" href=\\"/path\\">Link Button</Button>", "implementation_guide": "1. Add \\"as\\" prop to PropTypes\\n2. Use dynamic element rendering\\n3. Ensure prop forwarding works correctly"}'
  );

-- Create status view for Button
CREATE VIEW IF NOT EXISTS button_status AS
SELECT 
  b.id,
  b.component_name,
  b.component_path,
  b.status,
  b.usage_count,
  COUNT(DISTINCT dp.id) as problem_count,
  COUNT(DISTINCT s.id) as suggestion_count,
  b.updated_at
FROM baselines b
LEFT JOIN diagnostic_problems dp ON b.id = dp.baseline_id
LEFT JOIN suggestions s ON b.id = s.baseline_id
WHERE b.component_name = 'Button'
GROUP BY b.id;