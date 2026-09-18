import { Card } from "antd";

/** Metric tile with icon badge — consistent padding and alignment. */
export default function StatCard({ label, value, icon }) {
  return (
    <Card bordered={false} className="stat-card h-full shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-semibold leading-none tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600"
          aria-hidden
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
