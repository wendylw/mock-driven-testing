-- Pure Component 智能分析系统数据库结构
-- MySQL/MariaDB

-- 创建数据库
CREATE DATABASE IF NOT EXISTS mdt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mdt;

-- 基准表
CREATE TABLE IF NOT EXISTS baselines (
  id VARCHAR(50) PRIMARY KEY,
  component_name VARCHAR(100) NOT NULL,
  component_path VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'healthy',
  usage_count INT DEFAULT 0,
  last_analyzed TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- 额外字段
  version VARCHAR(20),
  branch VARCHAR(50) DEFAULT 'develop',
  commit_hash VARCHAR(40),
  file_size DECIMAL(10,2) DEFAULT 0, -- KB
  snapshot_count INT DEFAULT 0,
  props_variations INT DEFAULT 0,
  
  -- 索引
  INDEX idx_component_name (component_name),
  INDEX idx_status (status),
  INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 分析结果表
CREATE TABLE IF NOT EXISTS analysis_results (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  analysis_type VARCHAR(20) NOT NULL,
  result_data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 外键约束
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE,
  
  -- 索引
  INDEX idx_baseline_id (baseline_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  evidence JSON,
  root_cause JSON,
  quick_fix JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  
  -- 外键约束
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE,
  
  -- 索引
  INDEX idx_baseline_severity (baseline_id, severity),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 建议记录表
CREATE TABLE IF NOT EXISTS suggestions (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  suggestion_type VARCHAR(30) NOT NULL,
  content JSON NOT NULL,
  applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 外键约束
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE,
  
  -- 索引
  INDEX idx_baseline_type (baseline_id, suggestion_type),
  INDEX idx_applied (applied)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 学习模式表
CREATE TABLE IF NOT EXISTS learning_patterns (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  pattern_type VARCHAR(30) NOT NULL,
  pattern_data JSON NOT NULL,
  confidence INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- 索引
  INDEX idx_user_type (user_id, pattern_type),
  INDEX idx_confidence (confidence)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 版本历史表
CREATE TABLE IF NOT EXISTS version_history (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  commit_hash VARCHAR(40) NOT NULL,
  author VARCHAR(100),
  message TEXT,
  lines_added INT DEFAULT 0,
  lines_deleted INT DEFAULT 0,
  change_type VARCHAR(20) DEFAULT 'normal',
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 外键约束
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE,
  
  -- 索引
  INDEX idx_baseline_timestamp (baseline_id, timestamp),
  INDEX idx_commit (commit_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 分析任务队列表
CREATE TABLE IF NOT EXISTS analysis_queue (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  priority VARCHAR(10) DEFAULT 'normal',
  status VARCHAR(20) DEFAULT 'queued',
  progress INT DEFAULT 0,
  current_step VARCHAR(100),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  
  -- 外键约束
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE,
  
  -- 索引
  INDEX idx_status_priority (status, priority),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 交互会话表
CREATE TABLE IF NOT EXISTS interactive_sessions (
  id VARCHAR(50) PRIMARY KEY,
  baseline_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50),
  session_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  
  -- 外键约束
  FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE,
  
  -- 索引
  INDEX idx_baseline_user (baseline_id, user_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户表（简化版）
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'developer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- 索引
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建视图：基准状态概览
CREATE OR REPLACE VIEW baseline_status_overview AS
SELECT 
  b.id,
  b.component_name,
  b.status,
  b.usage_count,
  b.last_analyzed,
  COUNT(DISTINCT dp.id) as problem_count,
  COUNT(DISTINCT s.id) as suggestion_count,
  MAX(dp.severity = 'critical') as has_critical_issues
FROM baselines b
LEFT JOIN diagnostic_problems dp ON b.id = dp.baseline_id AND dp.resolved_at IS NULL
LEFT JOIN suggestions s ON b.id = s.baseline_id AND s.applied = FALSE
GROUP BY b.id;