
import React, { useState, useEffect } from 'react';

const SwarmHealth: React.FC = () => {
  const [tokens, setTokens] = useState(1240500);
  const [errorRate, setErrorRate] = useState(0.002);
  const [activeCount, setActiveCount] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      // Tokens always incrementing
      setTokens(prev => prev + Math.floor(Math.random() * 850) + 100);
      
      // Error rate fluctuating slightly
      setErrorRate(prev => {
        const drift = (Math.random() - 0.5) * 0.0002;
        return Math.max(0.0001, Math.min(0.05, prev + drift));
      });

      // Active agents count fluctuating between 12 and 15
      setActiveCount(prev => {
        const roll = Math.random();
        if (roll > 0.92 && prev > 12) return prev - 1;
        if (roll < 0.08 && prev < 15) return prev + 1;
        return prev;
      });
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  const surfaceBg = 'bg-[#121210]';
  const borderCol = 'border-[#333333]';
  const textColor = 'text-[#E5E5E5]';
  const mutedText = 'text-[#666666]';

  const stats = [
    { label: 'ACTIVE AGENTS', value: `${activeCount}/15`, color: textColor },
    { label: 'TOKENS USED', value: `${(tokens / 1000000).toFixed(3)}M`, color: '#0044FF' },
    { label: 'ERROR RATE', value: `${(errorRate * 100).toFixed(2)}%`, color: '#FF4400' },
    { label: 'THROUGHPUT', value: '1.2GB/s', color: textColor },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-0 border ${borderCol} ${surfaceBg} transition-colors duration-300`}>
      {stats.map((stat, idx) => (
        <div 
          key={stat.label} 
          className={`p-6 flex flex-col justify-between h-32 ${idx !== stats.length - 1 ? `border-r ${borderCol}` : ''}`}
        >
          <span className={`text-[10px] font-bold tracking-widest uppercase ${mutedText}`}>{stat.label}</span>
          <span className="text-3xl font-black tracking-tighter font-mono" style={{ color: stat.color }}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default SwarmHealth;
