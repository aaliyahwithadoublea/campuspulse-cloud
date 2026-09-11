// The switches that matter. Same idea as SEND_TO_API in the simulator.
// true  = the dashboard invents its own fake events, and login is a demo (use now)
// false = the dashboard talks to your real API and Cognito login (use later)
export const USE_FAKE_DATA = true;

// Filled in later, once your partner gives you the API details.
export const API_URL = "PASTE_YOUR_API_URL_HERE";
export const API_KEY = "PASTE_YOUR_API_KEY_HERE";

// Demo accounts, only used while USE_FAKE_DATA is true. Real logins come from
// Cognito later and these get deleted.
export const DEMO_USERS = {
  "staff@northbridge.edu": {
    password: "staff123",
    role: "staff",
    name: "Ops Staff",
  },
  "student@northbridge.edu": {
    password: "student123",
    role: "student",
    name: "Student",
  },
};
