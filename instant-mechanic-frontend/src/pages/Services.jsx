import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import api from "../api/api";
import DataTable from "../components/DataTable";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => {
        const data = res.data.data || res.data;

        setServices(
          Array.isArray(data)
            ? data
            : data.items || data.services || []
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: "name",
      label: "Service",
      render: (item) => (
        <span className="font-semibold text-gray-900">
          {item.name}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "price",
      label: "Price",
      render: (item) =>
        item.price != null ? `₹${item.price}` : "—",
    },
    {
      key: "duration",
      label: "Duration",
      render: (item) =>
        item.duration ? `${item.duration} min` : "—",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#111827] p-3 text-white">
          <Settings size={20} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-gray-500">
            Available mechanic services.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
      />
    </div>
  );
}