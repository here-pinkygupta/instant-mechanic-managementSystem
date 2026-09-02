import { useEffect, useState } from "react";
import { Activity as ActivityIcon } from "lucide-react";
import api from "../api/api";

export default function Activity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api
      .get("/activity")
      .then((res) => {
        const data = res.data.data || res.data;

        setActivities(
          Array.isArray(data)
            ? data
            : data.items || data.activities || []
        );
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#111827] p-3 text-white">
          <ActivityIcon size={20} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Activity</h1>
          <p className="text-gray-500">
            Recent system activity.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        {activities.map((activity, index) => (
          <div
            key={activity._id || index}
            className="flex gap-4 border-b border-gray-100 p-5 last:border-0"
          >
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#8f1d2c]" />

            <div>
              <p className="font-medium text-gray-900">
                {activity.action ||
                  activity.message ||
                  "System activity"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {activity.createdAt
                  ? new Date(
                      activity.createdAt
                    ).toLocaleString()
                  : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}