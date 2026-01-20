
import React from 'react';
import { LayoutDashboard, Users, Zap, ShieldAlert, Settings, Terminal } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'agents', icon: Users, label: 'Agents' },
    { id: 'live', icon: Terminal, label: 'Live' },
    { id: 'intelligence', icon: Zap, label: 'Deep Think' },
    { id: 'security', icon: ShieldAlert, label: 'Security' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const sidebarBg = 'bg-[#121210]';
  const borderColor = 'border-[#333333]';
  const textColor = 'text-[#E5E5E5]';
  const hoverBg = 'hover:bg-[#333333]';

  return (
    <div className={`fixed left-0 top-0 h-full w-[80px] ${sidebarBg} border-r ${borderColor} flex flex-col items-center py-8 z-50`}>
      <div className="mb-12">
        {/* Professional AC Circuit Logo */}
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4400" />
              <stop offset="100%" stopColor="#FF8800" />
            </linearGradient>
            <linearGradient id="secondaryGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0044FF" />
              <stop offset="100%" stopColor="#00CCFF" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feComposite in="coloredBlur" in2="SourceGraphic" operator="in" result="softGlow"/>
              <feMerge>
                <feMergeNode in="softGlow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* C Shape - Tech Blue Ring Segment */}
          <path 
            d="M 44 18 A 21 21 0 1 1 44 54" 
            stroke="url(#secondaryGrad)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            filter="url(#glow)"
            transform="translate(6, 0)"
            opacity="0.9"
          />
          
          {/* A Shape - Sharp Orange Circuit */}
          <path 
            d="M 16 54 L 30 14 L 44 54" 
            stroke="url(#primaryGrad)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#glow)"
          />
          <path 
            d="M 24 40 H 36" 
            stroke="#E5E5E5" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />

          {/* Circuit Nodes/Terminals */}
          <circle cx="16" cy="54" r="2.5" fill="#1A1A1A" stroke="#FF4400" strokeWidth="1.5" />
          <circle cx="30" cy="14" r="2.5" fill="#1A1A1A" stroke="#FF4400" strokeWidth="1.5" />
          <circle cx="44" cy="54" r="2.5" fill="#1A1A1A" stroke="#FF4400" strokeWidth="1.5" />
          
          {/* Connection Nodes on C */}
          <circle cx="50" cy="18" r="2.5" fill="#1A1A1A" stroke="#00CCFF" strokeWidth="1.5" />
          <circle cx="50" cy="54" r="2.5" fill="#1A1A1A" stroke="#0044FF" strokeWidth="1.5" />
          
          {/* Tech Detail Lines */}
          <path d="M 44 54 H 50" stroke="#0044FF" strokeWidth="1.5" opacity="0.5" />
          <path d="M 44 18 H 50" stroke="#00CCFF" strokeWidth="1.5" opacity="0.5" />
        </svg>
      </div>
      
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-12 h-12 flex items-center justify-center transition-all ${
              activeTab === item.id 
                ? 'bg-[#1A1A1A] text-white border border-[#FF4400]' 
                : `${textColor} ${hoverBg}`
            }`}
            title={item.label}
          >
            <item.icon size={20} strokeWidth={2} />
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-6 items-center">
        <div className={`text-[10px] font-mono rotate-90 origin-center translate-y-[-20px] tracking-widest text-[#666666]`}>
          V1.0.4-BETA
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
