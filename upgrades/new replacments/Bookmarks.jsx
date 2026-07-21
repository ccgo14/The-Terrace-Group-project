import { Screen, Header } from "../components/UI";
import BottomNav from "../components/BottomNav";
import { IconBookmark } from "../components/Icons";

// PLACEHOLDER — there is no Bookmark model/endpoint in the backend yet.
// This tab exists structurally to match the Figma reference, but saving an
// article isn't wired to anything real. Needs a decision before Friday:
// either scope a real Bookmark model (User <-> Article many-to-many) and
// build it, or leave this as a "coming soon" state.
export default function Bookmarks() {
  return (
    <Screen sidebar>
      <Header title="Bookmarks" />

      <div className="max-w-2xl mx-auto px-4 py-16 pb-24 lg:pb-16 flex flex-col items-center text-center">
        <IconBookmark className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          Saved articles will show up here. This feature isn't wired to the
          backend yet.
        </p>
      </div>

      <BottomNav active="bookmarks" />
    </Screen>
  );
}
