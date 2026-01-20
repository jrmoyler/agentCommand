
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SwarmHealth from './components/SwarmHealth';
import LiveFeed from './components/LiveFeed';
import AgentCard from './components/AgentCard';
import AgentDetailsPanel from './components/AgentDetailsPanel';
import { MOCK_AGENTS } from './constants';
import { Agent, AgentStatus } from './types';
import { getDeepThinkingInsights } from './services/geminiService';
import { Brain, Info, Search as SearchIcon, Filter, ArrowUpDown, Terminal, Shield, Settings as SettingsIcon, Play, Square, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'tokens' | 'uptime'>('name');
  
  // Bulk selection state
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  
  // Gemini Intelligence state
  const [thinkQuery, setThinkQuery] = useState('');
  const [thinkResult, setThinkResult] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    // Enforce dark mode on body
    document.body.style.backgroundColor = '#1A1A1A';
  }, []);

  const selectedAgent = useMemo(() => 
    agents.find(a => a.id === selectedAgentId) || null
  , [agents, selectedAgentId]);

  // Helper to parse "XXh YYm" string into minutes for sorting
  const parseUptimeToMinutes = (uptime: string): number => {
    const parts = uptime.split(' ');
    let minutes = 0;
    parts.forEach(part => {
      if (part.includes('h')) minutes += parseInt(part) * 60;
      if (part.includes('m')) minutes += parseInt(part);
    });
    return minutes;
  };

  const sortedAndFilteredAgents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let filtered = agents.filter(agent => 
      agent.name.toLowerCase().includes(term) ||
      agent.role.toLowerCase().includes(term) ||
      agent.specialization.toLowerCase().includes(term) ||
      agent.tags.some(tag => tag.toLowerCase().includes(term))
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'tokens') return b.tokensUsed - a.tokensUsed;
      if (sortBy === 'uptime') return parseUptimeToMinutes(b.uptime) - parseUptimeToMinutes(a.uptime);
      return 0;
    });
  }, [agents, searchTerm, sortBy]);

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgentId(agent.id);
    setIsPanelOpen(true);
  };

  const updateAgentStatus = (id: string, status: AgentStatus) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const resetAgent = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'idle', tokensUsed: 0, uptime: '0h 00m' } : a));
  };

  const updateAgentTags = (id: string, newTags: string[]) => {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, tags: newTags } : a));
  }

  // Bulk Actions
  const toggleAgentSelection = (id: string) => {
      setSelectedAgentIds(prev => 
          prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
      );
  };

  const handleBulkStart = () => {
      setAgents(prev => prev.map(a => selectedAgentIds.includes(a.id) ? { ...a, status: 'busy' } : a));
      setSelectedAgentIds([]);
  };

  const handleBulkStop = () => {
      setAgents(prev => prev.map(a => selectedAgentIds.includes(a.id) ? { ...a, status: 'idle' } : a));
      setSelectedAgentIds([]);
  };

  const handleBulkReset = () => {
      setAgents(prev => prev.map(a => selectedAgentIds.includes(a.id) ? { ...a, status: 'idle', tokensUsed: 0, uptime: '0h 00m' } : a));
      setSelectedAgentIds([]);
  };

  const handleThink = async () => {
    if (!thinkQuery) return;
    setIsThinking(true);
    setThinkResult('');
    try {
      const res = await getDeepThinkingInsights(thinkQuery);
      setThinkResult(res || 'No response from logic core.');
    } catch (e) {
      setThinkResult('Thinking cycle failed. Inspect logs for details.');
    } finally {
      setIsThinking(false);
    }
  };

  // Permanent Swiss Dark Theme Colors
  const themeBg = 'bg-[#1A1A1A]';
  const themeText = 'text-[#E5E5E5]';
  const surfaceBg = 'bg-[#121210]';
  const borderCol = 'border-[#333333]';
  const mutedText = 'text-[#888888]';
  const inputBg = 'bg-[#121210]';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="col-span-12">
              <SwarmHealth />
            </div>

            <div className="col-span-12 lg:col-span-8">
              <LiveFeed />
            </div>
            
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
               <div className="bg-[#0044FF] p-6 text-white h-full flex flex-col justify-between border-none">
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter mb-4 leading-none uppercase">Global Objective</h3>
                    <p className="text-sm font-medium opacity-80 leading-relaxed">
                      "Coordinate distributed compute resources to synthesize high-fidelity semantic networks for autonomous system discovery."
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/20">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-mono tracking-widest">ACTIVE PRIORITIES</span>
                       <span className="text-lg font-bold font-mono text-white">04</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className={`col-span-12 pt-10 border-t ${borderCol} mt-4`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Quick Registry</h2>
                  <p className={`text-[10px] font-mono ${mutedText} mt-1 uppercase`}>Most active autonomous nodes</p>
                </div>
                <button onClick={() => setActiveTab('agents')} className="text-[#0044FF] text-[10px] font-bold uppercase tracking-widest hover:underline">View All Agents →</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
                {sortedAndFilteredAgents.slice(0, 5).map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    onClick={handleAgentClick} 
                    onAction={(status) => updateAgentStatus(agent.id, status)}
                    onReset={() => resetAgent(agent.id)}
                    isSelected={selectedAgentIds.includes(agent.id)}
                    onToggleSelect={toggleAgentSelection}
                    selectionMode={selectedAgentIds.length > 0}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'agents':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-white pb-6 gap-6`}>
              <div>
                <h2 className="text-6xl font-black tracking-tighter uppercase leading-none">Swarm Registry</h2>
                <p className={`text-sm font-mono ${mutedText} mt-2 uppercase`}>Comprehensive Node Management Interface</p>
              </div>
              
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <SearchIcon className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedText}`} size={16} />
                  <input 
                    type="text" 
                    placeholder="SEARCH (NAME, ROLE, TAGS)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full border ${borderCol} ${inputBg} py-3 pl-10 pr-4 text-xs font-mono uppercase focus:outline-none focus:border-[#0044FF] placeholder:text-[#444]`}
                  />
                </div>
                <div className={`border ${borderCol} ${inputBg} flex items-center px-4`}>
                  <ArrowUpDown size={16} className={mutedText} />
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`bg-transparent text-xs font-mono uppercase focus:outline-none px-2 py-3 ${themeText}`}
                  >
                    <option value="name">Name</option>
                    <option value="tokens">Usage (High-Low)</option>
                    <option value="uptime">Uptime (High-Low)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedAgentIds.length > 0 && (
                <div className="bg-[#121210] border border-[#0044FF] p-4 flex justify-between items-center animate-in slide-in-from-top-2 fade-in">
                    <div className="flex items-center gap-4">
                        <span className="bg-[#0044FF] text-white text-[10px] font-bold px-2 py-1 uppercase">{selectedAgentIds.length} SELECTED</span>
                        <span className="text-xs text-[#888] font-mono hidden md:inline-block">Apply actions to multiple agents simultaneously.</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleBulkStart} className="flex items-center gap-2 bg-[#222] hover:bg-[#333] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors">
                            <Play size={12} /> Start All
                        </button>
                        <button onClick={handleBulkStop} className="flex items-center gap-2 bg-[#222] hover:bg-[#333] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors">
                            <Square size={12} /> Stop All
                        </button>
                        <button onClick={handleBulkReset} className="flex items-center gap-2 bg-[#222] hover:bg-[#333] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors">
                            <RotateCcw size={12} /> Reset All
                        </button>
                        <button onClick={() => setSelectedAgentIds([])} className="ml-2 text-[10px] text-[#666] hover:text-white uppercase font-bold px-2">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {sortedAndFilteredAgents.map((agent) => (
                <AgentCard 
                  key={agent.id} 
                  agent={agent} 
                  onClick={handleAgentClick} 
                  onAction={(status) => updateAgentStatus(agent.id, status)}
                  onReset={() => resetAgent(agent.id)}
                  isSelected={selectedAgentIds.includes(agent.id)}
                  onToggleSelect={toggleAgentSelection}
                  selectionMode={selectedAgentIds.length > 0}
                />
              ))}
            </div>
          </div>
        );

      case 'live':
        return (
          <div className="h-[calc(100vh-200px)] flex flex-col animate-in fade-in duration-300">
            <div className={`flex-1 border-2 ${borderCol} overflow-hidden flex flex-col`}>
              <div className={`p-4 border-b ${borderCol} ${surfaceBg} flex justify-between items-center`}>
                <div className="flex items-center gap-4">
                  <Terminal size={18} className="text-[#0044FF]" />
                  <span className="text-xs font-black tracking-widest uppercase">Global Control Terminal</span>
                </div>
                <div className="flex gap-2 text-[10px] font-mono">
                  <span className="text-[#FF4400]">SECURITY_LVL: 01</span>
                  <span className={mutedText}>|</span>
                  <span className="text-green-500">ENCRYPTION: AES-256</span>
                </div>
              </div>
              <div className="flex-1">
                <LiveFeed />
              </div>
            </div>
          </div>
        );

      case 'intelligence':
        return (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
            <header className={`border-b-4 border-white pb-4`}>
              <h2 className="text-5xl font-black tracking-tighter uppercase">Gemini Deep Think</h2>
              <p className={`text-sm ${mutedText} mt-2 font-mono uppercase`}>System-wide reasoning core | Gemini 3 Pro Enabled</p>
            </header>

            <div className={`${surfaceBg} border ${borderCol} p-8`}>
               <div className="flex items-center gap-3 mb-6">
                 <Brain className="text-[#0044FF]" />
                 <h4 className="font-bold uppercase tracking-widest text-xs">Internal Logic Query</h4>
               </div>
               <textarea 
                value={thinkQuery}
                onChange={(e) => setThinkQuery(e.target.value)}
                placeholder="Enter complex instruction or problem for the swarm..."
                className={`w-full h-40 bg-[#0A0A0A] border ${borderCol} p-6 text-lg font-medium focus:outline-none focus:border-[#0044FF] placeholder:text-[#444] ${themeText}`}
               />
               <button 
                onClick={handleThink}
                disabled={isThinking}
                className="mt-4 w-full bg-[#0044FF] text-white font-black py-4 uppercase tracking-widest hover:bg-[#0033CC] transition-colors disabled:opacity-50"
               >
                 {isThinking ? 'Thinking Cycle Active...' : 'Execute Logical Inference'}
               </button>
            </div>

            {thinkResult && (
              <div className={`${surfaceBg} border-l-8 border-[#FF4400] p-8 border ${borderCol}`}>
                 <div className="flex justify-between items-center mb-4">
                   <span className="text-[10px] font-bold text-[#FF4400] uppercase tracking-widest">Inference Result</span>
                   <span className={`text-[10px] font-mono ${mutedText}`}>TOKEN_COST: 1,422</span>
                 </div>
                 <div className="prose prose-sm font-mono whitespace-pre-wrap leading-relaxed text-[#CCCCCC]">
                   {thinkResult}
                 </div>
              </div>
            )}
          </div>
        );

      case 'security':
        return (
          <div className="animate-in fade-in duration-300">
            <div className={`p-20 border-4 border-[#FF4400] ${surfaceBg} flex flex-col items-center justify-center text-center`}>
              <Shield size={64} className="text-[#FF4400] mb-8" />
              <h2 className="text-6xl font-black tracking-tighter uppercase mb-6">Security Protocol Restricted</h2>
              <p className={`max-w-xl text-lg ${mutedText} font-medium mb-12`}>
                This interface handles encrypted key management and firewall overrides. Access requires a physical hardware security token and Level 4 biometric verification.
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-black px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors">Request Access</button>
                <button className={`border-2 ${borderCol} px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-[#333] transition-colors`}>View Logs</button>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-2xl space-y-12 animate-in fade-in duration-300">
            <div>
              <h2 className="text-5xl font-black tracking-tighter uppercase border-b-4 border-white pb-4 mb-8">Hub Configuration</h2>
              
              <div className="space-y-8">
                <section>
                  <h4 className={`text-[10px] font-bold tracking-widest ${mutedText} uppercase mb-4`}>System Parameters</h4>
                  <div className="space-y-4">
                    <div className={`p-6 border ${borderCol} ${surfaceBg}`}>
                      <span className="block font-bold text-sm uppercase mb-1">Compute Threshold</span>
                      <input type="range" className="w-full h-1 bg-[#333] accent-[#0044FF]" />
                      <div className="flex justify-between mt-2 text-[10px] font-mono">
                        <span>ECO_MODE</span>
                        <span>MAX_PERFORMANCE</span>
                      </div>
                    </div>
                    <div className={`p-6 border ${borderCol} ${surfaceBg}`}>
                      <span className="block font-bold text-sm uppercase mb-1">Auto-Scaling Strategy</span>
                      <select className={`w-full bg-transparent text-xs font-mono uppercase focus:outline-none py-2 border-b ${borderCol} ${themeText}`}>
                        <option>Latency Optimized</option>
                        <option>Cost Optimized</option>
                        <option>Redundant Swarm</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="pt-8 border-t border-[#333]">
                  <h4 className={`text-[10px] font-bold tracking-widest ${mutedText} uppercase mb-4`}>Hub Information</h4>
                  <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                    <div className={mutedText}>NODE_VERSION</div>
                    <div className="text-right">1.0.4-BETA_BUILD_892</div>
                    <div className={mutedText}>UPTIME_TOTAL</div>
                    <div className="text-right">452H 12M 04S</div>
                    <div className={mutedText}>REGION</div>
                    <div className="text-right">EU-CENTRAL-01</div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab not found.</div>;
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${themeBg} ${themeText}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="ml-[80px] flex-1 p-10 max-w-[1600px] mx-auto w-full overflow-hidden">
        {/* Header Section */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className={`flex items-center gap-2 text-[10px] font-mono mb-2 ${mutedText}`}>
              <span className="w-1.5 h-1.5 bg-[#FF4400]"></span>
              SYSTEM STATUS: NOMINAL
            </div>
            
            {/* Custom SVG Header Logo */}
            <svg 
              viewBox="0 0 420 60" 
              className="h-16 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setActiveTab('dashboard')}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#CCCCCC" />
                </linearGradient>
              </defs>

              {/* Text */}
              <text x="0" y="38" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="42" fill="url(#textGrad)" letterSpacing="-1">
                AGENT COMMAND
              </text>

              {/* Graphic Line Group */}
              <g transform="translate(2, 48)">
                {/* Left Segment */}
                <rect x="0" y="3" width="60" height="2" fill="#0044FF" />
                
                {/* Left Decoration */}
                <rect x="65" y="0" width="6" height="6" stroke="#0044FF" strokeWidth="1.5" fill="none" />
                <rect x="76" y="0" width="6" height="6" fill="#0044FF" />
                <path d="M88 0 L96 3 L88 6 Z" fill="#FF4400" />
                
                {/* Middle Line */}
                <rect x="102" y="3" width="180" height="2" fill="#333333" />
                
                {/* Right Decoration */}
                <rect x="288" y="0" width="6" height="6" fill="#0044FF" />
                <rect x="299" y="0" width="6" height="6" stroke="#0044FF" strokeWidth="1.5" fill="none" />
                
                {/* Right Segment */}
                <rect x="310" y="3" width="110" height="2" fill="#0044FF" />
              </g>
            </svg>
          </div>
          <div className="text-right hidden md:block">
            <div className={`text-[10px] font-bold tracking-widest mb-1 ${mutedText}`}>ORCHESTRATION HUB</div>
            <div className="text-xl font-mono">BETA_RELEASE_024</div>
          </div>
        </header>

        {renderContent()}
      </main>

      <AgentDetailsPanel 
        agent={selectedAgent} 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        onStatusChange={(status) => selectedAgent && updateAgentStatus(selectedAgent.id, status)}
        onReset={() => selectedAgent && resetAgent(selectedAgent.id)}
        onUpdateTags={(tags) => selectedAgent && updateAgentTags(selectedAgent.id, tags)}
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-in {
          animation-duration: 300ms;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fade-in {
          animation-name: fadeIn;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInFromBottom {
          from { transform: translateY(10px); }
          to { transform: translateY(0); }
        }

        .slide-in-from-bottom-2 {
          animation-name: fadeIn, slideInFromBottom;
        }

        @keyframes slideInFromTop {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .slide-in-from-top-2 {
            animation-name: slideInFromTop;
            animation-duration: 300ms;
        }
      `}</style>
    </div>
  );
};

export default App;
