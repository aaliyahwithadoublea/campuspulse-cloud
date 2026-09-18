import { useState, useEffect } from "react";
import { USE_FAKE_DATA } from "../config";
import { makeFakeEvent } from "../fakeData";
import { fetchRealEvents } from "../api";
import StatusBoard from "./StatusBoard";
import EventFeed from "./EventFeed";
import AttentionPanel from "./AttentionPanel";

// A running clock: operations rooms have one, and it makes the difference
// between a live board and a screenshot obvious at a glance.
function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <time className="font-mono text-[12.5px] text-[#16202A] tabular-nums">
      {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </time>
  );
}

export default function DashboardView({ user, onLogout }) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const isStaff = user.role === "staff";

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

  return (
    <div className="min-h-screen bg-[#EEF1F4] text-[#16202A]">
      {/* Header: identity of the board on the left, who is watching on the right */}
      <header className="bg-white border-b border-[#D5DBE1]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-6">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[15px] font-semibold tracking-tight">CampusPulse</span>
            <span className="text-[12px] text-[#5A6B7A]">NorthBridge University</span>
          </div>

          <div className="ml-auto flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full rounded-full bg-[#2E7D5B] opacity-60 animate-ping" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#2E7D5B]" />
              </span>
              <Clock />
            </div>

            <div className="flex items-center gap-2.5 pl-5 border-l border-[#D5DBE1]">
              <span className="text-[13px]">{user.name}</span>
              <span className="font-mono text-[10.5px] text-[#5A6B7A] border border-[#D5DBE1] px-1.5 py-0.5">
                {user.role}
              </span>
              <button
                onClick={onLogout}
                className="ml-1 text-[12.5px] text-[#5A6B7A] hover:text-[#16202A] underline underline-offset-2 decoration-[#D5DBE1] hover:decoration-[#16202A]"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-7">
        {error && (
          <div className="mb-6 bg-white border-l-2 border-[#B3322C] px-5 py-3.5">
            <p className="text-[13px] text-[#16202A]">Readings are not arriving.</p>
            <p className="mt-0.5 font-mono text-[12px] text-[#5A6B7A]">{error}</p>
          </div>
        )}

        <div className="flex items-baseline justify-between mb-3">
          <h1 className="text-[17px] font-semibold tracking-tight">Building status</h1>
          <p className="text-[12.5px] text-[#5A6B7A]">
            Worst reading in the last hundred, per building
          </p>
        </div>

        <div className="bg-white">
          <StatusBoard events={events} />
        </div>

        <div className="mt-7 bg-white border border-[#D5DBE1] grid lg:grid-cols-[1.55fr_1fr]">
          <EventFeed events={events} />
          <AttentionPanel events={events} isStaff={isStaff} />
        </div>

        <p className="mt-6 text-[12px] text-[#98A4AF]">
          Severity is calculated when a reading reaches the API, not by the device that sent it.
        </p>
      </main>
    </div>
  );
}