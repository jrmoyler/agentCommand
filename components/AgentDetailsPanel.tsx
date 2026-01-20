
import React, { useEffect, useState } from 'react';
import { X, Play, Square, Volume2, Search, BrainCircuit, Power, RotateCcw } from 'lucide-react';
import { Agent, AgentStatus } from '../types';
import { getAgentAnalysis, speakAgentStatus, generateAgentReport } from '../services/geminiService';

interface AgentDetailsPanelProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: AgentStatus) => void;
}

const AgentDetailsPanel: React.FC<AgentDetailsPanelProps> = ({ agent, isOpen, onClose, onStatusChange }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReport, setActiveReport] = useState<any>(null);

  useEffect(() => {
    if (agent && isOpen) {
      setAnalysis('');
      setActiveReport(null);
    }
  }, [agent, isOpen]);

  if (!agent) return null;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await getAgentAnalysis(agent.name, agent.role, agent.description);
      setAnalysis(result || 'Failed to retrieve analysis.');
    } catch (e) {
      setAnalysis('Error connecting to Gemini Intelligence.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeak = () => {
    speakAgentStatus(`Agent ${agent.name} is currently ${agent.status}. Role: ${agent.role}. Specialization: ${agent.specialization}.`);
  };

  const handleDeepReport = async () => {
    setIsAnalyzing(true);
    const report = await generateAgentReport(agent);
    setActiveReport(report);
    setIsAnalyzing(false);
  }

  const bgClass = 'bg-[#121210]';
  const borderCol = 'border-[#333333]';
  const innerBg = 'bg-[#1A1A1A]';
  const textColor = 'text-[#E5E5E5]';
  const mutedText = 'text-[#666666]';

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-[450px] ${bgClass} border-l-2 ${borderCol} z-[60] transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-8 h-full flex flex-col overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className={`text-xs font-mono ${mutedText}`}>{agent.id}</span>
            <h2 className={`text-4xl font-black tracking-tighter uppercase ${textColor}`}>{agent.name}</h2>
          </div>
          <button onClick={onClose} className={`p-2 hover:bg-[#333] transition-colors`}>
            <X size={24} color="white" />
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h4 className={`text-[10px] font-bold tracking-[0.2em] ${mutedText} mb-2 uppercase`}>Core Configuration</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 border ${borderCol} ${innerBg}`}>
                <span className={`block text-[10px] ${mutedText} mb-1`}>ROLE</span>
                <span className={`font-bold text-sm uppercase ${textColor}`}>{agent.role}</span>
              </div>
              <div className={`p-4 border ${borderCol} ${innerBg}`}>
                <span className={`block text-[10px] ${mutedText} mb-1`}>STATUS</span>
                <span className={`font-bold text-sm uppercase ${agent.status === 'busy' ? 'text-[#FF4400]' : agent.status === 'idle' ? 'text-green-600' : 'text-gray-500'}`}>
                  {agent.status}
                </span>
              </div>
            </div>
          </section>

          <section className={`p-4 border ${borderCol} ${bgClass}`}>
            <h4 className={`text-[10px] font-bold tracking-[0.2em] ${mutedText} mb-4 uppercase`}>Direct Controls</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => onStatusChange('busy')}
                className="flex-1 bg-[#0044FF] text-white py-3 flex flex-col items-center justify-center gap-1 hover:bg-[#0033CC] transition-colors"
              >
                <Play size={16} fill="white" />
                <span className="text-[9px] font-bold uppercase">Start</span>
              </button>
              <button 
                onClick={() => onStatusChange('idle')}
                className="flex-1 bg-[#1A1A1A] text-white py-3 flex flex-col items-center justify-center gap-1 hover:bg-[#333333] transition-colors border border-white/10"
              >
                <Square size={16} fill="white" />
                <span className="text-[9px] font-bold uppercase">Stop</span>
              </button>
              <button 
                onClick={() => onStatusChange('idle')}
                className={`flex-1 border-2 border-[#333] text-white py-3 flex flex-col items-center justify-center gap-1 hover:bg-[#333] transition-colors`}
              >
                <RotateCcw size={16} />
                <span className="text-[9px] font-bold uppercase">Reset</span>
              </button>
            </div>
          </section>

          <section>
            <h4 className={`text-[10px] font-bold tracking-[0.2em] ${mutedText} mb-2 uppercase`}>Specialization</h4>
            <p className={`text-sm font-medium ${textColor}`}>{agent.specialization}</p>
          </section>

          <section className="pt-4 border-t border-[#333]">
            <h4 className={`text-[10px] font-bold tracking-[0.2em] ${mutedText} mb-4 uppercase`}>Intelligence Integration</h4>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1 bg-[#1A1A1A] text-white px-4 py-3 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-[#333333] transition-colors disabled:opacity-50 border border-white/10">
                <BrainCircuit size={16} /> {isAnalyzing ? '...' : 'Analyze'}
              </button>
              <button onClick={handleSpeak} className={`flex-1 border-2 border-white text-white px-4 py-3 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-[#333] transition-colors`}>
                <Volume2 size={16} /> Brief
              </button>
            </div>
            <div className="mt-2 flex gap-2">
               <button onClick={handleDeepReport} className="flex-1 border-2 border-[#0044FF] text-[#0044FF] px-4 py-3 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-[#0044FF11] transition-colors">
                <Search size={16} /> Grounded Report
              </button>
            </div>
          </section>

          {(analysis || activeReport) && (
            <section className={`${innerBg} p-6 border ${borderCol}`}>
              <h4 className={`text-[10px] font-bold tracking-[0.2em] ${mutedText} mb-3 uppercase`}>Gemini Result</h4>
              <div className={`text-xs font-mono leading-relaxed ${textColor} whitespace-pre-wrap`}>
                {activeReport ? activeReport.text : analysis}
              </div>
            </section>
          )}

          <div className="mt-auto pt-8 flex gap-4">
             <button className="flex-1 bg-[#0044FF] text-white py-4 font-black uppercase text-sm tracking-tighter">Initialize Task Bundle</button>
             <button onClick={() => onStatusChange('offline')} className={`w-16 ${innerBg} border ${borderCol} flex items-center justify-center text-[#FF4400] hover:bg-[#FF4400] hover:text-white transition-colors`}>
               <Power size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsPanel;
