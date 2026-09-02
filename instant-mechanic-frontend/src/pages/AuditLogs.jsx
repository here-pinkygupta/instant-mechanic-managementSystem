import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import api from "../api/api";
import DataTable from "../components/DataTable";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/audit-logs")
      .then((res) => {
        const data = res.data.data || res.data;

        setLogs(
          Array.isArray(data)
            ? data
            : data.items || data.logs || []
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: "action",
      label: "Action",
    },
    {
      key: "user",
      label: "User",
      render: (item) =>
        item.user?.email ||
        item.user?.name ||
        "—",
    },
    {
      key: "entity",
      label: "Entity",
    },
    {
      key: "createdAt",
      label: "Date",
      render: (item) =>
        item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "—",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#111827] p-3 text-white">
          <ShieldCheck size={20} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            Audit Logs
          </h1>

          <p className="text-gray-500">
            Track important system changes.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
      />
    </div>
  );
}