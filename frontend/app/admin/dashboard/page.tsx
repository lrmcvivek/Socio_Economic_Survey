"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SupervisorAdminLayout from "@/components/SupervisorAdminLayout";
import DashboardStats from "@/components/DashboardStats";
import {
  BarChart3,
  Users,
  Building2,
  GitBranch,
  RefreshCw,
  MapPin,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Activity,
  PieChart,
} from "lucide-react";
import apiService from "@/services/api";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface User {
  _id: string;
  username: string;
  name: string;
  role: string;
  isActive: boolean;
}

interface Slum {
  _id: string;
  name: string;
  slumName?: string;
  cityTownCode: string;
  surveyStatus?: string;
  totalHouseholds?: number;
  ward?:
    | {
        _id: string;
        number: string;
        name: string;
        zone: string;
      }
    | string;
}

interface Assignment {
  _id: string;
  status: string;
  surveyor: { _id: string; name: string; username: string };
  slum: Slum;
  slumSurveyStatus?: string;
  householdSurveyProgress?: {
    completed: number;
    total: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalSupervisors: 0,
    totalSurveyors: 0,
    totalSlums: 0,
    totalWards: 0,
    totalZones: 0,
    totalAssignments: 0,
    activeAssignments: 0, // Add this for In Progress assignments
    pendingAssignments: 0,
    completedAssignments: 0,
    inProgressSlumSurveys: 0,
    completedSlumSurveys: 0,
    totalHouseholds: 0,
    completedHouseholds: 0,
  });

  // Chart data states
  const [wardWiseSlumData, setWardWiseSlumData] = useState<any[]>([]);
  const [slumWiseHouseholdData, setSlumWiseHouseholdData] = useState<any[]>([]);
  const [wardWiseHouseholdData, setWardWiseHouseholdData] = useState<any[]>([]);

  useEffect(() => {
    // Verify user is admin
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    if (userData?.role !== "ADMIN") {
      router.push(`/${userData?.role?.toLowerCase()}/dashboard`);
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  const loadDashboardStats = async () => {
    setStatsLoading(true);
    try {
      // Initialize default values
      let usersCount = 0;
      let surveyorsCount = 0;
      let supervisorsCount = 0;
      let slumsCount = 0;
      let totalAssignments = 0;
      let completedAssignmentsCount = 0;
      let activeAssignmentsCount = 0;
      let completedHouseholdsCount = 0;
      let completedSlumSurveysCount = 0;
      let inProgressSlumSurveysCount = 0;
      let pendingAssignmentsCount = 0;
      let totalHouseholdsCount = 0;

      // Fetch users count
      const usersResponse = await apiService.listUsers();
      const usersData = (usersResponse.data as User[]) || [];
      usersCount = usersResponse.success && usersData ? usersData.length : 0;
      surveyorsCount =
        usersResponse.success && usersData
          ? usersData.filter((user: User) => user.role === "SURVEYOR").length
          : 0;
      supervisorsCount =
        usersResponse.success && usersData
          ? usersData.filter((user: User) => user.role === "SUPERVISOR").length
          : 0;

      // Fetch slums count with a default page size to avoid potential API issues
      const slumsResponse = await apiService.getAllSlums(
        1,
        100,
        undefined,
        true,
      ); // Load all slums for count
      const slumsData = (slumsResponse.data as Slum[]) || [];
      slumsCount = slumsResponse.success && slumsData ? slumsData.length : 0;

      // Fetch wards count and calculate unique zones
      const wardsResponse = await apiService.getAllWards();
      let wardsCount = 0;
      let zonesCount = 0;
      if (wardsResponse.success && wardsResponse.data) {
        const wardsData = wardsResponse.data as any[];
        wardsCount = wardsData.length;
        // Calculate unique zones
        const uniqueZones = new Set(
          wardsData
            .map((ward: any) => ward.zone)
            .filter((zone: string) => zone),
        );
        zonesCount = uniqueZones.size;
      }

      // Process ward-wise and slum-wise data from slums
      const wardSlumMap = new Map<string, number>();
      const slumHouseholdMap = new Map<
        string,
        { total: number; completed: number }
      >();
      const wardHouseholdMap = new Map<
        string,
        { total: number; completed: number }
      >();

      if (slumsResponse.success && slumsData) {
        for (const slum of slumsData) {
          // Get ward name/number
          const wardName =
            typeof slum.ward === "object" ? slum.ward.number : "Unknown";

          // Count slums per ward
          wardSlumMap.set(wardName, (wardSlumMap.get(wardName) || 0) + 1);

          // Store slum household data
          slumHouseholdMap.set(slum.slumName || slum.name, {
            total: slum.totalHouseholds || 0,
            completed: 0, // Will be updated from assignments
          });

          // Initialize ward household data
          const wardData = wardHouseholdMap.get(wardName) || {
            total: 0,
            completed: 0,
          };
          wardData.total += slum.totalHouseholds || 0;
          wardHouseholdMap.set(wardName, wardData);
        }
      }

      // Fetch ALL assignments with high limit to get complete data
      const assignmentsResponse = await apiService.getAllAssignments(1, 1000);

      if (assignmentsResponse.success && assignmentsResponse.data) {
        const assignments = assignmentsResponse.data as Assignment[];

        // Get unique slums with assignments
        const uniqueSlums = new Map<string, Assignment[]>();
        for (const assignment of assignments) {
          const slumId = assignment.slum?._id;
          if (slumId) {
            if (!uniqueSlums.has(slumId)) {
              uniqueSlums.set(slumId, []);
            }
            uniqueSlums.get(slumId)!.push(assignment);
          }
        }

        // Count total unique slums assigned
        totalAssignments = uniqueSlums.size;

        // Count completed assignments (slums where all assignments are completed)
        completedAssignmentsCount = 0;
        for (const [slumId, slumAssignments] of uniqueSlums) {
          const allCompleted = slumAssignments.every(
            (a) => a.status === "COMPLETED",
          );
          if (allCompleted) {
            completedAssignmentsCount++;
          }
        }

        // Count active assignments (slums with at least one assignment in progress)
        activeAssignmentsCount = 0;
        for (const [slumId, slumAssignments] of uniqueSlums) {
          const hasInProgress = slumAssignments.some(
            (a) => a.status === "IN PROGRESS",
          );
          if (hasInProgress) {
            activeAssignmentsCount++;
          }
        }

        // Calculate households from unique slums (take first assignment per slum to avoid duplication)
        completedHouseholdsCount = 0;
        totalHouseholdsCount = 0;
        inProgressSlumSurveysCount = 0;
        completedSlumSurveysCount = 0;

        for (const [slumId, slumAssignments] of uniqueSlums) {
          // Take the first assignment for this slum to get household data
          const firstAssignment = slumAssignments[0];

          // Get total households from the slum data in the assignment
          if (firstAssignment.slum?.totalHouseholds) {
            totalHouseholdsCount += firstAssignment.slum.totalHouseholds;
          }

          // Get completed households from householdSurveyProgress
          if (firstAssignment.householdSurveyProgress) {
            completedHouseholdsCount +=
              firstAssignment.householdSurveyProgress.completed;
          }

          // Count slum survey statuses
          if (firstAssignment.slumSurveyStatus === "IN PROGRESS") {
            inProgressSlumSurveysCount++;
          } else if (
            firstAssignment.slumSurveyStatus === "SUBMITTED" ||
            firstAssignment.slumSurveyStatus === "COMPLETED"
          ) {
            completedSlumSurveysCount++;
          }

          // Update slum household data with completed count
          const slumName =
            firstAssignment.slum?.slumName ||
            firstAssignment.slum?.name ||
            "Unknown";
          if (slumHouseholdMap.has(slumName)) {
            const slumData = slumHouseholdMap.get(slumName)!;
            slumData.completed =
              firstAssignment.householdSurveyProgress?.completed || 0;
            slumHouseholdMap.set(slumName, slumData);
          }

          // Update ward household data with completed count
          const wardInfo = firstAssignment.slum?.ward;
          const wardName =
            typeof wardInfo === "object" ? wardInfo?.number : "Unknown";
          if (wardHouseholdMap.has(wardName)) {
            const wardData = wardHouseholdMap.get(wardName)!;
            wardData.completed +=
              firstAssignment.householdSurveyProgress?.completed || 0;
            wardHouseholdMap.set(wardName, wardData);
          }
        }
      }

      // Transform data for charts
      // Ward-wise Slum Data
      const wardSlumChartData = Array.from(wardSlumMap.entries())
        .map(([ward, count]) => ({
          name: `Ward ${ward}`,
          Slums: count,
          wardNum: parseInt(ward) || 0, // Extract numeric value for sorting
        }))
        .sort((a, b) => a.wardNum - b.wardNum) // Sort numerically
        .map(({ wardNum, ...rest }) => rest); // Remove wardNum after sorting

      // Slum-wise Household Data (Top 25 slums by household count)
      const slumHouseholdChartData = Array.from(slumHouseholdMap.entries())
        .map(([slum, data]) => ({
          name: slum,
          Completed: data.completed,
          Incomplete: Math.max(0, data.total - data.completed),
          total: data.total,
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 25); // Show top 25

      // Ward-wise Household Data
      const wardHouseholdChartData = Array.from(wardHouseholdMap.entries())
        .map(([ward, data]) => ({
          name: `Ward ${ward}`,
          Completed: data.completed,
          Incomplete: Math.max(0, data.total - data.completed),
          total: data.total,
          wardNum: parseInt(ward) || 0, // Extract numeric value for sorting
        }))
        .sort((a, b) => a.wardNum - b.wardNum) // Sort numerically
        .map(({ wardNum, ...rest }) => rest); // Remove wardNum after sorting

      setWardWiseSlumData(wardSlumChartData);
      setSlumWiseHouseholdData(slumHouseholdChartData);
      setWardWiseHouseholdData(wardHouseholdChartData);

      // Calculate pending assignments (unassigned slums)
      pendingAssignmentsCount = Math.max(0, slumsCount - totalAssignments);

      setDashboardStats({
        totalUsers: usersCount,
        totalSupervisors: supervisorsCount,
        totalSurveyors: surveyorsCount,
        totalSlums: slumsCount,
        totalWards: wardsCount,
        totalZones: zonesCount,
        totalAssignments: totalAssignments,
        activeAssignments: activeAssignmentsCount,
        pendingAssignments: pendingAssignmentsCount,
        completedAssignments: completedAssignmentsCount,
        inProgressSlumSurveys: inProgressSlumSurveysCount,
        completedSlumSurveys: completedSlumSurveysCount,
        totalHouseholds: totalHouseholdsCount,
        completedHouseholds: completedHouseholdsCount,
      });

      // Set placeholder stats for backward compatibility
      setStats([
        {
          title: "Total Users",
          value: usersCount,
          icon: <Users className="w-6 h-6" />,
          color: "from-blue-600 to-blue-700",
        },
        {
          title: "Total Slums",
          value: slumsCount, // Use actual database count
          icon: <Building2 className="w-6 h-6" />,
          color: "from-purple-600 to-purple-700",
        },
        {
          title: "Total Assignments",
          value: totalAssignments,
          icon: <GitBranch className="w-6 h-6" />,
          color: "from-cyan-600 to-cyan-700",
        },
        {
          title: "Surveys Completed",
          value: completedAssignmentsCount,
          icon: <BarChart3 className="w-6 h-6" />,
          color: "from-green-600 to-green-700",
        },
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Chart colors
  const CHART_COLORS = {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    cyan: "#06b6d4",
    green: "#10b981",
    amber: "#f59e0b",
    rose: "#f43f5e",
    slate: "#64748b",
    indigo: "#6366f1",
    red: "#f00",
    magenta: "#f000ff",
  };

  // Custom tooltip for charts - Enhanced modern design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-600 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-white font-bold mb-3 text-sm border-b border-slate-600 pb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 mb-2 last:mb-0"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-slate-300 text-xs font-medium">
                  {entry.name}
                </span>
              </div>
              <span className="text-white text-xs font-bold">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom label for pie charts - Modern center label
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    value,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for very small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold pointer-events-none"
        style={{ fontSize: "11px", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Calculate survey progress data
  const surveyProgressData = [
    {
      name: "Completed",
      value: dashboardStats.completedAssignments,
      color: CHART_COLORS.green,
    },
    {
      name: "In Progress",
      value: dashboardStats.activeAssignments,
      color: CHART_COLORS.amber,
    },
    {
      name: "Pending",
      value: dashboardStats.pendingAssignments,
      color: CHART_COLORS.slate,
    },
  ];

  // Household survey completion data
  const householdData = [
    {
      name: "Completed",
      value: dashboardStats.completedHouseholds,
      fill: CHART_COLORS.green,
    },
    {
      name: "Incomplete",
      value: Math.max(
        0,
        dashboardStats.totalHouseholds - dashboardStats.completedHouseholds,
      ),
      fill: CHART_COLORS.slate,
    },
  ];

  // User distribution data
  const userData = [
    {
      name: "Admin",
      value:
        dashboardStats.totalUsers -
        (dashboardStats.totalSurveyors + dashboardStats.totalSupervisors),
      fill: CHART_COLORS.magenta,
    },
    {
      name: "Surveyors",
      value: dashboardStats.totalSurveyors,
      fill: CHART_COLORS.blue,
    },
    {
      name: "Supervisors",
      value: dashboardStats.totalSupervisors,
      fill: CHART_COLORS.slate,
    },
  ];

  // Slum survey status data
  const slumStatusData = [
    {
      name: "Pending",
      value:
        dashboardStats.totalSlums -
        (dashboardStats.completedSlumSurveys +
          dashboardStats.inProgressSlumSurveys),
      fill: CHART_COLORS.red,
    },
    {
      name: "In Progress",
      value: dashboardStats.inProgressSlumSurveys,
      fill: CHART_COLORS.amber,
    },
    {
      name: "Completed",
      value: dashboardStats.completedSlumSurveys,
      fill: CHART_COLORS.green,
    },
  ];

  // Assignment overview data for bar chart
  const assignmentBarData = [
    {
      name: "Assignments",
      Total: dashboardStats.totalSlums,
      Pending: dashboardStats.pendingAssignments,
      Assigned: dashboardStats.totalAssignments,
      "In Progress": dashboardStats.activeAssignments,
      Completed: dashboardStats.completedAssignments,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <SupervisorAdminLayout role="ADMIN" username={user?.name || user?.username}>
      {/* Dashboard Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Admin Dashboard
          </h2>
        </div>
        <button
          onClick={loadDashboardStats}
          disabled={statsLoading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
        >
          {statsLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </>
          )}
        </button>
      </div>

      {/* Top 4 Stats Cards - Kept as is */}
      <div className="mb-8">
        <DashboardStats
          stats={[
            {
              label: "Total Users",
              value: dashboardStats.totalUsers,
              icon: <Users className="w-5 h-5" />,
              colorClass: "text-blue-500 bg-blue-500/20",
            },
            {
              label: "Total Zones",
              value: dashboardStats.totalZones,
              icon: <MapPin className="w-5 h-5" />,
              colorClass: "text-amber-500 bg-amber-500/20",
            },
            {
              label: "Total Wards",
              value: dashboardStats.totalWards,
              icon: <Building2 className="w-5 h-5" />,
              colorClass: "text-purple-500 bg-purple-500/20",
            },
            {
              label: "Total Slums",
              value: dashboardStats.totalSlums,
              icon: <MapPin className="w-5 h-5" />,
              colorClass: "text-cyan-500 bg-cyan-500/20",
            },
          ]}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Slum Survey Status */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-amber-400" />
                </div>
                Slum Survey Status
              </h3>
              <p className="text-xs text-slate-400 mt-2 ml-9">
                Current survey progress
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                {dashboardStats.inProgressSlumSurveys +
                  dashboardStats.completedSlumSurveys}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                In Progress
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={slumStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                innerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={2}
                stroke="#1e293b"
                activeShape={
                  {
                    outerRadius: 110,
                    innerRadius: 65,
                    strokeWidth: 3,
                    stroke: "#fff",
                  } as any
                }
              >
                {slumStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-offset-2 ring-offset-slate-800 ring-red-500 transition-all duration-200 group-hover:scale-125"></div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                  Pending
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {dashboardStats.totalSlums -
                    (dashboardStats.completedSlumSurveys +
                      dashboardStats.inProgressSlumSurveys)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-offset-2 ring-offset-slate-800 ring-amber-500 transition-all duration-200 group-hover:scale-125"></div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                  In Progress
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {dashboardStats.inProgressSlumSurveys}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-offset-2 ring-offset-slate-800 ring-green-500 transition-all duration-200 group-hover:scale-125"></div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                  Completed
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {dashboardStats.completedSlumSurveys}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Household Survey Completion */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                Household Surveys
              </h3>
              <p className="text-xs text-slate-400 mt-2 ml-9">
                Survey completion progress
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                {dashboardStats.totalHouseholds}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Total HH
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={householdData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                innerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={2}
                stroke="#1e293b"
                activeShape={
                  {
                    outerRadius: 110,
                    innerRadius: 65,
                    strokeWidth: 3,
                    stroke: "#FFBF00",
                  } as any
                }
              >
                {householdData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-offset-2 ring-offset-slate-800 ring-green-500 transition-all duration-200 group-hover:scale-125"></div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                  Completed
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {dashboardStats.completedHouseholds}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-slate-500 ring-2 ring-offset-2 ring-offset-slate-800 ring-slate-500 transition-all duration-200 group-hover:scale-125"></div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                  Incomplete
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {dashboardStats.totalHouseholds -
                    dashboardStats.completedHouseholds}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                User Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-2 ml-9">
                Breakdown by role
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                {dashboardStats.totalUsers}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Total Users
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={userData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                innerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={2}
                stroke="#1e293b"
                activeShape={
                  {
                    outerRadius: 110,
                    innerRadius: 65,
                    strokeWidth: 3,
                    stroke: "#8b5cf6",
                  } as any
                }
              >
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-offset-2 ring-offset-slate-800 ring-blue-500 transition-all duration-200 group-hover:scale-125"></div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                  Surveyors
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {dashboardStats.totalSurveyors}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-slate-500 ring-2 ring-offset-2 ring-offset-slate-800 ring-slate-500 transition-all duration-200 group-hover:scale-125"></div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                  Supervisors
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {dashboardStats.totalSupervisors}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-pink-400 ring-2 ring-offset-2 ring-offset-slate-800 ring-pink-400 transition-all duration-200 group-hover:scale-125"></div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                  Admins
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {dashboardStats.totalUsers -
                    (dashboardStats.totalSurveyors +
                      dashboardStats.totalSupervisors)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Metrics Bar Chart */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
                Slum Assignment Overview
              </h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={assignmentBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar
                dataKey="Total"
                fill={CHART_COLORS.blue}
                name="Total"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="Pending"
                fill={CHART_COLORS.red}
                name="Pending"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="Assigned"
                fill={CHART_COLORS.purple}
                name="Assigned"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="In Progress"
                fill={CHART_COLORS.amber}
                name="In Progress"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="Completed"
                fill={CHART_COLORS.green}
                name="Completed"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{ backgroundColor: CHART_COLORS.blue }}
              ></div>
              <span className="text-xs text-blue-400">Total</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{ backgroundColor: CHART_COLORS.red }}
              ></div>
              <span className="text-xs text-red-500">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{ backgroundColor: CHART_COLORS.purple }}
              ></div>
              <span className="text-xs text-purple-400">Assigned</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{ backgroundColor: CHART_COLORS.amber }}
              ></div>
              <span className="text-xs text-amber-400">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{ backgroundColor: CHART_COLORS.green }}
              ></div>
              <span className="text-xs text-green-400">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ward-wise Slum Bar Chart */}
      <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              Ward-wise Slum Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-2 ml-9">
              Number of slums per ward
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {dashboardStats.totalSlums}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Total Slums
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={wardWiseSlumData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              angle={-90}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend />
            <Bar
              dataKey="Slums"
              fill={CHART_COLORS.cyan}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Slum-wise Household Stacked Bar Chart */}
      <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Building2 className="w-5 h-5 text-green-400" />
              </div>
              Slum-wise Household Distribution (Top 25)
            </h3>
            <p className="text-xs text-slate-400 mt-2 ml-9">
              Household survey completion by slum
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              {dashboardStats.totalHouseholds}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Total Households
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={600}>
          <BarChart data={slumWiseHouseholdData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              angle={-90}
              textAnchor="end"
              height={220}
              interval={0}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => value}
            />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend />
            <Bar
              dataKey="Completed"
              stackId="a"
              fill={CHART_COLORS.green}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="Incomplete"
              stackId="a"
              fill={CHART_COLORS.red}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ward-wise Household Stacked Bar Chart */}
      <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              Ward-wise Household Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-2 ml-9">
              Household survey completion by ward
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {dashboardStats.totalHouseholds}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Total Households
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={wardWiseHouseholdData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              angle={-90}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend />
            <Bar
              dataKey="Completed"
              stackId="a"
              fill={CHART_COLORS.green}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="Incomplete"
              stackId="a"
              fill={CHART_COLORS.red}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SupervisorAdminLayout>
  );
}
