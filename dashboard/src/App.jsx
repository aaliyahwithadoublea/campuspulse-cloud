import { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import DashboardView from "./components/DashboardView";
import { signOut } from "./api";

// Top level: show the login screen until someone signs in, then the dashboard.
export default function App() {
  const [user, setUser] = useState(null);

  function handleLogout() {
    signOut();
    setUser(null);
  }

  if (!user) return <LoginScreen onLogin={setUser} />;
  return <DashboardView user={user} onLogout={handleLogout} />;
}