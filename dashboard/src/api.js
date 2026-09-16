import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { USE_FAKE_DATA, API_URL, COGNITO } from "./config";

const pool = new CognitoUserPool(COGNITO);

// Pull the role out of the ID token. Cognito puts group membership in a
// claim called "cognito:groups", so the group the user belongs to IS the role.
function roleFromToken(session) {
  const claims = session.getIdToken().decodePayload();
  const groups = claims["cognito:groups"] || [];
  return groups.includes("staff") ? "staff" : "student";
}

function displayName(session) {
  const claims = session.getIdToken().decodePayload();
  const email = claims.email || "";
  return email.split("@")[0] || "User";
}

// Sign in against Cognito. Returns { role, name, token }.
//
// Cognito uses SRP, so the password is never sent over the network; the
// browser proves it knows the password without transmitting it.
export function signIn(email, password) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email.trim(), Pool: pool });
    const credentials = new AuthenticationDetails({
      Username: email.trim(),
      Password: password,
    });

    user.authenticateUser(credentials, {
      onSuccess: (session) => {
        resolve({
          role: roleFromToken(session),
          name: displayName(session),
          token: session.getIdToken().getJwtToken(),
        });
      },

      onFailure: (err) => {
        if (err.code === "NotAuthorizedException" || err.code === "UserNotFoundException") {
          reject(new Error("Wrong email or password"));
        } else {
          reject(new Error(err.message || "Sign in failed"));
        }
      },

      // A user created by an administrator starts in FORCE_CHANGE_PASSWORD
      // state: Cognito returns this challenge instead of tokens. Answering it
      // with the same password clears the state, and later sign-ins skip it.
      newPasswordRequired: () => {
        user.completeNewPasswordChallenge(password, {}, {
          onSuccess: (session) => {
            resolve({
              role: roleFromToken(session),
              name: displayName(session),
              token: session.getIdToken().getJwtToken(),
            });
          },
          onFailure: (err) => reject(new Error(err.message || "Could not set password")),
        });
      },
    });
  });
}

export function signOut() {
  const user = pool.getCurrentUser();
  if (user) user.signOut();
}

// Fetch recent events from the API. The ID token goes in the Authorization
// header so the API can tell who is asking.
export async function fetchRealEvents(token) {
  const res = await fetch(`${API_URL}/events?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  const data = await res.json();
  return data.events || data;
}