import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Field, Button } from "../components/UI";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const ROLES = ["User", "Author", "Admin"];

const BIO_META = {
  User: {
    label: "Terrace Bio",
    placeholder: "Tell us about your terrace style...",
  },
  Author: { label: "Writing Niche", placeholder: "What do you write about?" },
  Admin: { label: "Admin Notes", placeholder: "Internal notes (optional)..." },
};

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  username: "",
  role: ROLES[0],
  email: "",
  password: "",
  bio: "",
  image: "",
};

export default function CreateAccount() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [error, setError] = useState("");

  const update = (key, value) => setForm({ ...form, [key]: value });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview); // Clean up previous blob URL
      const url = URL.createObjectURL(file);
      update("image", url);
      setAvatarPreview(url);
    }
  };

  const bioMeta = BIO_META[form.role] || BIO_META.User;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", {
        first_name: form.firstName,
        last_name: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      login(res.data.user);
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      const serverError = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : err.response?.data?.message;

      setError(serverError || "Registration failed. Please try again.");
    }
  };

  return (
    <AuthShell
      heading="Create Account"
      sub="Join the terrace. Set up your profile and start predicting."
      footer={
        <Link
          to="/login"
          className="text-night-pitch dark:text-floodlight underline underline-offset-2">
          Already have an account? Sign in
        </Link>
      }>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="First Name"
            placeholder="FirstName"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            required
          />
          <Field
            label="Last Name"
            placeholder="LastName"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            required
          />
        </div>

        <Field
          label="Username"
          placeholder="@example1"
          value={form.username}
          onChange={(e) => update("username", e.target.value)}
          required
        />

        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing/70 dark:text-floodlight/50 mb-1.5">
            Role
          </span>
          <select
            className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-card px-3 py-2.5 text-sm text-night-pitch dark:text-floodlight focus:outline-none focus:border-black/50 dark:focus:border-white/50"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}>
            {ROLES.map((r) => (
              <option
                key={r}
                value={r}
                className="bg-floodlight dark:bg-night-pitch">
                {r}
              </option>
            ))}
          </select>
        </label>

        <Field
          label="Email"
          type="email"
          placeholder=""
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          required
        />

        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing/70 dark:text-floodlight/50 mb-1.5">
            Password
          </span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-card px-3 py-2.5 text-sm text-night-pitch dark:text-floodlight placeholder:text-terracing/40 dark:placeholder:text-floodlight/40 focus:outline-none focus:border-black/50 dark:focus:border-white/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.08em] text-terracing/60 dark:text-floodlight/50 hover:text-black dark:hover:text-white">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing/70 dark:text-floodlight/50 mb-1.5">
            {bioMeta.label}
          </span>
          <textarea
            placeholder={bioMeta.placeholder}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            rows={3}
            className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-card px-3 py-2.5 text-sm text-night-pitch dark:text-floodlight placeholder:text-terracing/40 dark:placeholder:text-floodlight/40 focus:outline-none focus:border-black/50 dark:focus:border-white/50 resize-none"
          />
        </label>

        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing/70 dark:text-floodlight/50 mb-1.5">
            Avatar
          </span>
          <div
            className="w-full h-32 rounded-card border-2 border-dashed border-black/10 dark:border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black/30 dark:hover:border-white/30 transition-colors"
            onClick={() => document.getElementById("avatar-input").click()}>
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-mono text-xs text-terracing/60 dark:text-floodlight/50">
                Click to upload image
              </span>
            )}
          </div>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </label>

        {error && (
          <p className="text-sm font-mono text-center text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <Button type="submit">Create Account</Button>
      </form>
    </AuthShell>
  );
}
