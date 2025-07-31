-- Pure Component 智能分析系统数据库结构
-- SQLite版本

-- 基准表
CREATE TABLE IF NOT EXISTS baselines (
  id VARCHAR(50) PRIMARY KEY,
  component_name VARCHAR(100) NOT NULL,
  component_path VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'healthy',
  usage_count INTEGER DEFAULT 0,
  last_analyzed DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  version VARCHAR(20),
  branch VARCHAR(50) DEFAULT 'develop',
  commit_hash VARCHAR(40),
  file_size DECIMAL(10,2) DEFAULT 0,
  snapshot_count INTEGER DEFAULT 0,
  props_variations INTEGER DEFAULT 0
);

-- 分析结果表
CREATE TABLE IF NOT EXISTS analysis_results (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  analysis_type VARCHAR(20),
  result_data TEXT,
  status_data TEXT,
  diagnostic_data TEXT,
  suggestion_data TEXT,
  duration INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- 问题记录表
CREATE TABLE IF NOT EXISTS diagnostic_problems (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  category VARCHAR(30) NOT NULL,
  impact TEXT,
  affected_scenarios TEXT,
  reproduction TEXT,
  frequency VARCHAR(100),
  evidence TEXT,
  root_cause TEXT,
  quick_fix TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- 建议记录表
CREATE TABLE IF NOT EXISTS suggestions (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  suggestion_type VARCHAR(30) NOT NULL,
  content TEXT NOT NULL,
  applied INTEGER DEFAULT 0,
  applied_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- 学习模式表
CREATE TABLE IF NOT EXISTS learning_patterns (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  pattern_type VARCHAR(30) NOT NULL,
  pattern_data TEXT NOT NULL,
  confidence INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 版本历史表
CREATE TABLE IF NOT EXISTS version_history (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  commit_hash VARCHAR(40) NOT NULL,
  author VARCHAR(100),
  message TEXT,
  lines_added INTEGER DEFAULT 0,
  lines_deleted INTEGER DEFAULT 0,
  change_type VARCHAR(20) DEFAULT 'normal',
  timestamp DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- 分析任务队列表
CREATE TABLE IF NOT EXISTS analysis_queue (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  priority VARCHAR(10) DEFAULT 'normal',
  status VARCHAR(20) DEFAULT 'queued',
  progress INTEGER DEFAULT 0,
  current_step VARCHAR(100),
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME NULL,
  completed_at DATETIME NULL,
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- 交互会话表
CREATE TABLE IF NOT EXISTS interactive_sessions (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50),
  session_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- 用户表（简化版）
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'developer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_baselines_component_name ON baselines(component_name);
CREATE INDEX IF NOT EXISTS idx_baselines_status ON baselines(status);
CREATE INDEX IF NOT EXISTS idx_baselines_updated_at ON baselines(updated_at);
CREATE INDEX IF NOT EXISTS idx_analysis_baseline_id ON analysis_results(baseline_id);
CREATE INDEX IF NOT EXISTS idx_analysis_created_at ON analysis_results(created_at);
CREATE INDEX IF NOT EXISTS idx_problems_baseline_severity ON diagnostic_problems(baseline_id, severity);
CREATE INDEX IF NOT EXISTS idx_problems_category ON diagnostic_problems(category);
CREATE INDEX IF NOT EXISTS idx_suggestions_baseline_type ON suggestions(baseline_id, suggestion_type);
CREATE INDEX IF NOT EXISTS idx_suggestions_applied ON suggestions(applied);
CREATE INDEX IF NOT EXISTS idx_patterns_user_type ON learning_patterns(user_id, pattern_type);
CREATE INDEX IF NOT EXISTS idx_patterns_confidence ON learning_patterns(confidence);
CREATE INDEX IF NOT EXISTS idx_version_baseline_timestamp ON version_history(baseline_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_version_commit ON version_history(commit_hash);
CREATE INDEX IF NOT EXISTS idx_queue_status_priority ON analysis_queue(status, priority);
CREATE INDEX IF NOT EXISTS idx_queue_created_at ON analysis_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_baseline_user ON interactive_sessions(baseline_id, user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON interactive_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);