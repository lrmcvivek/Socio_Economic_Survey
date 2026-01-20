import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string; // e.g., "text-blue-500 bg-blue-500/10"
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface DashboardStatsProps {
  stats: StatItem[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.label} 
          className="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-800/60"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-400">
              {stat.label}
            </p>
            {/* Icon plain, no background */}
            <div className={cn(
              "text-slate-500", // Default
               // Extract text color class
              stat.colorClass.split(" ").filter(c => c.startsWith("text-")).join(" ")
            )}>
              {stat.icon}
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {stat.value}
            </h3>
          </div>
             
          {stat.change && (
            <div className="mt-2 flex items-center text-xs font-medium">
               <span className={cn(
                  stat.trend === 'up' ? "text-green-500" : 
                  stat.trend === 'down' ? "text-red-500" : "text-slate-500"
                )}>
                  {stat.change}
               </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
