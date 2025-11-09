export interface QueryMetrics {
  totalQueries: number;
  successRate: number;
  failedQueries: number;
  avgResponseTime: number;
}

export interface QueryHistory {
  id: string;
  question: string;
  timestamp: string;
  executionTime: number;
  status: 'success' | 'error';
}

export interface HealthStatus {
  backend: 'healthy' | 'unhealthy';
  clickhouse: 'healthy' | 'unhealthy';
  llm: 'healthy' | 'unhealthy';
}

export interface StreamEvent {
  type: 'status' | 'sql' | 'result' | 'complete' | 'error';
  data?: any;
  message?: string;
  sql?: string;
  result?: any[];
  execution_time?: number;
  error?: string;
}
