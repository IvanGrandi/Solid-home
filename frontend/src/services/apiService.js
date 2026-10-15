import { auth, clearSession } from "./session";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Small fetch wrapper with the same shape the services used with axios:
// resolves to { data }, rejects with an Error carrying error.response = { status, data }.
async function request(method, path, body) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth.session) headers["x-access-token"] = auth.session.token;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text; // Non-JSON response
  }

  if (!response.ok) {
    // The server rejected our token (expired, user deleted...): log out and go to the login page
    if (response.status === 401 && auth.session) {
      clearSession();
      window.location.assign("/login");
    }
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.response = { status: response.status, data };
    throw error;
  }

  return { data };
}

const apiClient = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};

export default apiClient;
