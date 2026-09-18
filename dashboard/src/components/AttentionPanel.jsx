import { SEV, TYPE_LABEL } from "../constants";
import { describe, timeOf } from "../helpers";

export default function AttentionPanel({ events, isStaff }) {
  if (!isStaff) {
    const counts = events.reduce(
      (summary, event) => ({ ...summary, [event.severity]: summary[event.severity] + 1 }),
      { normal: 0, warning: 0, critical: 0 },
    );

    return (
      <section>
        <header className="px-5 py-3 border-b border-[#D5DBE1]">
          <h2 className="text-[13px] font-medium text-[#16202A]">Campus snapshot</h2>
        </header>
        <div className="grid grid-cols-2 gap-px bg-[#D5DBE1]">
          <div className="bg-white px-5 py-5">
            <p className="font-mono text-[24px] text-[#16202A]">{events.length}</p>
            <p className="mt-1 text-[12px] text-[#5A6B7A]">readings received</p>
          </div>
          <div className="bg-white px-5 py-5">
            <p className="font-mono text-[24px] text-[#2E7D5B]">{counts.normal}</p>
            <p className="mt-1 text-[12px] text-[#5A6B7A]">within range</p>
          </div>
          <div className="bg-white px-5 py-5">
            <p className="font-mono text-[24px] text-[#B67A12]">{counts.warning}</p>
            <p className="mt-1 text-[12px] text-[#5A6B7A]">warnings</p>
          </div>
          <div className="bg-white px-5 py-5">
            <p className="font-mono text-[24px] text-[#B3322C]">{counts.critical}</p>
            <p className="mt-1 text-[12px] text-[#5A6B7A]">critical</p>
          </div>
        </div>
      </section>
    );
  }

  const flagged = events.filter((e) => e.severity !== "normal");

  return (
    <section>
      <header className="flex items-baseline justify-between px-5 py-3 border-b border-[#D5DBE1]">
        <h2 className="text-[13px] font-medium text-[#16202A]">Needs attention</h2>
        <span className="font-mono text-[11px] text-[#98A4AF]">{flagged.length}</span>
      </header>

      <div className="max-h-[26rem] overflow-y-auto">
        {flagged.length === 0 && (
          <p className="px-5 py-8 text-[13px] text-[#5A6B7A]">
            Everything is within range.
          </p>
        )}

        {flagged.slice(0, 25).map((e) => {
          const sev = SEV[e.severity];
          return (
            <article key={e.event_id} className="px-5 py-3 border-b border-[#EEF1F4] last:border-0">
              <div className="flex items-baseline gap-2">
                <span className={`h-2 w-2 ${sev.swatch}`} />
                <span className={`text-[11px] font-medium ${sev.text}`}>{sev.label}</span>
                <time className="ml-auto font-mono text-[11px] text-[#98A4AF]">{timeOf(e)}</time>
              </div>
              <p className="mt-1.5 text-[13px] text-[#16202A] leading-snug">{describe(e)}</p>
              <p className="mt-0.5 text-[12px] text-[#5A6B7A]">
                {e.building.replace("-", " ")}
                {e.room && e.room !== "-" ? ` · room ${e.room}` : ""} · {TYPE_LABEL[e.event_type]}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}