import { Bell } from "lucide-react";

export default function Topbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="lg:hidden">
          <span className="font-bold text-[#111827]">
            Instant Mechanic
          </span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-sm font-bold text-white">
              {(user.name || "A").charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {user.name || "Admin"}
              </p>

              <p className="text-xs text-gray-500">
                {user.role || "Administrator"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}