import { BUILDINGS, SEV, worstOf } from "../constants";

// The board is the first thing on screen because the operational question is
// "which building needs me", not "how many events have arrived".
export default function StatusBoard({ events }) {
  return (
    <section className="border-t border-[#D5DBE1]">
      <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-[#D5DBE1] border-b border-[#D5DBE1]">
        {BUILDINGS.map((building) => {
          const mine = events.filter((e) => e.building === building);
          const state = worstOf(mine);
          const sev = SEV[state];
          const attention = mine.filter((e) => e.severity !== "normal").length;

          // Last twelve readings, oldest on the left, as a coarse activity strip.
          const strip = mine.slice(0, 12).reverse();

          return (
            <div key={building} className={`px-5 py-4 ${state === "normal" ? "bg-white" : sev.wash}`}>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-medium text-[#16202A] tracking-tight">
                  {building.replace("-", " ")}
                </span>
                <span className={`h-2 w-2 ${sev.swatch}`} aria-label={sev.label} />
              </div>

              <div className="mt-3 flex items-end gap-[3px] h-8">
                {strip.length === 0 && (
                  <span className="text-[11px] text-[#98A4AF] font-mono">no data</span>
                )}
                {strip.map((e) => (
                  <span
                    key={e.event_id}
                    className={`w-[6px] ${SEV[e.severity]?.swatch || SEV.normal.swatch}`}
                    style={{ height: e.severity === "critical" ? 28 : e.severity === "warning" ? 18 : 9 }}
                    title={`${e.severity}`}
                  />
                ))}
              </div>

              <div className="mt-3 font-mono text-[11px] text-[#5A6B7A]">
                {attention > 0
                  ? `${attention} need${attention === 1 ? "s" : ""} attention`
                  : `${mine.length} reading${mine.length === 1 ? "" : "s"}`}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}