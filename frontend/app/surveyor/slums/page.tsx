"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyorLayout from "@/components/SurveyorLayout";
import ModernTable from "@/components/ModernTable";
import apiService from "@/services/api";
import { useToast } from "@/components/Toast";

interface Slum {
  _id: string;
  name: string;
  location: string;
  population?: number;
  area?: string;
}

export default function SlumsPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [slums, setSlums] = useState<Slum[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
        const response = await apiService.getSlums();
        if (response.success) {
          setSlums(response.data || []);
        } else {
          showToast("Failed to load slums", "error");
        }
      } catch (error) {
        console.error("Error loading slums:", error);
        showToast("Error loading slums", "error");
      } finally {
        setLoading(false);
      }
    };

    loadSlums();
  }, []);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Slum,
      sortable: true,
      className: "font-medium text-white",
    },
    {
      header: "Location",
      accessorKey: "location" as keyof Slum,
      sortable: true,
    },
    {
      header: "Population",
      accessorKey: (row: Slum) => row.population?.toLocaleString() || "-",
    },
    {
      header: "Area",
      accessorKey: (row: Slum) => row.area || "-",
    },
  ];

  if (loading) {
    return (
      <SurveyorLayout username={user?.name || user?.username}>
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </SurveyorLayout>
    );
  }

  return (
    <SurveyorLayout username={user?.name || user?.username}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Available Slums</h1>
            <p className="text-slate-400 mt-1">Select a slum to conduct surveys</p>
        </div>

        <ModernTable
            data={slums}
            columns={columns}
            keyField="_id"
            searchPlaceholder="Search slums..."
            onRowClick={(row) => router.push(`/surveyor/slums/${row._id}`)}
        />
      </div>
    </SurveyorLayout>
  );
}
