// The switch that matters. Same idea as SEND_TO_API in the simulator.
// true  = the dashboard invents its own fake events (use while the API is being built)
// false = the dashboard reads real events from the API
export const USE_FAKE_DATA = true;

// Filled in once the API exists.
export const API_URL = "PASTE_YOUR_API_URL_HERE";

// Cognito. These are public identifiers, not secrets — they travel in every
// request the browser makes anyway. No passwords live in this codebase.
export const COGNITO = {
  UserPoolId: "us-east-1_HTbluLm0f",
  ClientId: "7pmtcfoe34hloe3jje6564iv8c",
};