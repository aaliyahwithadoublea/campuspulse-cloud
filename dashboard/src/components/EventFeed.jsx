import { SEV, TYPE_LABEL } from "../constants";
import { describe, timeOf } from "../helpers";

// A ticker rather than a table: rows are uniform, the eye scans the left edge
// for colour and the monospaced column for time.
export default function EventFeed({ events }) {
  return (
    <section className="border-r border-[#D5DBE1]">
      <header className="flex items-baseline justify-between px-5 py-3 border-b border-[#D5DBE1]">
        <h2 className="text-[13px] font-medium text-[#16202A]">Incoming readings</h2>
        <span className="font-mono text-[11px] text-[#98A4AF]">{events.length} held</span>
      </header>

      <div className="max-h-[26rem] overflow-y-auto">
        {events.length === 0 && (
          <p className="px-5 py-10 text-[13px] text-[#98A4AF]">
            Nothing yet. Readings appear here as they arrive.
          </p>
        )}

        {events.map((e) => {
          const sev = SEV[e.severity] || SEV.normal;
          return (
            <article
              key={e.event_id}
              className="flex items-baseline gap-4 px-5 py-2.5 border-b border-[#EEF1F4] last:border-0"
            >
              <span className={`h-2 w-2 shrink-0 translate-y-[1px] ${sev.swatch}`} />
              <time className="font-mono text-[11px] text-[#98A4AF] w-[62px] shrink-0">
                {timeOf(e)}
              </time>
              <span className="text-[13px] text-[#16202A] w-[104px] shrink-0 truncate">
                {e.building.replace("-", " ")}
              </span>
              <span className="text-[12px] text-[#5A6B7A] w-[86px] shrink-0">
                {TYPE_LABEL[e.event_type]}
              </span>
              <span className="font-mono text-[12.5px] text-[#16202A] truncate">
                {describe(e)}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}