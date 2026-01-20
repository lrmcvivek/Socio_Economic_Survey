"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SupervisorAdminLayout from "@/components/SupervisorAdminLayout";
import DashboardStats from "@/components/DashboardStats";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Users, CheckCircle, Clock } from "lucide-react";

export default function SupervisorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verify user is supervisor
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    if (userData?.role !== "SUPERVISOR") {
      router.push(`/${userData?.role?.toLowerCase()}/dashboard`);
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  const loadDashboardData = async () => {
    // Placeholder for refresh functionality
    console.log("Refreshing data...");
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Verifying access..." />;
  }

  return (
    <SupervisorAdminLayout
      role="SUPERVISOR"
      username={user?.name || user?.username}
    >
      {/* Dashboard Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
            Overview of your survey assignments and progress
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/supervisor/slums")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            View Slums
          </button>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <DashboardStats
        stats={[
          {
            label: "Total Assignments",
            value: 0,
            icon: <Users className="w-5 h-5" />,
            colorClass: "text-blue-500 bg-blue-500/20",
          },
          {
            label: "Completed",
            value: 0,
            icon: <CheckCircle className="w-5 h-5" />,
            colorClass: "text-green-500 bg-green-500/20",
          },
          {
            label: "In Progress",
            value: 0,
            icon: <Clock className="w-5 h-5" />,
            colorClass: "text-amber-500 bg-amber-500/20",
          },
          {
            label: "Pending",
            value: 0,
            icon: <Clock className="w-5 h-5" />,
            colorClass: "text-cyan-500 bg-cyan-500/20",
          },
        ]}
      />
      <div className="mb-8"></div>

      {/* Content Area / Empty State */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl backdrop-blur-sm">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="relative z-10">
          <div className="text-7xl mb-6 drop-shadow-lg">🏠</div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
            No Assignments Yet
          </h3>
          <p className="text-slate-400 max-w-lg mx-auto leading-relaxed text-base">
            Your supervisor has not assigned any surveys yet. Check tabs for other actions.
          </p>
        </div>
      </div>
    </SupervisorAdminLayout>
  );
}
