import { USE_FAKE_DATA, API_URL, API_KEY, DEMO_USERS } from "./config";

// Fetch recent events from the real API. Used when USE_FAKE_DATA is false.
export async function fetchRealEvents(token) {
  const res = await fetch(`${API_URL}/events?limit=50`, {
    headers: { "x-api-key": API_KEY, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  const data = await res.json();
  return data.events || data;
}

// Sign a user in. Demo check now; swaps to Cognito later by replacing the
// inside of this function. Returns { role, name }.
export async function signIn(email, password) {
  if (USE_FAKE_DATA) {
    const user = DEMO_USERS[email.trim().toLowerCase()];
    if (!user || user.password !== password) {
      throw new Error("Wrong email or password");
    }
    return { role: user.role, name: user.name };
  }
  // Later: call Cognito here, get a token, read the role from the token's group.
  throw new Error("Real login not wired up yet");
}
