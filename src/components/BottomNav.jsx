import { Link } from "react-router-dom";
import { IconHome, IconFeed, IconGrid, IconUser } from "./Icons";

const items = [
  { key: "home", label: "Home", to: "/", Icon: IconHome },
  { key: "feed", label: "Feed", to: "/feed", Icon: IconFeed },
  { key: "categories", label: "Browse", to: "/categories", Icon: IconGrid },
  { key: "profile", label: "Profile", to: "/profile/1", Icon: IconUser },
];

export default function BottomNav({ active }) {
  return (
    <>
      {/* Mobile bottom navigation */}
      <nav className="lg:hidden sticky bottom-0 z-10 bg-floodlight/95 dark:bg-night-pitch/95 border-t border-black/10 dark:border-white/10">
        <div className="flex items-stretch justify-around">
          {items.map(({ key, label, to, Icon }) => {
            const isActive = key === active;
            return (
              <Link
                key={key}
                to={to}
                className={
                  "flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors duration-100 " +
                  (isActive
                    ? "text-night-pitch dark:text-floodlight"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white")
                }>
                <Icon className="w-6 h-6" />
                <span className="font-mono text-[10px] uppercase tracking-[0.08em]">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar navigation */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-floodlight dark:bg-night-pitch border-r border-black/10 dark:border-white/10 flex-col py-6 px-4">
        <div className="mb-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-live">
            The Terrace
          </span>
        </div>
        <div className="flex-1 space-y-2">
          {items.map(({ key, label, to, Icon }) => {
            const isActive = key === active;
            return (
              <Link
                key={key}
                to={to}
                className={
                  "flex items-center gap-3 px-4 py-3 rounded-card transition-colors duration-100 " +
                  (isActive
                    ? "bg-night-pitch text-floodlight dark:bg-floodlight dark:text-night-pitch"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white")
                }>
                <Icon className="w-5 h-5" />
                <span className="font-display font-semibold uppercase tracking-wide text-sm">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
