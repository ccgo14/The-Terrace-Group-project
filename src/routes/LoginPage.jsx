import { Link } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Field, Button } from "../components/UI";

export default function Login() {
  return (
    <AuthShell
      heading="Welcome Back"
      sub="Sign in to join the conversation, upvote the hot takes and keep score."
      footer={
        <span>
          New here?{" "}
          <Link
            to="/signup"
            className="text-night-pitch dark:text-floodlight underline underline-offset-2"
          >
            Create an account
          </Link>
        </span>
      }
    >
      <Field label="Email" type="email" placeholder="you@theterrace.fc" />
      <Field label="Password" type="password" placeholder="••••••••" />
      <div className="flex justify-end -mt-1">
        <Link
          to="/reset-password"
          className="font-mono text-[11px] uppercase tracking-[0.08em] text-terracing hover:text-night-pitch dark:hover:text-floodlight"
        >
          Forgot password?
        </Link>
      </div>
      <Button>Sign In</Button>
    </AuthShell>
  );
}
