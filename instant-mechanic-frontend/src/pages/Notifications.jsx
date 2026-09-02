import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import api from "../api/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api
      .get("/notifications")
      .then((res) => {
        const data = res.data.data || res.data;

        setNotifications(
          Array.isArray(data)
            ? data
            : data.items || data.notifications || []
        );
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#111827] p-3 text-white">
          <Bell size={20} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="text-gray-500">
            System notifications and alerts.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            No notifications.
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={notification._id || index}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <h3 className="font-semibold">
                {notification.title ||
                  notification.type ||
                  "Notification"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {notification.message ||
                  notification.description ||
                  "No details available"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}