import { useState } from "react";
import { Activity, Lock } from "lucide-react";
import { signIn } from "../api";

// The sign-in screen. Calls signIn(), and on success hands the user up to App.
export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const user = await signIn(email, password);
      onLogin(user);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  // Fill the fields from a demo account button.
  function fill(role) {
    setEmail(`${role}@northbridge.edu`);
    setPassword(`${role}123`);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="h-9 w-9 rounded-md bg-indigo-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold text-neutral-900 leading-tight">
              CampusPulse
            </div>
            <div className="text-xs text-neutral-500">
              NorthBridge University · operations
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-neutral-200 p-6">
          <div className="flex items-center gap-2 text-neutral-700 mb-5">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Sign in to continue</span>
          </div>

          <label className="block text-xs text-neutral-500 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="you@northbridge.edu"
            className="w-full rounded-lg bg-white border border-neutral-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none px-3 py-2 text-sm text-neutral-900 mb-4"
          />

          <label className="block text-xs text-neutral-500 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="password"
            className="w-full rounded-lg bg-white border border-neutral-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none px-3 py-2 text-sm text-neutral-900 mb-4"
          />

          {error && <div className="text-sm text-rose-600 mb-3">{error}</div>}

          <button
            onClick={submit}
            disabled={busy}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm py-2.5 transition-colors"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <div className="mt-5 pt-4 border-t border-neutral-200">
            <div className="text-xs text-neutral-500 mb-2">
              Demo accounts — click to fill
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fill("staff")}
                className="flex-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 py-2 transition-colors"
              >
                Staff
              </button>
              <button
                onClick={() => fill("student")}
                className="flex-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 py-2 transition-colors"
              >
                Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
