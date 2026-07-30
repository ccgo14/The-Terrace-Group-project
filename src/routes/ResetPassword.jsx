import { Link } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Field, Button } from "../components/UI";

export default function ResetPassword() {
  return (
    <AuthShell
      heading="Reset Password"
      sub="Enter the email tied to your account and we'll send a link to get you back on the terrace."
      footer={
        <Link
          to="/login"
          className="text-night-pitch dark:text-floodlight underline underline-offset-2"
        >
          Back to sign in
        </Link>
      }
    >
      <Field label="Email" type="email" placeholder="you@theterrace.fc" />
      <Button>Send Reset Link</Button>
      <Button variant="outline" disabled>
        Resend in 30s
      </Button>
    </AuthShell>
  );
}
