// The switch that matters. Same idea as SEND_TO_API in the simulator.
// true  = the dashboard invents its own fake events
// false = the dashboard reads real events from the API
export const USE_FAKE_DATA = false;

// API Gateway base URL. The dashboard appends /events itself, so this
// must NOT end in /events.
export const API_URL = "https://om9pvx9xrd.execute-api.eu-north-1.amazonaws.com/prod";

// Cognito. These are public identifiers, not secrets — they travel in every
// request the browser makes anyway. No passwords live in this codebase.
export const COGNITO = {
  UserPoolId: "us-east-1_HTbluLm0f",
  ClientId: "7pmtcfoe34hloe3jje6564iv8c",
};