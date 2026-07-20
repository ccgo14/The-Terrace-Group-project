import { Link } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Field, Button } from "../components/UI";

export default function Signup() {
  return (
    <AuthShell
      heading="Join The Stand"
      sub="Pick a name, back your club, and start posting. It's free and takes a minute."
      footer={
        <span>
          Already a regular?{" "}
          <Link
            to="/login"
            className="text-night-pitch dark:text-floodlight underline underline-offset-2"
          >
            Sign in
          </Link>
        </span>
      }
    >
      <Field label="Username" placeholder="TerraceTom" />
      <Field label="Email" type="email" placeholder="you@theterrace.fc" />
      <Field label="Password" type="password" placeholder="Min. 8 characters" />
      <Button>Create Account</Button>
    </AuthShell>
  );
}
