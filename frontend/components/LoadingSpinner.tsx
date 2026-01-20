import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export default function LoadingSpinner({ 
  size = "md", 
  text, 
  fullScreen = false,
  className,
  ...props 
}: LoadingSpinnerProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)} {...props}>
      <Loader2 className={cn("animate-spin text-blue-500", sizeClasses[size])} />
      {text && <p className="text-slate-400 font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
