export interface BaselineRecord {
  id: string;
  component_name: string;
  component_path: string;
  status: 'healthy' | 'outdated' | 'corrupted';
  usage_count: number;
  last_analyzed: Date | null;
  created_at: Date;
  updated_at: Date;
  version?: string;
  branch?: string;
  commit_hash?: string;
  file_size?: number;
  snapshot_count?: number;
  props_variations?: number;
}

export interface VersionRecord {
  id: string;
  baseline_id: string;
  commit_hash: string;
  author: string;
  message: string;
  lines_added: number;
  lines_deleted: number;
  change_type: 'normal' | 'breaking' | 'refactoring';
  timestamp: Date;
}

export interface StatusDetail {
  type: 'healthy' | 'outdated' | 'corrupted' | 'deleted' | 'unstable' | 'drifting' | 'optimizable';
  label: string;
  badgeStatus?: string;
  hasDetail: boolean;
  detailTitle?: string;
  detailMessage?: string;
}

export interface BaselineMetrics {
  usageCount: number;
  lastUpdated: Date;
  snapshotCount: number;
  size: number;
}

export interface BaselineStatus {
  baselineId: string;
  component: string;
  status: string;
  statusLabel: string;
  statusDetail: StatusDetail;
  metrics: BaselineMetrics;
}