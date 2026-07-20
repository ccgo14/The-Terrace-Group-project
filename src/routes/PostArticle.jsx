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
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing mb-2">
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
                    ? "bg-night-pitch text-floodlight border-night-pitch dark:bg-floodlight dark:text-night-pitch dark:border-floodlight"
                    : "border-terracing/50 text-terracing hover:bg-night-pitch hover:text-floodlight dark:hover:bg-floodlight dark:hover:text-night-pitch")
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
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing mb-2">
            Cover Image
          </span>
          <div className="border border-dashed border-terracing/60 rounded-card h-32 flex items-center justify-center text-center px-4">
            <span className="font-mono text-xs text-terracing">
              Tap to upload — photography for reports, illustration for takes
            </span>
          </div>
        </div>

        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-terracing mb-1.5">
            Body
          </span>
          <textarea
            rows={7}
            placeholder="Set the scene from the terrace…"
            className="w-full bg-transparent border border-terracing/50 rounded-card px-3 py-2.5 text-sm text-night-pitch dark:text-floodlight
            placeholder:text-terracing/70 focus:outline-none focus:border-night-pitch dark:focus:border-floodlight resize-none"
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
