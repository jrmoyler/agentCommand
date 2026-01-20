
import React from 'react';
import { Agent, AgentStatus } from '../types';
import { Play, Square, RotateCcw } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
  onAction: (status: AgentStatus) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick, onAction }) => {
  const statusColors = {
    idle: 'bg-green-500',
    busy: 'bg-[#FF4400]',
    error: 'bg-red-700',
    offline: 'bg-gray-400'
  };

  const bgClass = 'bg-[#121210]';
  const borderClass = 'border-[#333333]';
  const hoverBorder = 'hover:border-[#FF4400]';
  const textColor = 'text-[#E5E5E5]';
  const mutedText = 'text-[#888888]';

  const handleAction = (e: React.MouseEvent, status: AgentStatus) => {
    e.stopPropagation();
    onAction(status);
  };

  return (
    <div 
      onClick={() => onClick(agent)}
      className={`${bgClass} border ${borderClass} p-5 cursor-pointer group ${hoverBorder} transition-all duration-300 flex flex-col justify-between h-48 relative overflow-hidden`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] font-mono ${mutedText}`}>{agent.id}</span>
          <div className={`w-2 h-2 ${statusColors[agent.status]}`}></div>
        </div>
        <h3 className={`text-lg font-black tracking-tighter leading-none mb-1 group-hover:text-[#0044FF] transition-colors ${textColor}`}>
          {agent.name}
        </h3>
        <p className={`text-[10px] font-bold uppercase tracking-wider text-[#666666]`}>{agent.role}</p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-transparent group-hover:border-[#333333] flex justify-between items-end relative z-10">
        <div className="flex flex-col">
          <span className={`text-[9px] ${mutedText} font-mono`}>UPTIME</span>
          <span className={`text-xs font-mono ${textColor}`}>{agent.uptime}</span>
        </div>

        {/* Action Overlay buttons - Appear on card hover */}
        <div className="absolute right-0 bottom-0 flex gap-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <button 
            onClick={(e) => handleAction(e, 'busy')}
            className={`p-1.5 bg-[#333] hover:bg-[#0044FF] hover:text-white transition-colors border ${borderClass}`}
            title="Start Agent"
          >
            <Play size={12} fill="currentColor" />
          </button>
          <button 
            onClick={(e) => handleAction(e, 'idle')}
            className={`p-1.5 bg-[#333] hover:bg-[#1A1A1A] hover:text-white transition-colors border ${borderClass}`}
            title="Stop Agent"
          >
            <Square size={12} fill="currentColor" />
          </button>
          <button 
            onClick={(e) => handleAction(e, 'idle')}
            className={`p-1.5 bg-[#333] hover:bg-[#FF4400] hover:text-white transition-colors border ${borderClass}`}
            title="Reset Agent"
          >
            <RotateCcw size={12} />
          </button>
        </div>

        <div className="flex flex-col text-right group-hover:opacity-0 transition-opacity">
          <span className={`text-[9px] ${mutedText} font-mono`}>TOKENS</span>
          <span className={`text-xs font-mono ${textColor}`}>{(agent.tokensUsed / 1000).toFixed(1)}k</span>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
