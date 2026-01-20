"use client";

import React, { ReactNode } from "react";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Sidebar from "@/components/Sidebar";

interface SurveyorLayoutProps {
  children: ReactNode;
  username?: string;
  fullScreen?: boolean;
}

export default function SurveyorLayout({
  children,
  username,
  fullScreen = false,
}: SurveyorLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent username={username} fullScreen={fullScreen}>
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
}

const LayoutContent = ({
  children,
  username,
  fullScreen,
}: SurveyorLayoutProps) => {

  if (fullScreen) {
    return (
      <div className="w-full h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4">
          <div className="w-full h-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar: Fixed width, sticky logic handled inside Sidebar component */}
      <Sidebar role="SURVEYOR" username={username} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header - Minimal, just title mostly, or can be hidden if Sidebar has it all. 
            For now, keeping a clean header for context. */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
             <div className="ml-10 md:ml-0"> {/* Margin left for mobile menu trigger space */}
               <span className="text-sm text-slate-400">Welcome back, <span className="text-white font-medium">{username || "Surveyor"}</span></span>
             </div>
        </header>

        {/* Scrollable Content Canvas */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
