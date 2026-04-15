import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerItem } from './PageTransition';

interface Props {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor = 'text-primary' }: Props) {
  return (
    <motion.div variants={staggerItem} className="stat-card group">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/15`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight mt-2">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${changeType === 'positive' ? 'text-success' : changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'}`}>
          {change}
        </p>
      )}
    </motion.div>
  );
}
