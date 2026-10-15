import { reactive } from "vue";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "user"; // Same key as before, so existing logins survive the update
const USERNAME_KEY = "userName";

// Reactive so the menu and pages update on login/logout without reloading the page
export const auth = reactive({ session: null });

function readSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    if (payload.exp && payload.exp * 1000 <= Date.now()) return null; // Expired
    return {
      token,
      roles: payload.roles || [],
      username: localStorage.getItem(USERNAME_KEY) || "",
    };
  } catch {
    return null; // Malformed token
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem("role"); // Legacy key from older versions
  auth.session = null;
}

// Re-reads the stored token, dropping it if it's expired or invalid
export function refreshSession() {
  auth.session = readSession();
  if (!auth.session) clearSession();
  return auth.session;
}

export function saveSession(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
  return refreshSession();
}

refreshSession();
