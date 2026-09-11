import { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import DashboardView from "./components/DashboardView";

// Top level: show the login screen until someone signs in, then the dashboard.
export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  return <DashboardView user={user} onLogout={() => setUser(null)} />;
}