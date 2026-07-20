import { IconUpvote, IconComment } from "./Icons";

// ---- Full-width responsive layout -------------------------------------------
// Routes render in full viewport width with responsive container support
export function Screen({ children, scroll = true, auth = false }) {
  return <div className="w-full min-h-screen">{children}</div>;
}

// ---- Header ----------------------------------------------------------------
export function Header({ title, left, right }) {
  return (
    <header className="sticky top-0 z-10 bg-floodlight/95 dark:bg-night-pitch/95 backdrop-blur-0 border-b border-terracing/30">
      <div className="h-14 flex items-center justify-between px-4">
        <div className="w-8">{left}</div>
        <h1 className="font-display font-semibold uppercase tracking-wide text-base text-night-pitch dark:text-floodlight">
          {title}
        </h1>
        <div className="w-8 flex justify-end">{right}</div>
      </div>
    </header>
  );
}

// ---- Kind label (MATCH REPORT / FAN REACTION) ------------------------------
export function KindLabel({ children }) {
  return (
    <span className="inline-block font-mono text-[10px] tracking-[0.12em] uppercase text-terracing border border-terracing/50 px-1.5 py-0.5">
      {children}
    </span>
  );
}

// ---- Button ----------------------------------------------------------------
// Hover inverts colors; active presses down 2px with thicker border.
export function Button({
  children,
  variant = "solid",
  className = "",
  ...props
}) {
  const shared =
    "w-full font-display font-semibold uppercase tracking-wide text-sm px-4 py-3 rounded-card border transition-colors duration-100 " +
    "active:translate-y-[2px] active:border-2 disabled:opacity-40 disabled:border-dashed";
  const variants = {
    solid:
      "bg-night-pitch text-floodlight border-night-pitch hover:bg-floodlight hover:text-night-pitch " +
      "dark:bg-floodlight dark:text-night-pitch dark:border-floodlight dark:hover:bg-night-pitch dark:hover:text-floodlight",
    outline:
      "bg-transparent text-night-pitch border-terracing/60 hover:bg-night-pitch hover:text-floodlight " +
      "dark:text-floodlight dark:hover:bg-floodlight dark:hover:text-night-pitch",
  };
  return (
    <button
      className={`${shared} ${variants[variant]} ${className}`}
      {...props}>
      {children}
    </button>
  );
}

// ---- Text field ------------------------------------------------------------
export function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing mb-1.5">
        {label}
      </span>
      <input
        className="w-full bg-transparent border border-terracing/50 rounded-card px-3 py-2.5 text-sm text-night-pitch dark:text-floodlight
        placeholder:text-terracing/70 focus:outline-none focus:border-night-pitch dark:focus:border-floodlight"
        {...props}
      />
    </label>
  );
}

// ---- Article meta row (upvotes / comments) ---------------------------------
export function MetaRow({ upvotes, comments }) {
  return (
    <div className="flex items-center gap-4 text-terracing">
      <span className="flex items-center gap-1.5">
        <IconUpvote className="w-4 h-4" />
        <span className="font-mono text-xs">{upvotes}</span>
        <span className="text-xs">Upvotes</span>
      </span>
      <span className="flex items-center gap-1.5">
        <IconComment className="w-4 h-4" />
        <span className="font-mono text-xs">{comments}</span>
        <span className="text-xs">Comments</span>
      </span>
    </div>
  );
}

// ---- Live scoreboard pip ---------------------------------------------------
export function LivePip() {
  return <span className="inline-block w-2 h-2 rounded-full bg-amber-live" />;
}
