import { BUILDINGS, ROOMS, REQUESTS } from "./constants";

// Work out a severity from a reading. The real API does this server-side;
// the dashboard mirrors it here only so the demo data looks realistic.
export function severityFor(type, value, description) {
  if (type === "occupancy")
    return value > 100 ? "critical" : value > 80 ? "warning" : "normal";
  if (type === "energy")
    return value > 350 ? "critical" : value > 200 ? "warning" : "normal";
  if (type === "environment")
    return value > 30 || value < 15
      ? "critical"
      : value > 26
        ? "warning"
        : "normal";
  if (type === "request") {
    const t = (description || "").toLowerCase();
    if (t.includes("fire") || t.includes("flood") || t.includes("emergency"))
      return "critical";
    if (t.includes("not working") || t.includes("leak") || t.includes("down"))
      return "warning";
  }
  return "normal";
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Build one random event matching the schema.
export function makeFakeEvent() {
  const type = pick(["occupancy", "energy", "environment", "request"]);
  const id = `evt-2026-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;
  const base = {
    event_id: id,
    building: pick(BUILDINGS),
    timestamp: new Date().toISOString(),
  };

  if (type === "occupancy") {
    const value = Math.floor(Math.random() * 120);
    return {
      ...base,
      room: pick(ROOMS),
      event_type: type,
      value,
      unit: "people",
      severity: severityFor(type, value),
    };
  }
  if (type === "energy") {
    const value = Math.round(Math.random() * 380 * 10) / 10;
    return {
      ...base,
      room: "-",
      event_type: type,
      value,
      unit: "kWh",
      severity: severityFor(type, value),
    };
  }
  if (type === "environment") {
    const value = Math.round((12 + Math.random() * 22) * 10) / 10;
    return {
      ...base,
      room: pick(ROOMS),
      event_type: type,
      value,
      unit: "celsius",
      severity: severityFor(type, value),
    };
  }
  const description = pick(REQUESTS);
  return {
    ...base,
    room: pick(ROOMS),
    event_type: type,
    description,
    reported_by: `student-${Math.floor(1000 + Math.random() * 9000)}`,
    severity: severityFor(type, null, description),
  };
}
