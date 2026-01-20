
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SwarmHealth from './components/SwarmHealth';
import LiveFeed from './components/LiveFeed';
import AgentCard from './components/AgentCard';
import AgentDetailsPanel from './components/AgentDetailsPanel';
import { MOCK_AGENTS } from './constants';
import { Agent, AgentStatus } from './types';
import { getDeepThinkingInsights } from './services/geminiService';
import { Brain, Info, Search as SearchIcon, Filter, ArrowUpDown, Terminal, Shield, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'tokens' | 'uptime'>('name');
  const [isNightMode, setIsNightMode] = useState(() => {
    return localStorage.getItem('agentCommand_theme') === 'dark';
  });
  
  // Gemini Intelligence state
  const [thinkQuery, setThinkQuery] = useState('');
  const [thinkResult, setThinkResult] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    localStorage.setItem('agentCommand_theme', isNightMode ? 'dark' : 'light');
    if (isNightMode) {
      document.body.style.backgroundColor = '#1A1A1A';
    } else {
      document.body.style.backgroundColor = '#F4F4F0';
    }
  }, [isNightMode]);

  const selectedAgent = useMemo(() => 
    agents.find(a => a.id === selectedAgentId) || null
  , [agents, selectedAgentId]);

  const sortedAndFilteredAgents = useMemo(() => {
    let filtered = agents.filter(agent => 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'tokens') return b.tokensUsed - a.tokensUsed;
      if (sortBy === 'uptime') return b.uptime.localeCompare(a.uptime);
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

  const toggleNightMode = () => setIsNightMode(!isNightMode);

  // Strict Swiss Theme Colors
  const themeBg = isNightMode ? 'bg-[#1A1A1A]' : 'bg-[#F4F4F0]';
  const themeText = isNightMode ? 'text-[#E5E5E5]' : 'text-[#1A1A1A]';
  const surfaceBg = isNightMode ? 'bg-[#121210]' : 'bg-[#FFFFFF]';
  const borderCol = isNightMode ? 'border-[#333333]' : 'border-[#E5E5E5]';
  const mutedText = isNightMode ? 'text-[#888888]' : 'text-[#999999]';
  const inputBg = isNightMode ? 'bg-[#121210]' : 'bg-white';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="col-span-12">
              <SwarmHealth isNightMode={isNightMode} />
            </div>

            <div className="col-span-12 lg:col-span-8">
              <LiveFeed isNightMode={isNightMode} />
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
                    isNightMode={isNightMode}
                    onClick={handleAgentClick} 
                    onAction={(status) => updateAgentStatus(agent.id, status)}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'agents':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-[#1A1A1A] dark:border-white pb-6 gap-6">
              <div>
                <h2 className="text-6xl font-black tracking-tighter uppercase leading-none">Swarm Registry</h2>
                <p className={`text-sm font-mono ${mutedText} mt-2 uppercase`}>Comprehensive Node Management Interface</p>
              </div>
              
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <SearchIcon className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedText}`} size={16} />
                  <input 
                    type="text" 
                    placeholder="SEARCH NODES..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full border ${borderCol} ${inputBg} py-3 pl-10 pr-4 text-xs font-mono uppercase focus:outline-none focus:border-[#0044FF]`}
                  />
                </div>
                <div className={`border ${borderCol} ${inputBg} flex items-center px-4`}>
                  <ArrowUpDown size={16} className={mutedText} />
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs font-mono uppercase focus:outline-none px-2 py-3"
                  >
                    <option value="name">Name</option>
                    <option value="tokens">Usage</option>
                    <option value="uptime">Uptime</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {sortedAndFilteredAgents.map((agent) => (
                <AgentCard 
                  key={agent.id} 
                  agent={agent} 
                  isNightMode={isNightMode}
                  onClick={handleAgentClick} 
                  onAction={(status) => updateAgentStatus(agent.id, status)}
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
                <LiveFeed isNightMode={isNightMode} />
              </div>
            </div>
          </div>
        );

      case 'intelligence':
        return (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
            <header className={`border-b-4 ${isNightMode ? 'border-white' : 'border-[#1A1A1A]'} pb-4`}>
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
                className={`w-full h-40 ${isNightMode ? 'bg-[#0A0A0A]' : 'bg-[#F4F4F0]'} border ${borderCol} p-6 text-lg font-medium focus:outline-none focus:border-[#0044FF] placeholder:text-[#666666]`}
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
                 <div className="prose prose-sm font-mono whitespace-pre-wrap leading-relaxed dark:text-gray-300">
                   {thinkResult}
                 </div>
              </div>
            )}
          </div>
        );

      case 'security':
        return (
          <div className="animate-in fade-in duration-300">
            <div className={`p-20 border-4 ${isNightMode ? 'border-[#FF4400]' : 'border-[#1A1A1A]'} ${surfaceBg} flex flex-col items-center justify-center text-center`}>
              <Shield size={64} className="text-[#FF4400] mb-8" />
              <h2 className="text-6xl font-black tracking-tighter uppercase mb-6">Security Protocol Restricted</h2>
              <p className={`max-w-xl text-lg ${mutedText} font-medium mb-12`}>
                This interface handles encrypted key management and firewall overrides. Access requires a physical hardware security token and Level 4 biometric verification.
              </p>
              <div className="flex gap-4">
                <button className="bg-[#1A1A1A] dark:bg-white dark:text-black text-white px-8 py-4 font-black uppercase tracking-widest text-xs">Request Access</button>
                <button className={`border-2 ${borderCol} px-8 py-4 font-black uppercase tracking-widest text-xs`}>View Logs</button>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-2xl space-y-12 animate-in fade-in duration-300">
            <div>
              <h2 className="text-5xl font-black tracking-tighter uppercase border-b-4 border-[#1A1A1A] dark:border-white pb-4 mb-8">Hub Configuration</h2>
              
              <div className="space-y-8">
                <section>
                  <h4 className={`text-[10px] font-bold tracking-widest ${mutedText} uppercase mb-4`}>Appearance</h4>
                  <div className={`p-6 border ${borderCol} ${surfaceBg} flex justify-between items-center`}>
                    <div>
                      <span className="block font-bold text-sm uppercase">Night Mode Override</span>
                      <span className={`text-xs ${mutedText}`}>Forces high-contrast dark aesthetic across all modules.</span>
                    </div>
                    <button 
                      onClick={toggleNightMode}
                      className={`w-14 h-8 flex items-center p-1 transition-colors ${isNightMode ? 'bg-[#0044FF]' : 'bg-[#E5E5E5]'}`}
                    >
                      <div className={`w-6 h-6 bg-white transition-transform ${isNightMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </section>

                <section>
                  <h4 className={`text-[10px] font-bold tracking-widest ${mutedText} uppercase mb-4`}>System Parameters</h4>
                  <div className="space-y-4">
                    <div className={`p-6 border ${borderCol} ${surfaceBg}`}>
                      <span className="block font-bold text-sm uppercase mb-1">Compute Threshold</span>
                      <input type="range" className="w-full h-1 bg-[#E5E5E5] accent-[#0044FF]" />
                      <div className="flex justify-between mt-2 text-[10px] font-mono">
                        <span>ECO_MODE</span>
                        <span>MAX_PERFORMANCE</span>
                      </div>
                    </div>
                    <div className={`p-6 border ${borderCol} ${surfaceBg}`}>
                      <span className="block font-bold text-sm uppercase mb-1">Auto-Scaling Strategy</span>
                      <select className={`w-full bg-transparent text-xs font-mono uppercase focus:outline-none py-2 border-b ${borderCol}`}>
                        <option>Latency Optimized</option>
                        <option>Cost Optimized</option>
                        <option>Redundant Swarm</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="pt-8 border-t border-[#E5E5E533]">
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
        isNightMode={isNightMode}
        toggleNightMode={toggleNightMode}
      />
      
      <main className="ml-[80px] flex-1 p-10 max-w-[1600px] mx-auto w-full overflow-hidden">
        {/* Header Section */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className={`flex items-center gap-2 text-[10px] font-mono mb-2 ${mutedText}`}>
              <span className="w-1.5 h-1.5 bg-[#FF4400]"></span>
              SYSTEM STATUS: NOMINAL
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.8] uppercase cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              AgentCommand
            </h1>
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
        isNightMode={isNightMode}
        onClose={() => setIsPanelOpen(false)} 
        onStatusChange={(status) => selectedAgent && updateAgentStatus(selectedAgent.id, status)}
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
      `}</style>
    </div>
  );
};

export default App;
