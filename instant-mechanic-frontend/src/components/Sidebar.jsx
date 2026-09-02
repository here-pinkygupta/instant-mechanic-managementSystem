import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Wrench,
  Settings,
  Bell,
  Activity,
  ShieldCheck,
  LogOut,
  ExternalLink,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    path: "/bookings",
    icon: CalendarCheck,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    name: "Mechanics",
    path: "/mechanics",
    icon: Wrench,
  },
  {
    name: "Services",
    path: "/services",
    icon: Settings,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: Activity,
  },
  {
    name: "Audit Logs",
    path: "/audit-logs",
    icon: ShieldCheck,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-[#111827] text-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8f1d2c] font-bold">
              IM
            </div>

            <div>
              <h1 className="font-bold">Instant Mechanic</h1>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-[#8f1d2c] text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}

          <a
            href="http://localhost:5000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink size={18} />
            API Docs
          </a>
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-red-900/30 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}