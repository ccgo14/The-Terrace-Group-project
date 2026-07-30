import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check for missing or invalid token strings (e.g. "null" or "undefined")
    if (!token || token === "null" || token === "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoading(false);
      return;
    }

    let cancelled = false;

    api
      .get("/auth/me")
      .then((res) => {
        if (!cancelled) {
          setUser(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const status = err.response?.status;

          // If the token is invalid (422) or unauthorized (401), clear the session cleanly
          if (status === 401 || status === 422) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          } else {
            console.error("Auth check failed:", err);
          }

          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
