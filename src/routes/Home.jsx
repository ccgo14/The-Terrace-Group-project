import { Screen, Header } from "../components/UI";
import BottomNav from "../components/BottomNav";
import ArticleCard from "../components/ArticleCard";
import { LeagueTable } from "../components/Scoreboard";
import { articles, table } from "../data";

export default function HomeFeed() {
  return (
    <Screen>
      <Header title="The Terrace" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>

        <section className="py-6">
          <h2 className="font-display font-bold uppercase text-lg tracking-wide text-night-pitch dark:text-floodlight mb-3">
            League Table
          </h2>
          <LeagueTable rows={table} />
        </section>
      </main>

      <BottomNav active="home" />
    </Screen>
  );
}
