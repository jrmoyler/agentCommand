
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
        <div className="w-10 h-10 bg-[#FF4400] flex items-center justify-center">
          <span className="text-white font-bold text-xl">A</span>
        </div>
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
