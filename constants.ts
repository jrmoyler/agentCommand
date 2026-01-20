
import { Agent, LogEntry } from './types';

export const MOCK_AGENTS: Agent[] = [
  { id: 'AG-01', name: 'NEURAL_ARCHITECT', role: 'System Design', status: 'busy', tokensUsed: 125400, uptime: '14h 22m', specialization: 'Deep Learning Topology', description: 'Optimizes multi-agent communication protocols and swarm geometry.' },
  { id: 'AG-02', name: 'DATA_SCAVENGER', role: 'Ingestion', status: 'idle', tokensUsed: 89000, uptime: '45h 10m', specialization: 'RAG Optimization', description: 'Real-time retrieval and indexing of unstructured web data.' },
  { id: 'AG-03', name: 'LOGIC_PROVER', role: 'Verification', status: 'idle', tokensUsed: 45000, uptime: '12h 05m', specialization: 'Formal Methods', description: 'Validates agent output against symbolic logic constraints.' },
  { id: 'AG-04', name: 'CODE_GEN_V8', role: 'Development', status: 'busy', tokensUsed: 312000, uptime: '02h 45m', specialization: 'Rust/WASM', description: 'Automated synthesis of high-performance system components.' },
  { id: 'AG-05', name: 'THREAT_HUNTER', role: 'Security', status: 'idle', tokensUsed: 12000, uptime: '98h 12m', specialization: 'Zero-Day Detection', description: 'Monitors swarm boundaries for adversarial injection attempts.' },
  { id: 'AG-06', name: 'SEMANTIC_FILTER', role: 'Moderation', status: 'idle', tokensUsed: 54000, uptime: '22h 30m', specialization: 'Toxicity Scoring', description: 'Ensures all output aligns with predefined safety benchmarks.' },
  { id: 'AG-07', name: 'MARKET_ANALYST', role: 'Finance', status: 'busy', tokensUsed: 67000, uptime: '05h 15m', specialization: 'Predictive Modeling', description: 'Real-time volatility analysis and hedging strategy generation.' },
  { id: 'AG-08', name: 'DOCS_GEN_AUTO', role: 'Documentation', status: 'idle', tokensUsed: 34000, uptime: '12h 45m', specialization: 'Technical Writing', description: 'Generates API schemas and user manuals from source code.' },
  { id: 'AG-09', name: 'LOAD_BALANCER', role: 'Infrastructure', status: 'idle', tokensUsed: 15000, uptime: '200h 10m', specialization: 'Traffic Shaping', description: 'Redistributes compute loads across GPU clusters.' },
  { id: 'AG-10', name: 'UI_COMPOSER', role: 'Frontend', status: 'busy', tokensUsed: 128000, uptime: '01h 55m', specialization: 'Tailwind Engine', description: 'Rapid prototyping of atomic UI components.' },
  { id: 'AG-11', name: 'RESEARCH_SYNTH', role: 'R&D', status: 'idle', tokensUsed: 210000, uptime: '08h 22m', specialization: 'Paper Summarization', description: 'Distills latest ArXiv releases into actionable insights.' },
  { id: 'AG-12', name: 'QUALITY_ASSURE', role: 'QA', status: 'busy', tokensUsed: 44000, uptime: '04h 12m', specialization: 'End-to-End Testing', description: 'Simulates user interaction flows to detect regressions.' },
  { id: 'AG-13', name: 'VOICE_ENGINE', role: 'Multimodal', status: 'idle', tokensUsed: 9800, uptime: '122h 00m', specialization: 'TTS/STT', description: 'Handles low-latency vocal interfaces and transcription.' },
  { id: 'AG-14', name: 'VECTOR_COMPACT', role: 'Database', status: 'busy', tokensUsed: 88000, uptime: '06h 40m', specialization: 'Index Compression', description: 'Prunes redundant nodes from high-dimensional vector spaces.' },
  { id: 'AG-15', name: 'PROMPT_TUNER', role: 'Optimization', status: 'idle', tokensUsed: 22000, uptime: '15h 30m', specialization: 'Few-Shot Engineering', description: 'Iteratively refines instructions to minimize token usage.' },
];

export const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: '14:20:01', agentId: 'AG-01', message: 'Re-initializing neural paths...', type: 'info' },
  { id: '2', timestamp: '14:20:05', agentId: 'AG-04', message: 'Compiled module index.rs successfully.', type: 'success' },
  { id: '3', timestamp: '14:21:12', agentId: 'AG-07', message: 'Detected high volatility in BTC/USD pair.', type: 'warning' },
  { id: '4', timestamp: '14:21:45', agentId: 'AG-10', message: 'Rendering bento grid component...', type: 'info' },
  { id: '5', timestamp: '14:22:10', agentId: 'AG-05', message: 'Scanned 1,200 requests. No threats found.', type: 'success' },
  { id: '6', timestamp: '14:22:30', agentId: 'AG-14', message: 'Compacting vector index V-72...', type: 'info' },
];
