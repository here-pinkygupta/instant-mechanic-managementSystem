import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Search,
  Download,
} from "lucide-react";

import api from "../api/api";
import DataTable from "../components/DataTable";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.get("/bookings");

      const data = response.data.data || response.data;

      setBookings(
        Array.isArray(data)
          ? data
          : data.items || data.bookings || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter((booking) =>
    JSON.stringify(booking)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const exportBookings = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/bookings/export`,
      "_blank"
    );
  };

  const columns = [
    {
      key: "bookingId",
      label: "Booking ID",
      render: (item) => (
        <span className="font-semibold">
          {item.bookingId || item._id}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (item) =>
        item.customer?.name ||
        item.customer?.email ||
        "—",
    },
    {
      key: "mechanic",
      label: "Mechanic",
      render: (item) =>
        item.mechanic?.name ||
        "Unassigned",
    },
    {
      key: "scheduledAt",
      label: "Scheduled",
      render: (item) =>
        item.scheduledAt
          ? new Date(item.scheduledAt).toLocaleString()
          : "—",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Status status={item.status} />
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#111827] p-3 text-white">
            <CalendarCheck size={20} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Bookings
            </h1>

            <p className="text-gray-500">
              Manage mechanic service bookings.
            </p>
          </div>
        </div>

        <button
          onClick={exportBookings}
          className="flex items-center gap-2 rounded-lg bg-[#8f1d2c] px-4 py-3 text-sm font-semibold text-white hover:bg-[#751622]"
        >
          <Download size={17} />
          Export CSV
        </button>
      </div>

      <div className="mb-5 flex max-w-md items-center rounded-lg border border-gray-200 bg-white px-3">
        <Search size={18} className="text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookings..."
          className="w-full px-3 py-3 outline-none"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
      />
    </div>
  );
}

function Status({ status }) {
  const styles = {
    PENDING: "bg-yellow-50 text-yellow-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    IN_PROGRESS: "bg-purple-50 text-purple-700",
    COMPLETED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}