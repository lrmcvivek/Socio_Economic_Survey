"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepChange?: (step: number) => void; 
}

export default function Stepper({
  steps,
  currentStep,
  onStepChange,
}: StepperProps) {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const currentTitle = steps[currentStep];

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 gap-2">
        <div>
           <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {currentTitle}
          </h2>
           <p className="text-sm text-slate-400 mt-1">Section {currentStep + 1} of {steps.length}</p>
        </div>
        <div className="text-right hidden sm:block">
           <span className="text-sm font-medium text-blue-500">{Math.round(progressPercentage)}% Complete</span>
        </div>
      </div>
      
      {/* Progress Bar Track */}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
        {/* Animated Progress Fill */}
        <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Mobile percentage text */}
      <div className="mt-2 text-right sm:hidden">
         <span className="text-xs font-medium text-blue-500">{Math.round(progressPercentage)}% Complete</span>
      </div>
    </div>
  );
}
