"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={cn(
        "bg-slate-900 border border-slate-800 rounded-xl shadow-sm",
        paddingClasses[padding],
        (hover || onClick) && "hover:border-slate-700 transition-all duration-200 cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
