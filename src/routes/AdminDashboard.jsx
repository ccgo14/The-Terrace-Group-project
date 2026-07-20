import { Link } from "react-router-dom";
import { Screen, Header, KindLabel } from "../components/UI";
import { IconArrowLeft, IconCheck } from "../components/Icons";
import { articles } from "../data";

const metrics = [
  ["Pending", 7],
  ["Published", 128],
  ["Flagged", 3],
  ["Authors", 24],
];

export default function Admin() {
  const queue = articles.slice(0, 4);

  return (
    <Screen>
      <Header
        title="Admin"
        left={
          <Link
            to="/"
            className="text-night-pitch dark:text-floodlight block"
            aria-label="Back"
          >
            <IconArrowLeft className="w-6 h-6" />
          </Link>
        }
      />

      <main className="pb-8">
        {/* metrics grid */}
        <div className="mx-4 mt-5 grid grid-cols-2 border border-terracing/40">
          {metrics.map(([label, value], i) => (
            <div
              key={label}
              className={
                "p-4 " +
                (i % 2 === 0 ? "border-r border-terracing/40 " : "") +
                (i < 2 ? "border-b border-terracing/40" : "")
              }
            >
              <div className="font-mono font-bold text-3xl text-night-pitch dark:text-floodlight tabular-nums leading-none">
                {value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-terracing mt-1.5">
                {label}
              </div>
            </div>
          ))}
        </div>

        <h2 className="px-4 mt-7 mb-2 font-display font-bold uppercase text-lg tracking-wide text-night-pitch dark:text-floodlight">
          Moderation Queue
        </h2>

        <ul className="border-t border-terracing/30">
          {queue.map((a) => (
            <li
              key={a.id}
              className="px-4 py-4 border-b border-terracing/30 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <KindLabel>{a.kind}</KindLabel>
                <p className="mt-2 font-display font-semibold uppercase leading-tight text-night-pitch dark:text-floodlight truncate">
                  {a.title}
                </p>
                <p className="font-mono text-[11px] text-terracing mt-1">
                  {a.author} · {a.time} ago
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  aria-label="Approve"
                  className="p-2 border border-terracing/50 rounded-card text-night-pitch dark:text-floodlight
                  hover:bg-night-pitch hover:text-floodlight dark:hover:bg-floodlight dark:hover:text-night-pitch
                  transition-colors duration-100 active:translate-y-[2px]"
                >
                  <IconCheck className="w-4 h-4" />
                </button>
                <button
                  className="px-2 py-1 border border-terracing/50 rounded-card font-mono text-[10px] uppercase tracking-[0.08em] text-terracing
                  hover:bg-night-pitch hover:text-floodlight dark:hover:bg-floodlight dark:hover:text-night-pitch
                  transition-colors duration-100 active:translate-y-[2px]"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </Screen>
  );
}
