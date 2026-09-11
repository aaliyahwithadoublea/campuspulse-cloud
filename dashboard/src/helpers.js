// Small formatting helpers shared by the dashboard components.

// Turn one event into the short text shown in the feed.
export function describe(ev) {
  if (ev.event_type === "request") return ev.description;
  return `${ev.value} ${ev.unit}`;
}

// Format an event's timestamp as a readable clock time.
export function timeOf(ev) {
  return new Date(ev.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
