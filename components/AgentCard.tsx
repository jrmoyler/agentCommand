
import React from 'react';
import { Agent, AgentStatus } from '../types';
import { Play, Square, RotateCcw, Check } from 'lucide-react';
import { getAgentIcon } from '../utils/iconHelpers';

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
  onAction: (status: AgentStatus) => void;
  onReset: () => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  selectionMode: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick, onAction, onReset, isSelected, onToggleSelect, selectionMode }) => {
  const statusColors = {
    idle: 'bg-green-500',
    busy: 'bg-[#FF4400]',
    error: 'bg-red-700',
    offline: 'bg-gray-400'
  };

  const bgClass = isSelected ? 'bg-[#1a1a18]' : 'bg-[#121210]';
  const borderClass = isSelected ? 'border-[#0044FF]' : 'border-[#333333]';
  const hoverBorder = 'hover:border-[#FF4400]';
  const textColor = 'text-[#E5E5E5]';
  const mutedText = 'text-[#888888]';

  const handleAction = (e: React.MouseEvent, status: AgentStatus) => {
    e.stopPropagation();
    onAction(status);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleSelect(agent.id);
  }

  const Icon = getAgentIcon(agent.role);

  return (
    <div 
      onClick={() => onClick(agent)}
      className={`${bgClass} border ${borderClass} p-5 cursor-pointer group ${hoverBorder} transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between h-56 relative overflow-hidden shadow-lg`}
    >
        {/* Selection Checkbox */}
        <div 
            onClick={handleCheckboxClick}
            className={`absolute top-4 right-4 z-20 w-5 h-5 border ${isSelected ? 'border-[#0044FF] bg-[#0044FF]' : 'border-[#444] bg-[#111]'} flex items-center justify-center transition-colors ${selectionMode || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
            {isSelected && <Check size={12} className="text-white" />}
        </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#1A1A1A] border border-[#333] rounded-none">
                <Icon size={16} className="text-[#0044FF]" />
             </div>
             <span className={`text-[10px] font-mono ${mutedText}`}>{agent.id}</span>
          </div>
          <div className={`w-2 h-2 ${statusColors[agent.status]} mr-8`}></div>
        </div>
        <h3 className={`text-lg font-black tracking-tighter leading-none mb-1 group-hover:text-[#0044FF] transition-colors ${textColor}`}>
          {agent.name}
        </h3>
        <p className={`text-[10px] font-bold uppercase tracking-wider text-[#666666]`}>{agent.role}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
            {agent.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[9px] uppercase font-mono bg-[#222] text-[#888] px-1.5 py-0.5 border border-[#333]">
                    {tag}
                </span>
            ))}
            {agent.tags.length > 3 && (
                <span className="text-[9px] uppercase font-mono text-[#666] px-1 py-0.5">+{agent.tags.length - 3}</span>
            )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-transparent group-hover:border-[#333333] flex justify-between items-end relative z-10">
        <div className="flex flex-col">
          <span className={`text-[9px] ${mutedText} font-mono`}>UPTIME</span>
          <span className={`text-xs font-mono ${textColor}`}>{agent.uptime}</span>
        </div>

        {/* Action Overlay buttons - Appear on card hover with subtle styling */}
        <div className="absolute right-0 bottom-0 flex gap-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <button 
            onClick={(e) => handleAction(e, 'busy')}
            className={`p-1 bg-[#222] hover:bg-[#0044FF] hover:text-white transition-colors border border-transparent hover:border-[#0044FF]`}
            title="Start Agent"
          >
            <Play size={12} fill="currentColor" />
          </button>
          <button 
            onClick={(e) => handleAction(e, 'idle')}
            className={`p-1 bg-[#222] hover:bg-[#333] hover:text-white transition-colors border border-transparent hover:border-white/20`}
            title="Stop Agent"
          >
            <Square size={12} fill="currentColor" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onReset(); }}
            className={`p-1 bg-[#222] hover:bg-[#FF4400] hover:text-white transition-colors border border-transparent hover:border-[#FF4400]`}
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
