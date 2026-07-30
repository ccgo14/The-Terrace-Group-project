import { Link } from "react-router-dom";
import {
  IconHome,
  IconFeed,
  IconGrid,
  IconUser,
  IconComment,
  IconBookmark,
} from "./Icons";

// Mobile bottom bar mirrors the Figma reference exactly: Home / My Comments / Bookmarks / Profile.
// Feed and Categories aren't dropped from the app — they're just not primary mobile nav items,
// same tradeoff the Figma reference makes (4 tabs max on a bottom bar).
const mobileItems = [
  { key: "home", label: "Home", to: "/", Icon: IconHome },
  {
    key: "comments",
    label: "My Comments",
    to: "/my-comments",
    Icon: IconComment,
  },
  {
    key: "bookmarks",
    label: "Bookmarks",
    to: "/bookmarks",
    Icon: IconBookmark,
  },
  { key: "profile", label: "Profile", to: "/profile/1", Icon: IconUser },
];

// Desktop sidebar has room, so it keeps every primary route including Feed and Categories.
const desktopItems = [
  { key: "home", label: "Home", to: "/", Icon: IconHome },
  { key: "feed", label: "Feed", to: "/feed", Icon: IconFeed },
  { key: "categories", label: "Browse", to: "/categories", Icon: IconGrid },
  {
    key: "comments",
    label: "My Comments",
    to: "/my-comments",
    Icon: IconComment,
  },
  {
    key: "bookmarks",
    label: "Bookmarks",
    to: "/bookmarks",
    Icon: IconBookmark,
  },
  { key: "profile", label: "Profile", to: "/profile/1", Icon: IconUser },
];

export default function BottomNav({ active }) {
  return (
    <>
      {/* Mobile bottom navigation — fixed, not sticky, so it stays pinned to the real viewport
          regardless of scroll/container quirks (matches how Instagram/Twitter etc. do it). */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-10 bg-floodlight/95 dark:bg-night-pitch/95 border-t border-black/10 dark:border-white/10">
        <div className="flex items-stretch justify-around">
          {mobileItems.map(({ key, label, to, Icon }) => {
            const isActive = key === active;
            return (
              <Link
                key={key}
                to={to}
                className={
                  "flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors duration-100 " +
                  (isActive
                    ? "text-night-pitch dark:text-floodlight"
                    : "text-terracing/60 dark:text-floodlight/50 hover:text-black dark:hover:text-white")
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
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-night-pitch dark:text-floodlight">
            The Terrace
          </span>
        </div>
        <div className="flex-1 space-y-2">
          {desktopItems.map(({ key, label, to, Icon }) => {
            const isActive = key === active;
            return (
              <Link
                key={key}
                to={to}
                className={
                  "flex items-center gap-3 px-4 py-3 rounded-card transition-colors duration-100 " +
                  (isActive
                    ? "bg-night-pitch text-floodlight dark:bg-floodlight dark:text-night-pitch"
                    : "text-terracing/60 dark:text-floodlight/50 hover:text-black dark:hover:text-white")
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
