import { useState, useEffect } from "react";
import { Activity, AlertTriangle, LogOut, Lock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { USE_FAKE_DATA } from "../config";
import { BUILDINGS, TYPE_META, SEV } from "../constants";
import { makeFakeEvent } from "../fakeData";
import { fetchRealEvents } from "../api";
import { describe, timeOf } from "../helpers";
import Metric from "./Metric";

// The main dashboard, shown once a user is signed in.
export default function DashboardView({ user, onLogout }) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const isStaff = user.role === "staff";

  // Pull a new event (or a fresh batch from the API) on a timer.
  useEffect(() => {
    let active = true;
    async function tick() {
      if (USE_FAKE_DATA) {
        setEvents((prev) => [makeFakeEvent(), ...prev].slice(0, 100));
      } else {
        try {
          const list = await fetchRealEvents(user.token);
          if (!active) return;
          setError(null);
          setEvents(list.slice(0, 100));
        } catch (e) {
          if (active) setError(e.message);
        }
      }
    }
    tick();
    const interval = setInterval(tick, USE_FAKE_DATA ? 1500 : 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user]);

  // Count events per type for the summary tiles.
  const counts = events.reduce((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] || 0) + 1;
    return acc;
  }, {});

  const alerts = events.filter(
    (e) => e.severity === "warning" || e.severity === "critical",
  );

  const perBuilding = BUILDINGS.map((b) => ({
    name: b.split("-")[0],
    events: events.filter((e) => e.building === b).length,
  }));

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* top bar */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-neutral-900 leading-tight">
                CampusPulse
              </h1>
              <p className="text-xs text-neutral-500">
                NorthBridge University · operations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-70" />
                <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {USE_FAKE_DATA ? "Live (demo data)" : "Live"}
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-neutral-200">
              <span className="text-sm text-neutral-700">{user.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${isStaff ? "bg-indigo-50 text-indigo-700" : "bg-neutral-100 text-neutral-500"}`}
              >
                {user.role}
              </span>
              <button
                onClick={onLogout}
                className="text-neutral-400 hover:text-neutral-700 ml-1"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
            Can't reach the API: {error}. Check the URL and key in config.js.
          </div>
        )}

        {/* summary tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Object.entries(TYPE_META).map(([key, meta]) => (
            <Metric
              key={key}
              icon={meta.icon}
              label={meta.label}
              value={counts[key] || 0}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* live feed */}
          <div className="lg:col-span-2 rounded-lg bg-white border border-neutral-200">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200">
              <Activity className="w-4 h-4 text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700">
                Live event feed
              </span>
            </div>
            <div className="divide-y divide-neutral-100 max-h-[28rem] overflow-y-auto">
              {events.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-neutral-400">
                  Waiting for events…
                </div>
              )}
              {events.map((ev) => {
                const sev = SEV[ev.severity] || SEV.normal;
                const meta = TYPE_META[ev.event_type];
                return (
                  <div
                    key={ev.event_id}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm"
                  >
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${sev.dot}`}
                    />
                    <span className="text-neutral-400 tabular-nums text-xs w-20 shrink-0">
                      {timeOf(ev)}
                    </span>
                    <span className="text-neutral-700 w-28 shrink-0">
                      {ev.building}
                    </span>
                    <span className="text-neutral-400 w-24 shrink-0">
                      {meta?.label}
                    </span>
                    <span className="text-neutral-800 truncate">
                      {describe(ev)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* right column */}
          <div className="space-y-6">
            {/* Alerts: staff only. This is the role-gated part the brief asks for. */}
            {isStaff ? (
              <div className="rounded-lg bg-white border border-neutral-200">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-neutral-700">
                    Alerts
                  </span>
                  <span className="ml-auto text-xs text-neutral-400 tabular-nums">
                    {alerts.length}
                  </span>
                </div>
                <div className="divide-y divide-neutral-100 max-h-52 overflow-y-auto">
                  {alerts.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-neutral-400">
                      Nothing needs attention
                    </div>
                  )}
                  {alerts.slice(0, 20).map((ev) => {
                    const sev = SEV[ev.severity];
                    return (
                      <div key={ev.event_id} className="px-4 py-2.5 text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium px-1.5 py-0.5 rounded ${sev.chip}`}
                          >
                            {ev.severity}
                          </span>
                          <span className="text-neutral-400 text-xs ml-auto">
                            {ev.building}
                          </span>
                        </div>
                        <div className="text-neutral-700 mt-1 truncate">
                          {describe(ev)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white border border-neutral-200 p-6 text-center">
                <Lock className="w-5 h-5 text-neutral-300 mx-auto mb-2" />
                <div className="text-sm text-neutral-500">
                  Alerts are staff only
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Sign in as staff to view
                </div>
              </div>
            )}

            {/* per-building chart */}
            <div className="rounded-lg bg-white border border-neutral-200 p-4">
              <div className="text-sm font-medium text-neutral-700 mb-3">
                Events by building
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={perBuilding}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#a3a3a3", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a3a3a3", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e5e5e5",
                      borderRadius: 8,
                      color: "#171717",
                    }}
                  />
                  <Bar dataKey="events" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
