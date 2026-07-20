import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Field, Button } from "../components/UI";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("isAuthenticated", "true");
    navigate("/profile/1");
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
        <Button type="submit">Sign In</Button>
      </form>
    </AuthShell>
  );
}
