export default function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-[#111827]">
            {value ?? "—"}
          </h3>

          {description && (
            <p className="mt-2 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-[#8f1d2c]/10 p-3 text-[#8f1d2c]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}