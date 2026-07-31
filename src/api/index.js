// This tells Axios to check Vercel first, and fallback to localhost if offline:
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5555",
});

/**
 * Convenience to set/remove Authorization header for authenticated requests.
 * Usage: setAuthToken(token) or setAuthToken(null) to remove.
 */
export function setAuthToken(token) {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
}

export default API;
