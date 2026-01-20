"use client";

import React, { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  fullWidth = true,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className={cn("flex flex-col", fullWidth && "w-full")}>
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-400 ml-1">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500 ml-1">{helperText}</p>
      )}
    </div>
  );
}
