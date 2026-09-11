import { Users, Zap, Thermometer, Wrench } from "lucide-react";

export const BUILDINGS = [
  "Library-A",
  "Science-B",
  "Engineering-C",
  "Admin-D",
  "Sports-E",
];

export const ROOMS = ["101", "203", "A203", "C110", "D004", "Lab-1", "Hall-2"];

export const REQUESTS = [
  "Projector not powering on, class at 14:00",
  "Air conditioning not working in the room",
  "Water leak under the sink",
  "Fire alarm going off, possible emergency",
  "Wifi down in the whole wing",
];

// Label and icon for each event type, used across the dashboard.
export const TYPE_META = {
  occupancy: { label: "Occupancy", icon: Users },
  energy: { label: "Energy", icon: Zap },
  environment: { label: "Environment", icon: Thermometer },
  request: { label: "Requests", icon: Wrench },
};

// Muted status colours that read on a white background.
export const SEV = {
  normal: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    chip: "bg-emerald-50 text-emerald-700",
  },
  warning: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    chip: "bg-amber-50 text-amber-700",
  },
  critical: {
    dot: "bg-rose-500",
    text: "text-rose-700",
    chip: "bg-rose-50 text-rose-700",
  },
};
