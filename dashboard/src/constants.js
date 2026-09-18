// Fixed campus data and the visual language for severity.
//
// Colour is reserved entirely for severity. Nothing else in the interface is
// coloured, so a red square on the board always means the same thing.

export const BUILDINGS = ["Library-A", "Science-B", "Engineering-C", "Admin-D", "Sports-E"];

export const ROOMS = ["101", "203", "A203", "C110", "D004", "Lab-1", "Hall-2"];

export const REQUESTS = [
  "Projector not powering on, class at 14:00",
  "Air conditioning not working in the room",
  "Water leak under the sink",
  "Fire alarm going off, possible emergency",
  "Wifi down in the whole wing",
];

// Short labels; the reading itself carries the detail.
export const TYPE_LABEL = {
  occupancy: "Occupancy",
  energy: "Energy",
  environment: "Environment",
  request: "Request",
};

export const SEV = {
  normal:   { label: "Normal",   swatch: "bg-[#2E7D5B]", text: "text-[#2E7D5B]", wash: "bg-[#EAF3EE]", rank: 0 },
  warning:  { label: "Warning",  swatch: "bg-[#B67A12]", text: "text-[#8A5C0D]", wash: "bg-[#FBF2E1]", rank: 1 },
  critical: { label: "Critical", swatch: "bg-[#B3322C]", text: "text-[#8E2722]", wash: "bg-[#FAEAE9]", rank: 2 },
};

// Worst severity wins when summarising a building.
export function worstOf(events) {
  return events.reduce((worst, e) => {
    const r = SEV[e.severity]?.rank ?? 0;
    return r > (SEV[worst]?.rank ?? 0) ? e.severity : worst;
  }, "normal");
}