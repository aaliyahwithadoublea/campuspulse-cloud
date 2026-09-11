// One summary tile: an icon, a label, and a big number.
export default function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-white border border-neutral-200 p-4">
      <div className="flex items-center gap-2 text-neutral-500">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold text-neutral-900 tabular-nums">
        {value}
      </div>
      <div className="text-xs text-neutral-400 mt-1">events seen</div>
    </div>
  );
}
