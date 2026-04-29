import React from "react";
import { cn } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string; // e.g., "text-blue-500 bg-blue-500/10"
  change?: string;
  trend?: "up" | "down" | "neutral";
}

interface DashboardStatsProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4; // Number of columns for large screens
}

export default function DashboardStats({
  stats,
  columns = 4,
}: DashboardStatsProps) {
  // Helper function to extract color from colorClass
  const getColorFromColorClass = (colorClass: string) => {
    const textClass = colorClass.split(" ").find((c) => c.startsWith("text-"));
    const colorMap: Record<string, string> = {
      "text-blue-500": "#3b82f6",
      "text-amber-500": "#f59e0b",
      "text-purple-500": "#8b5cf6",
      "text-green-500": "#10b981",
      "text-cyan-500": "#06b6d4",
      "text-red-500": "#f43f5e",
      "text-pink-500": "#ec4899",
      "text-indigo-500": "#6366f1",
    };
    return textClass ? colorMap[textClass] || "#64748b" : "#64748b";
  };

  // Dynamic grid class based on columns prop
  const gridClass =
    columns === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
      : columns === 3
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6";

  return (
    <div className={gridClass}>
      {stats.map((stat) => {
        const accentColor = getColorFromColorClass(stat.colorClass);
        return (
          <div
            key={stat.label}
            className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              {/* Icon with colored background */}
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                {stat.icon}
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <h3
                className="text-3xl font-bold bg-clip-text text-transparent tracking-tight"
                style={{
                  backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColor}dd)`,
                }}
              >
                {stat.value}
              </h3>
            </div>

            {stat.change && (
              <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center text-xs font-medium">
                <span
                  className={cn(
                    stat.trend === "up"
                      ? "text-green-500"
                      : stat.trend === "down"
                        ? "text-red-500"
                        : "text-slate-500",
                  )}
                >
                  {stat.change}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
