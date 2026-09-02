import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Users,
  Wrench,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import api from "../api/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get("/dashboard");

      setDashboard(response.data.data || response.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-[#8f1d2c]">
          Overview
        </p>

        <h1 className="mt-1 text-3xl font-bold text-[#111827]">
          Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Monitor your mechanic service operations.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={
            dashboard?.totalBookings ??
            dashboard?.bookings ??
            "—"
          }
          icon={CalendarCheck}
        />

        <StatCard
          title="Customers"
          value={
            dashboard?.totalCustomers ??
            dashboard?.customers ??
            "—"
          }
          icon={Users}
        />

        <StatCard
          title="Mechanics"
          value={
            dashboard?.totalMechanics ??
            dashboard?.mechanics ??
            "—"
          }
          icon={Wrench}
        />

        <StatCard
          title="Revenue"
          value={
            dashboard?.revenue != null
              ? `₹${dashboard.revenue}`
              : "—"
          }
          icon={IndianRupee}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#111827] p-2 text-white">
              <TrendingUp size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Booking activity
              </h2>

              <p className="text-sm text-gray-500">
                Recent system activity
              </p>
            </div>
          </div>

          <div className="mt-8 h-40 rounded-xl bg-gray-50 p-6">
            <div className="flex h-full items-end gap-3">
              {[35, 55, 40, 70, 60, 85, 65].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-md bg-[#8f1d2c]"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">
            System status
          </h2>

          <div className="mt-6 space-y-4">
            {[
              ["API Server", "Operational"],
              ["Database", "Connected"],
              ["Authentication", "Operational"],
              ["Notifications", "Operational"],
            ].map(([name, status]) => (
              <div
                key={name}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
              >
                <span className="text-sm text-gray-600">
                  {name}
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}