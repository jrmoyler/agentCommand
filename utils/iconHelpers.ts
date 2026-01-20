
import {
  Cpu, Database, ShieldCheck, Code, ShieldAlert, Scale,
  TrendingUp, FileText, Server, LayoutTemplate, FlaskConical,
  ClipboardCheck, Mic, Zap, Bot, LucideIcon, Brain, Activity, 
  Terminal, Globe, Layers, Eye
} from 'lucide-react';

export const getAgentIcon = (role: string): LucideIcon => {
  const normalizedRole = role.toLowerCase();
  
  if (normalizedRole.includes('system design') || normalizedRole.includes('architect')) return Brain;
  if (normalizedRole.includes('ingestion') || normalizedRole.includes('scavenger')) return Database;
  if (normalizedRole.includes('verification') || normalizedRole.includes('logic')) return ShieldCheck;
  if (normalizedRole.includes('development') || normalizedRole.includes('code')) return Terminal;
  if (normalizedRole.includes('security') || normalizedRole.includes('threat')) return ShieldAlert;
  if (normalizedRole.includes('moderation') || normalizedRole.includes('semantic')) return Eye;
  if (normalizedRole.includes('finance') || normalizedRole.includes('market')) return TrendingUp;
  if (normalizedRole.includes('documentation') || normalizedRole.includes('docs')) return FileText;
  if (normalizedRole.includes('infrastructure') || normalizedRole.includes('balancer')) return Server;
  if (normalizedRole.includes('frontend') || normalizedRole.includes('ui')) return LayoutTemplate;
  if (normalizedRole.includes('r&d') || normalizedRole.includes('research')) return FlaskConical;
  if (normalizedRole.includes('qa') || normalizedRole.includes('quality')) return ClipboardCheck;
  if (normalizedRole.includes('multimodal') || normalizedRole.includes('voice')) return Mic;
  if (normalizedRole.includes('optimization') || normalizedRole.includes('tuner')) return Zap;
  if (normalizedRole.includes('database') || normalizedRole.includes('vector')) return Layers;
  
  return Bot;
};
