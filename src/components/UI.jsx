import { IconUpvote, IconComment, IconSun, IconMoon } from "./Icons";

// ---- Full-width responsive layout -------------------------------------------
// Routes render in full viewport width with responsive container support.
// `sidebar` reserves space for the desktop left nav (lg:pl-64).
// `nav` adds bottom padding to clear the mobile bottom bar — needed now that
// BottomNav switched from `sticky` to `fixed` (fixed floats above content
// instead of reserving space in the document flow like sticky did).
// Add `nav` to any <Screen> that renders <BottomNav /> inside it.
export function Screen({
  children,
  scroll = true,
  auth = false,
  sidebar = false,
  nav = false,
}) {
  return (
    <div
      className={`w-full min-h-screen bg-floodlight text-night-pitch dark:bg-night-pitch dark:text-floodlight ${
        sidebar ? "lg:pl-64" : ""
      } ${nav ? "pb-20 lg:pb-0" : ""}`}>
      {children}
    </div>
  );
}

// ---- Header ----------------------------------------------------------------
export function Header({ title, left, right }) {
  return (
    <header className="sticky top-0 z-10 bg-floodlight/95 dark:bg-night-pitch/95 backdrop-blur-0 border-b border-black/10 dark:border-white/10">
      <div className="h-14 flex items-center justify-between px-4">
        <div className="w-8">{left}</div>
        <h1 className="font-display font-semibold uppercase tracking-wide text-base text-night-pitch dark:text-floodlight">
          {title}
        </h1>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              const root = document.documentElement;
              const isDark = root.classList.toggle("dark");
              root.classList.add("[&_*]:!transition-none");
              setTimeout(() => root.classList.remove("[&_*]:!transition-none"), 50);
              localStorage.setItem("theme", isDark ? "dark" : "light");
            }}
            className="p-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Toggle Theme">
            {document.documentElement.classList.contains("dark") ? (
              <IconSun className="w-5 h-5" />
            ) : (
              <IconMoon className="w-5 h-5" />
            )}
          </button>
          {right}
        </div>
      </div>
    </header>
  );
}

// ---- Kind label (MATCH REPORT / FAN REACTION) ------------------------------
export function KindLabel({ children }) {
  return (
    <span className="inline-block font-mono text-[10px] tracking-[0.12em] uppercase text-terracing/70 dark:text-floodlight/50 border border-black/10 dark:border-white/10 px-1.5 py-0.5">
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
      "bg-black text-white border-black hover:opacity-90 " +
      "dark:bg-white dark:text-black dark:border-white",
    outline:
      "bg-transparent text-night-pitch border-black/10 dark:text-floodlight dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5",
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
      <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing/70 dark:text-floodlight/50 mb-1.5">
        {label}
      </span>
      <input
        className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-card px-3 py-2.5 text-sm text-night-pitch dark:text-floodlight
        placeholder:text-terracing/40 dark:placeholder:text-floodlight/40 focus:outline-none focus:border-black/50 dark:focus:border-white/50"
        {...props}
      />
    </label>
  );
}

// ---- Article meta row (upvotes / comments) ---------------------------------
export function MetaRow({ upvotes, comments }) {
  return (
    <div className="flex items-center gap-4 text-terracing/60 dark:text-floodlight/50">
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
