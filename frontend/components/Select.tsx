"use client";

import React, { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
  placeholder?: string;
}

export default function Select({
  label,
  error,
  helperText,
  options,
  fullWidth = true,
  placeholder = "Select an option",
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className={cn("flex flex-col relative", fullWidth && "w-full")}>
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
            "transition-all duration-200 appearance-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        >
          <option value="" className="bg-slate-900 text-slate-500">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-900">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-400 ml-1">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500 ml-1">{helperText}</p>
      )}
    </div>
  );
}
