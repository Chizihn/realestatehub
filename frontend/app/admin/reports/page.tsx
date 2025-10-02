"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminApi } from "@/lib/api";
import {
  BarChart3,
  ChevronLeft,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Home,
} from "lucide-react";
import Link from "next/link";

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState("users");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getReports({
        type: reportType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      setReportData(response.data.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field: string, value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    fetchReport();
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="flex items-center text-primary-600 hover:text-primary-700 mb-2"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Admin Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-primary-600" />
              Reports & Analytics
            </h1>
            <p className="mt-1 text-gray-600">
              Generate detailed reports and analytics
            </p>
          </div>
        </div>

        {/* Report Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="users">Users Report</option>
                <option value="properties">Properties Report</option>
                <option value="activity">Activity Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  handleDateRangeChange("startDate", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  handleDateRangeChange("endDate", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>

        {/* Report Results */}
        {reportData && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {reportType} Report
              </h2>
              <button className="flex items-center px-3 py-2 text-sm text-primary-600 hover:text-primary-700">
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>

            <div className="p-6">
              {reportType === "users" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-6 h-6 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-blue-600">Total Users</p>
                          <p className="text-xl font-bold text-blue-900">
                            {reportData.totalUsers}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-3">
                      Users by Role
                    </h3>
                    <div className="space-y-2">
                      {reportData.usersByRole?.map((item: any) => (
                        <div
                          key={item.role}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <span className="font-medium">{item.role}</span>
                          <span className="text-gray-600">
                            {item.count} users
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {reportType === "properties" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Home className="w-6 h-6 text-green-600 mr-2" />
                        <div>
                          <p className="text-sm text-green-600">
                            Total Properties
                          </p>
                          <p className="text-xl font-bold text-green-900">
                            {reportData.totalProperties}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-semibold text-gray-900 mb-3">
                        Properties by Type
                      </h3>
                      <div className="space-y-2">
                        {reportData.propertiesByType?.map((item: any) => (
                          <div
                            key={item.type}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <span className="font-medium">{item.type}</span>
                            <span className="text-gray-600">
                              {item.count} properties
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-semibold text-gray-900 mb-3">
                        Properties by Status
                      </h3>
                      <div className="space-y-2">
                        {reportData.propertiesByStatus?.map((item: any) => (
                          <div
                            key={item.status}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <span className="font-medium">{item.status}</span>
                            <span className="text-gray-600">
                              {item.count} properties
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {reportType === "activity" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-6 h-6 text-purple-600 mr-2" />
                        <div>
                          <p className="text-sm text-purple-600">New Users</p>
                          <p className="text-xl font-bold text-purple-900">
                            {reportData.newUsers}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Home className="w-6 h-6 text-orange-600 mr-2" />
                        <div>
                          <p className="text-sm text-orange-600">
                            New Properties
                          </p>
                          <p className="text-xl font-bold text-orange-900">
                            {reportData.newProperties}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-6 h-6 text-pink-600 mr-2" />
                        <div>
                          <p className="text-sm text-pink-600">New Favorites</p>
                          <p className="text-xl font-bold text-pink-900">
                            {reportData.newFavorites}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
