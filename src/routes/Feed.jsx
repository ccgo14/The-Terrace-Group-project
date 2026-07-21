import { Screen, Header } from "../components/UI";
import BottomNav from "../components/BottomNav";
import ArticleCard from "../components/ArticleCard";
import { Scoreboard } from "../components/Scoreboard";
import { articles, liveMatch } from "../data";

const filters = ["For You", "Match Reports", "Fan Reactions", "Following"];

export default function Feed() {
  const personalized = [...articles].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <Screen sidebar nav>
      <Header title="Your Feed" />

      {/* filter chips — hover inverts, no rounded-full pills */}
      <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8 py-3 border-b border-black/10 dark:border-white/10">
        {filters.map((f, i) => (
          <button
            key={f}
            className={
              "shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] px-3 py-1.5 rounded-card border transition-colors duration-100 active:translate-y-[2px] " +
              (i === 0
                ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                : "bg-transparent text-terracing/70 dark:text-floodlight/50 hover:text-black dark:hover:text-white border-black/10 dark:border-white/10")
            }>
            {f}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="pt-4">
          <Scoreboard match={liveMatch} />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {personalized.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </main>

      <BottomNav active="feed" />
    </Screen>
  );
}
