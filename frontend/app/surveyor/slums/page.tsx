"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SurveyorLayout from "@/components/SurveyorLayout";
import ModernTable from "@/components/ModernTable";
import apiService from "@/services/api";
import { useToast } from "@/components/Toast";

interface Slum {
  _id: string;
  slumId: string;
  slumName: string;
  ward?:
    | {
        number: string;
        name: string;
      }
    | string;
  totalHouseholds?: number;
}

interface User {
  _id: string;
  name: string;
  username: string;
  role: string;
}

interface Assignment {
  _id: string;
  slum: Slum;
  surveyor: string;
  status: string;
  createdAt: string;
}

export default function SlumsPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [slums, setSlums] = useState<Slum[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user data
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
    }

    const loadSlums = async () => {
      try {
        setLoading(true);
        const response = await apiService.getMyAssignments();
        if (response.success) {
          // Extract slum data from assignments
          const assignedSlums = ((response.data as any[]) || []).map(
            (assignment: Assignment) => assignment.slum,
          );
          setSlums(assignedSlums);
        } else {
          showToast("Failed to load assigned slums", "error");
        }
      } catch (error) {
        console.error("Error loading assigned slums:", error);
        showToast("Error loading assigned slums", "error");
      } finally {
        setLoading(false);
      }
    };

    loadSlums();
  }, [showToast]);

  const columns = [
    {
      header: "ID",
      accessorKey: "slumId" as keyof Slum,
      sortable: true,
      className: "font-medium text-white text-xs",
    },
    {
      header: "Slum Name",
      accessorKey: "slumName" as keyof Slum,
      sortable: true,
      className: "font-medium text-white text-xs",
    },
    {
      header: "Ward",
      accessorKey: (row: Slum) => (
        <span className="text-xs">
          {row.ward
            ? typeof row.ward === "object"
              ? `${row.ward.number} - ${row.ward.name}`
              : row.ward
            : "-"}
        </span>
      ),
      sortable: true,
      sortAccessor: (row: Slum) =>
        row.ward
          ? typeof row.ward === "object"
            ? row.ward.number
            : row.ward
          : "",
      className: "text-slate-300",
    },
    {
      header: "Households",
      accessorKey: (row: Slum) => (
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          {row.totalHouseholds?.toLocaleString() || "-"}
        </span>
      ),
      sortable: true,
      sortAccessor: (row: Slum) => row.totalHouseholds || 0,
      className: "text-center",
    },
  ];

  if (loading) {
    return (
      <SurveyorLayout username={user?.name || user?.username}>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin"></div>
            <div
              className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-400/30 animate-spin"
              style={{ animationDuration: "1.5s" }}
            ></div>
          </div>
          <p className="text-slate-400 text-sm animate-pulse">
            Loading assigned slums...
          </p>
        </div>
      </SurveyorLayout>
    );
  }

  return (
    <SurveyorLayout username={user?.name || user?.username}>
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 cursor-pointer self-start"
              aria-label="Go back"
            >
              <div className="p-1.5 rounded-lg bg-slate-800/50 border border-slate-700 group-hover:bg-slate-700/50 group-hover:border-slate-600 transition-all duration-200">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
              </div>
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight bg-linear-to-r from-white to-slate-300 bg-clip-text">
                My Assigned Slums
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                {slums.length} {slums.length === 1 ? "slum" : "slums"} assigned
                to you
              </p>
            </div>

            <div className="hidden sm:block w-20"></div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
          <ModernTable
            data={slums}
            columns={columns}
            keyField="_id"
            searchPlaceholder="Search by name, ID, or ward..."
            emptyMessage="No assigned slums found"
          />
        </div>
      </div>
    </SurveyorLayout>
  );
}
