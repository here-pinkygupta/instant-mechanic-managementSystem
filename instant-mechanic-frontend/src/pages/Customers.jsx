import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import api from "../api/api";
import DataTable from "../components/DataTable";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await api.get("/customers");

      const data = response.data.data || response.data;

      setCustomers(
        Array.isArray(data)
          ? data
          : data.items || data.customers || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter((customer) =>
    `${customer.name || ""} ${customer.email || ""} ${
      customer.phone || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Customer",
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
      key: "vehicle",
      label: "Vehicle",
      render: (item) =>
        item.vehicle?.registrationNumber ||
        item.vehicle?.model ||
        "—",
    },
  ];

  return (
    <div>
      <PageHeader
        icon={Users}
        title="Customers"
        description="Manage registered customers."
      />

      <div className="mb-5 flex max-w-md items-center rounded-lg border border-gray-200 bg-white px-3">
        <Search size={18} className="text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
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

function PageHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[#111827] p-3 text-white">
          <Icon size={20} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[#111827]">
            {title}
          </h1>

          <p className="text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}