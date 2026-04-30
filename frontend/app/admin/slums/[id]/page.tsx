"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiService from "@/services/api";
import SupervisorAdminLayout from "@/components/SupervisorAdminLayout";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Home,
  Calendar,
  Hash,
  Globe,
  FileText,
  Activity,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Slum {
  _id: string;
  slumName: string;
  slumId: number;
  stateCode: string;
  distCode: string;
  cityTownCode: string;
  location?: string;
  ulbCode?: string;
  ulbName?: string;
  ward:
    | {
        _id: string;
        number: string;
        name: string;
        zone: string;
      }
    | string;
  slumType: string;
  village: string;
  landOwnership: string;
  totalHouseholds: number;
  area: number;
  surveyStatus?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  role: string;
}

export default function AdminSlumDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [slum, setSlum] = useState<Slum | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Minimal user verification
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData?.role !== "ADMIN") {
        router.push(`/${userData?.role?.toLowerCase()}/dashboard`);
        return;
      }
    } catch (error) {
      console.error("Error parsing user:", error);
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userStr));
  }, [router]);

  useEffect(() => {
    const fetchSlum = async () => {
      try {
        let slumId: string | undefined;
        if (Array.isArray(id) && id.length > 0) {
          slumId = id[0];
        } else if (typeof id === "string") {
          slumId = id;
        }

        if (slumId) {
          const response = await apiService.getSlum(slumId);
          if (response.success) {
            setSlum(
              (response.data as Slum) ||
                (response.data as { slum: Slum }).slum ||
                null,
            );
          }
        }
      } catch (error) {
        console.error("Error fetching slum:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSlum();
    }
  }, [id]);

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          text: "text-emerald-400",
          icon: CheckCircle,
        };
      case "IN PROGRESS":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "text-blue-400",
          icon: Clock,
        };
      default:
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          text: "text-amber-400",
          icon: AlertCircle,
        };
    }
  };

  const getTypeColor = (type: string) => {
    return type === "NOTIFIED"
      ? {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          text: "text-emerald-400",
        }
      : {
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          text: "text-amber-400",
        };
  };

  if (loading) {
    return (
      <SupervisorAdminLayout
        role="ADMIN"
        username={user?.name || user?.username}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 font-medium">
              Loading slum details...
            </p>
          </div>
        </div>
      </SupervisorAdminLayout>
    );
  }

  if (!slum) {
    return (
      <SupervisorAdminLayout
        role="ADMIN"
        username={user?.name || user?.username}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-slate-600 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Slum Not Found</h2>
            <p className="text-slate-400">
              The requested slum details could not be loaded.
            </p>
            <button
              onClick={() => router.push("/admin/slums")}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Back to Slums
            </button>
          </div>
        </div>
      </SupervisorAdminLayout>
    );
  }

  const statusConfig = getStatusColor(slum.surveyStatus);
  const typeConfig = getTypeColor(slum.slumType);
  const StatusIcon = statusConfig.icon;

  return (
    <SupervisorAdminLayout role="ADMIN" username={user?.name || user?.username}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {slum.slumName}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-4 h-4" />
                    <span>ID: #{slum.slumId}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {typeof slum.ward === "object" && slum.ward !== null
                        ? `Ward ${slum.ward.number}`
                        : "Ward N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
              <span
                className={`px-4 py-2 rounded-lg text-sm font-semibold border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}
              >
                {slum.surveyStatus || "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Information */}
          <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
              <div className="p-2.5 bg-blue-500/20 rounded-xl">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Location Details
                </h2>
                <p className="text-xs text-slate-400">Geographic information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">State Code</p>
                  <p className="text-white font-semibold">{slum.stateCode}</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">District Code</p>
                  <p className="text-white font-semibold">{slum.distCode}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">City/Town Code</p>
                  <p className="text-white font-semibold">
                    {slum.cityTownCode || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">ULB Code</p>
                  <p className="text-white font-semibold">
                    {slum.ulbCode || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">ULB Name</p>
                  <p className="text-white font-semibold">
                    {slum.ulbName || ""}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">Zone</p>
                  <p className="text-white font-semibold">
                    {typeof slum.ward === "object" && slum.ward !== null
                      ? slum.ward.zone
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">Ward</p>
                  <p className="text-white font-semibold">
                    {typeof slum.ward === "object" && slum.ward !== null
                      ? `${slum.ward.number} - ${slum.ward.name}`
                      : slum.ward?.toString() || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">Village</p>
                  <p className="text-white font-semibold">
                    {slum.village || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
              <div className="p-2.5 bg-purple-500/20 rounded-xl">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Additional Information
                </h2>
                <p className="text-xs text-slate-400">
                  Classification & ownership
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-500">Total Households</p>
                    <Home className="w-4 h-4 text-slate-500" />
                  </div>
                  <p className="text-white font-semibold">
                    {slum.totalHouseholds || 0}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-500">Area (sq.m)</p>
                    <Globe className="w-4 h-4 text-slate-500" />
                  </div>
                  <p className="text-white font-semibold">
                    {slum.area?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-slate-500">Slum Type</p>
                  <span
                    className={`px-1 py-0.2 rounded-full text-[10px] font-semibold border ${typeConfig.bg} ${typeConfig.border} ${typeConfig.text}`}
                  >
                    {slum.slumType.replace("_", " ")}
                  </span>
                </div>
                <p className="text-white font-semibold mt-1">
                  {slum.slumType === "NOTIFIED"
                    ? "Government recognized and officially notified slum area"
                    : "Non-notified slum area without official recognition"}
                </p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-slate-500">Survey Status</p>
                  <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
                </div>
                <p className="text-white font-semibold mt-1">
                  {slum.surveyStatus === "COMPLETED"
                    ? "Survey has been fully completed"
                    : slum.surveyStatus === "IN PROGRESS"
                      ? "Survey is currently in progress"
                      : "Survey has not been initiated yet"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">Created At</p>
                  <p className="text-white font-semibold">
                    {new Date(slum.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                  <p className="text-white font-semibold">
                    {new Date(slum.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SupervisorAdminLayout>
  );
}
