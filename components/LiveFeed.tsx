
import React, { useEffect, useRef, useState } from 'react';
import { MOCK_LOGS } from '../constants';
import { LogEntry } from '../types';

interface LiveFeedProps {
  isNightMode?: boolean;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ isNightMode }) => {
  const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulate new logs
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        "Synthesizing logical proof for AG-03...",
        "Redistributing GPU memory allocation.",
        "Security scrub complete. 0 threats detected.",
        "Optimizing RAG vector search parameters.",
        "Heartbeat signal received from AG-12.",
        "Inference cycle 72.4% complete.",
        "API Gateway Latency: 12ms",
        "Backup process initiated for Node cluster."
      ];
      
      const newLog: LogEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        agentId: `AG-${(Math.floor(Math.random() * 15) + 1).toString().padStart(2, '0')}`,
        message: messages[Math.floor(Math.random() * messages.length)],
        type: Math.random() > 0.9 ? 'warning' : 'info'
      };
      setLogs(prev => [...prev.slice(-99), newLog]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const bgClass = isNightMode ? 'bg-[#0A0A0A]' : 'bg-[#1A1A1A]';
  const borderColor = isNightMode ? 'border-[#333333]' : 'border-[#E5E5E5]';

  return (
    <div className={`${bgClass} p-6 h-full flex flex-col border ${borderColor} transition-colors duration-300 overflow-hidden`}>
      <div className="flex justify-between items-center mb-6 border-b border-[#333333] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-600 animate-pulse"></div>
          <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">WAR_ROOM_FEED_STREAMING</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] text-green-500 font-mono uppercase">ACTIVE_NODES: 15</span>
          <span className="text-[10px] text-[#666666] font-mono uppercase">V: 1.0.4</span>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-[11px] space-y-1.5 text-[#BBBBBB] custom-scrollbar"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-6 border-b border-[#222222] py-2 hover:bg-[#252525] group transition-colors">
            <span className="text-[#555555] min-w-[75px] group-hover:text-[#888888]">[{log.timestamp}]</span>
            <span className="text-[#0044FF] font-bold min-w-[60px]">{log.agentId}</span>
            <span className={`${log.type === 'warning' ? 'text-[#FF4400]' : log.type === 'success' ? 'text-green-400' : 'text-white'} leading-tight`}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333333; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555555; }
      `}</style>
    </div>
  );
};

export default LiveFeed;
