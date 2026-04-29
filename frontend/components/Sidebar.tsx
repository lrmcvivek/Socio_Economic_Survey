"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Map,
  ClipboardList,
  TrendingUp,
  Users,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import LogoutConfirmationDialog from "@/components/LogoutConfirmationDialog";

interface SidebarProps {
  role: "SUPERVISOR" | "ADMIN" | "SURVEYOR";
  username?: string;
}

const supervisorItems = [
  { href: "/supervisor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/supervisor/slums", label: "Slums", icon: Map },
  {
    href: "/supervisor/assignments",
    label: "Assignments",
    icon: ClipboardList,
  },
  { href: "/supervisor/reports", label: "Reports", icon: TrendingUp },
  { href: "/supervisor/hhqc", label: "HHQC", icon: CheckSquare },
];

const adminItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/slums", label: "Slums", icon: Map },
  { href: "/admin/assignments", label: "Assignments", icon: CheckSquare },
  { href: "/admin/reports", label: "Reports", icon: TrendingUp },
  { href: "/admin/hhqc", label: "HHQC", icon: CheckSquare },
];

const surveyorItems = [
  { href: "/surveyor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/surveyor/slums", label: "Slums", icon: Map },
];

export default function Sidebar({ role, username }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const items =
    role === "ADMIN"
      ? adminItems
      : role === "SUPERVISOR"
        ? supervisorItems
        : surveyorItems;

  // Simple hover state - clean and reliable
  const [isHovered, setIsHovered] = useState(false);
  const [mobileIsOpen, setMobileIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Mouse event handlers
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const handleLogoutClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowLogoutDialog(false);
    handleLogout();
  };

  const handleLogoutCancel = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowLogoutDialog(false);
  };

  return (
    <>
      {/* Desktop Sidebar - Clean hover-based implementation */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen transition-all duration-300 ease-in-out border-r border-slate-800 bg-slate-900 shrink-0 overflow-hidden",
          isHovered ? "w-64" : "w-20",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-slate-800 shrink-0">
          {isHovered ? (
            <span className="text-lg font-bold tracking-tight text-blue-500 whitespace-nowrap transition-opacity duration-300">
              SES System
            </span>
          ) : (
            <span className="text-xl font-bold tracking-tight text-blue-500">
              SES
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-6 flex flex-col gap-2 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-300 group relative",
                  isHovered ? "px-4 py-3" : "px-2 py-2 justify-center",
                  isActive
                    ? "bg-[#e97ec0] text-white font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium",
                )}
                title={!isHovered ? item.label : undefined}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-all shrink-0",
                    isActive
                      ? "bg-blue-800 text-white shadow-lg shadow-blue-900/40"
                      : "text-slate-400 group-hover:text-slate-200",
                  )}
                >
                  <Icon size={20} className="text-red-300" />
                </div>

                {/* Label with smooth transition */}
                <span
                  className={cn(
                    "font-medium ml-3 transition-all duration-300 whitespace-nowrap",
                    isHovered ? "opacity-100 inline-block" : "opacity-0 hidden",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer/User Section */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          {isHovered ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-900 shrink-0">
                {role.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {username || "User"}
                </p>
                <p className="text-xs text-slate-500 truncate capitalize">
                  {role.toLowerCase()}
                </p>
              </div>
              <button
                onClick={handleLogoutClick}
                className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogoutClick}
              className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer mx-auto block"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileIsOpen(!mobileIsOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-800 rounded-lg text-blue-500 cursor-pointer"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Drawer */}
      {mobileIsOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 p-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold tracking-tight text-blue-500">
                SES System
              </span>
              <button
                onClick={() => setMobileIsOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600/10 text-blue-500"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800 mt-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  {role.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {username || "User"}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {role.toLowerCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-900/50 hover:bg-red-900/10 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Dialog */}
      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
      {isLoggingOut && <LoadingSpinner fullScreen text="Logging out..." />}
    </>
  );
}
