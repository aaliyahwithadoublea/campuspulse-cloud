import { useState } from "react";
import { signIn } from "../api";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      onLogin(await signIn(email, password));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full bg-white border border-[#D5DBE1] focus:border-[#16202A] focus:outline-none " +
    "px-3 py-2.5 text-[13.5px] text-[#16202A] placeholder:text-[#98A4AF]";

  return (
    <div className="min-h-screen bg-[#EEF1F4] text-[#16202A] grid lg:grid-cols-2">
      {/* Left: what this is, stated plainly rather than sold */}
      <div className="hidden lg:flex flex-col justify-between bg-[#16202A] text-white px-12 py-12">
        <span className="text-[15px] font-semibold tracking-tight">CampusPulse</span>

        <div>
          <p className="text-[27px] leading-[1.25] tracking-tight max-w-[15ch]">
            Five buildings, one operations board.
          </p>
          <p className="mt-5 text-[13.5px] text-[#9FB0BF] leading-relaxed max-w-[42ch]">
            Occupancy, energy, environment and reported faults arrive together,
            scored as they land, so the operations team sees a problem while it
            is still small.
          </p>
        </div>

        <div className="flex gap-6 font-mono text-[11px] text-[#7C8FA0]">
          <span className="flex items-center gap-2"><i className="h-2 w-2 bg-[#2E7D5B] not-italic" />normal</span>
          <span className="flex items-center gap-2"><i className="h-2 w-2 bg-[#B67A12] not-italic" />warning</span>
          <span className="flex items-center gap-2"><i className="h-2 w-2 bg-[#B3322C] not-italic" />critical</span>
        </div>
      </div>

      {/* Right: the form */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[350px]">
          <h1 className="text-[20px] font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1.5 text-[13px] text-[#5A6B7A]">
            Use your campus account.
          </p>

          <div className="mt-8">
            <label htmlFor="email" className="block text-[12.5px] text-[#5A6B7A] mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="you@northbridge.edu"
              className={field}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="block text-[12.5px] text-[#5A6B7A] mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="••••••••"
              className={field}
            />
          </div>

          {error && (
            <p className="mt-4 border-l-2 border-[#B3322C] pl-3 text-[13px] text-[#8E2722]">
              {error}
            </p>
          )}

          <button
            onClick={submit}
            disabled={busy}
            className="mt-6 w-full bg-[#16202A] hover:bg-[#233140] disabled:opacity-40
                       text-white text-[13.5px] font-medium py-2.5 transition-colors"
          >
            {busy ? "Signing in" : "Sign in"}
          </button>

          <p className="mt-6 pt-5 border-t border-[#D5DBE1] text-[12.5px] text-[#5A6B7A] leading-relaxed">
            Accounts are created by campus IT. There is no public sign-up.
          </p>
        </div>
      </div>
    </div>
  );
}