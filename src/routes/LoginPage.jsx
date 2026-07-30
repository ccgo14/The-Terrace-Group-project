import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Field, Button } from "../components/UI";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const token = res.data.token || res.data.access_token;
      const user = res.data.user;

      if (token) localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        login(user);
      }

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      const serverError =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : null);

      setError(serverError || "Login failed. Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-150"
          >
            ← Back to homepage
          </Link>
        </div>

        <AuthShell
          heading="Sign In"
          sub="Enter the terrace. Access predictions, reactions, and live match banter."
          footer={
            <Link
              to="/signup"
              className="text-night-pitch dark:text-floodlight underline underline-offset-2"
            >
              Create an account
            </Link>
          }
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Email"
          type="email"
          placeholder="you@theterrace.fc"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing/70 dark:text-floodlight/50 mb-1.5">
            Password
          </span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-card px-3 py-2.5 text-sm text-night-pitch dark:text-floodlight placeholder:text-terracing/40 dark:placeholder:text-floodlight/40 focus:outline-none focus:border-black/50 dark:focus:border-white/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.08em] text-terracing/60 dark:text-floodlight/50 hover:text-black dark:hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        {error && (
          <p className="text-sm font-mono text-center text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <Button type="submit">Sign In</Button>
      </form>
      </AuthShell>
      </div>
    </div>
  );
}
