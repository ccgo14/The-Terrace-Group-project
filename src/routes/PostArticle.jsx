import { Link } from "react-router-dom";
import { Screen, Header, Field, Button } from "../components/UI";
import { IconArrowLeft } from "../components/Icons";

const kinds = ["Match Report", "Fan Reaction"];

export default function PostArticle() {
  return (
    <Screen>
      <Header
        title="New Post"
        left={
          <Link
            to="/profile/1"
            className="text-night-pitch dark:text-floodlight block"
            aria-label="Back"
          >
            <IconArrowLeft className="w-6 h-6" />
          </Link>
        }
      />

      <form className="px-4 py-5 flex flex-col gap-5">
        <div>
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing/70 dark:text-floodlight/50 mb-2">
            Post Type
          </span>
          <div className="flex gap-3">
            {kinds.map((k, i) => (
              <button
                key={k}
                type="button"
                className={
                  "flex-1 font-display font-semibold uppercase tracking-wide text-sm px-3 py-2.5 rounded-card border transition-colors duration-100 active:translate-y-[2px] " +
                  (i === 0
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                    : "bg-transparent text-terracing/70 dark:text-floodlight/50 hover:text-black dark:hover:text-white border-black/10 dark:border-white/10")
                }
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <Field label="Headline" placeholder="CITY STUNNED IN LATE DRAMA" />

        {/* cover upload — dashed frame, no shadow */}
        <div>
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing/70 dark:text-floodlight/50 mb-2">
            Cover Image
          </span>
          <div className="border border-dashed border-black/10 dark:border-white/10 rounded-card h-32 flex items-center justify-center text-center px-4">
            <span className="font-mono text-xs text-terracing/60 dark:text-floodlight/50">
              Tap to upload — photography for reports, illustration for takes
            </span>
          </div>
        </div>

        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing/70 dark:text-floodlight/50 mb-1.5">
            Body
          </span>
          <textarea
            rows={7}
            placeholder="Set the scene from the terrace…"
            className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-card px-3 py-2.5 text-sm text-night-pitch dark:text-floodlight
            placeholder:text-terracing/40 dark:placeholder:text-floodlight/40 focus:outline-none focus:border-black/50 dark:focus:border-white/50 resize-none"
          />
        </label>

        <div className="flex gap-3">
          <Button variant="outline">Save Draft</Button>
          <Button>Publish</Button>
        </div>
      </form>
    </Screen>
  );
}
