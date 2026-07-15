
import { useState } from "react";

export default function LogInPage({ onNavigateToRegister }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", credentials);
    // Handle authentication logic here
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col justify-between px-6 py-4 font-sans text-[#1e293b]">
      {/* Top Header Navigation */}
      <div>
        <div className="flex items-center justify-between py-2 mb-8">
          <button 
            type="button" 
            className="text-slate-800 p-1"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-slate-900 tracking-wide pr-5">Log in</h2>
          <div className="w-5" /> {/* Visual balancer for centering the title */}
        </div>

        {/* Hero Typography Group */}
        <div className="space-y-3 mb-10">
          <h1 className="text-[32px] font-bold text-slate-950 leading-tight tracking-tight">
            Welcome Back
          </h1>
          {/* <p className="text-slate-500 text-base leading-relaxed font-normal max-w-sm">
            Log In
          </p> */}
        </div>

        {/* Input Fields & Submit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl px-4 py-4 text-base focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition duration-150"
              required
            />
          </div>

          <div className="flex flex-col">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl px-4 py-4 text-base focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition duration-150"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1e2530] hover:bg-[#2d3748] text-white font-semibold py-4 px-6 rounded-xl shadow-sm transition duration-200 mt-2 text-base tracking-wide"
          >
            Log In
          </button>

          {/* Secondary Link Action */}
          <div className="text-center pt-3">
            <button
              type="button"
              className="text-slate-500"
            >
              Forgotten Password?
            </button>
          </div>
        </form>
      </div>

      {/* Footer Navigation Link */}
      <div className="text-center text-sm font-medium text-slate-500 py-6">
        New here?{" "}
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="text-indigo-600 "
        >
          Create an account
        </button>
      </div>
    </div>
  );
}