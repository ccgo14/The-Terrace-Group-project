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
        <Field
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && (
          <p className="text-sm font-mono text-center text-red-600 dark:text-red-400">{error}</p>
        )}
        <Button type="submit">Sign In</Button>
      </form>
    </AuthShell>
  );
}
