import { useEffect, useState } from "react";
import { Wrench, Search } from "lucide-react";
import api from "../api/api";
import DataTable from "../components/DataTable";

export default function Mechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/mechanics")
      .then((res) => {
        const data = res.data.data || res.data;

        setMechanics(
          Array.isArray(data)
            ? data
            : data.items || data.mechanics || []
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = mechanics.filter((mechanic) =>
    `${mechanic.name || ""} ${mechanic.email || ""} ${
      mechanic.phone || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Mechanic",
      render: (item) => (
        <div>
          <p className="font-semibold text-gray-900">
            {item.name}
          </p>
          <p className="text-xs text-gray-500">
            {item.email}
          </p>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "specialization",
      label: "Specialization",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          {item.status || "Available"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#111827] p-3 text-white">
          <Wrench size={20} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Mechanics</h1>
          <p className="text-gray-500">
            Manage your mechanic network.
          </p>
        </div>
      </div>

      <div className="mb-5 flex max-w-md items-center rounded-lg border border-gray-200 bg-white px-3">
        <Search size={18} className="text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search mechanics..."
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