-- Update Button component diagnostic problems with diff information
UPDATE diagnostic_problems 
SET quick_fix = '{
  "solution": "Wrap with React.memo",
  "effort": "low",
  "confidence": 85,
  "estimatedTime": "5分钟",
  "diff": {
    "before": "export default Button;",
    "after": "export default React.memo(Button);",
    "file": "src/common/components/Button/index.jsx",
    "line": 56
  },
  "alternativeDiff": {
    "before": "export default Button;",
    "after": "export default React.memo(Button, (prevProps, nextProps) => {\n  // 自定义比较逻辑：只在这些属性变化时重新渲染\n  return prevProps.loading === nextProps.loading &&\n         prevProps.disabled === nextProps.disabled &&\n         prevProps.children === nextProps.children &&\n         prevProps.onClick === nextProps.onClick;\n});",
    "file": "src/common/components/Button/index.jsx",
    "line": 56
  }
}',
root_cause = '{
  "issue": "No memoization",
  "parentUpdates": "frequent",
  "where": {
    "file": "src/common/components/Button/index.jsx",
    "line": 28,
    "code": "const Button = ({ type, theme, loading, disabled, icon, block, className, onClick, children }) => {\n  const buttonClass = cn(\n    styles.button,\n    styles[type],\n    styles[theme],\n    {\n      [styles.loading]: loading,\n      [styles.disabled]: disabled,\n      [styles.block]: block\n    },\n    className\n  );\n\n  return (\n    <button className={buttonClass} onClick={onClick} disabled={disabled || loading}>\n      {loading && <span className={styles.spinner} />}\n      {icon && <span className={styles.icon}>{icon}</span>}\n      {children && <span className={styles.text}>{children}</span>}\n    </button>\n  );\n};"
  }
}'
WHERE id = 'dp-button-001';

UPDATE diagnostic_problems 
SET quick_fix = '{
  "solution": "Add aria-label prop when icon-only",
  "effort": "low",
  "confidence": 85,
  "estimatedTime": "10分钟",
  "diff": {
    "before": "const Button = ({ type, theme, loading, disabled, icon, block, className, onClick, children }) => {\n  // ...\n  return (\n    <button className={buttonClass} onClick={onClick} disabled={disabled || loading}>\n      {loading && <span className={styles.spinner} />}\n      {icon && <span className={styles.icon}>{icon}</span>}\n      {children && <span className={styles.text}>{children}</span>}\n    </button>\n  );\n};",
    "after": "const Button = ({ type, theme, loading, disabled, icon, block, className, onClick, children, ariaLabel }) => {\n  // ...\n  return (\n    <button \n      className={buttonClass} \n      onClick={onClick} \n      disabled={disabled || loading}\n      aria-label={ariaLabel || (icon && !children ? ''按钮'' : undefined)}\n    >\n      {loading && <span className={styles.spinner} />}\n      {icon && <span className={styles.icon}>{icon}</span>}\n      {children && <span className={styles.text}>{children}</span>}\n    </button>\n  );\n};",
    "file": "src/common/components/Button/index.jsx",
    "line": 28
  },
  "usageExample": {
    "before": "<Button icon={<CloseOutlined />} onClick={handleClose} />",
    "after": "<Button icon={<CloseOutlined />} onClick={handleClose} ariaLabel=\"关闭\" />",
    "file": "使用示例",
    "line": 1
  }
}',
root_cause = '{
  "issue": "No automatic aria-label for icon buttons",
  "where": {
    "file": "src/common/components/Button/index.jsx",
    "line": 45,
    "code": "return (\n    <button className={buttonClass} onClick={onClick} disabled={disabled || loading}>\n      {loading && <span className={styles.spinner} />}\n      {icon && <span className={styles.icon}>{icon}</span>}\n      {children && <span className={styles.text}>{children}</span>}\n    </button>\n  );"
  }
}'
WHERE id = 'dp-button-002';