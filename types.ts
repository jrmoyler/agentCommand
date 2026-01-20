
export type AgentStatus = 'idle' | 'busy' | 'error' | 'offline';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  tokensUsed: number;
  uptime: string;
  specialization: string;
  description: string;
  tags: string[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface SwarmStats {
  activeAgents: number;
  totalTokens: number;
  errorRate: string;
  taskCompletion: string;
}
