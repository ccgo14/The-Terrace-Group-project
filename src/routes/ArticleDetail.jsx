import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Screen, Header, KindLabel, MetaRow, Button } from "../components/UI";
import { Scoreboard } from "../components/Scoreboard";
import { IconArrowLeft, IconUpvote } from "../components/Icons";
import { liveMatch, reactions } from "../data";
import MatchPredictor from "../components/MatchPredictor";
import CommentSection from "../components/CommentSection";
import api from "../api/client";
import { mapArticle } from "../api/mappers";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/articles/${id}`)
      .then((res) => {
        if (!cancelled) {
          setArticle(mapArticle(res.data));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to fetch article:", err);
          setError(err.response?.data?.message || "Failed to load article.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <Header
          title="Report"
          left={
            <Link
              to="/"
              className="text-night-pitch dark:text-floodlight block"
              aria-label="Back">
              <IconArrowLeft className="w-6 h-6" />
            </Link>
          }
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="py-12 text-center font-mono text-sm text-terracing/60 dark:text-floodlight/50 border border-black/10 dark:border-white/10 rounded-card">
            Loading article...
          </div>
        </div>
      </Screen>
    );
  }

  if (error || !article) {
    return (
      <Screen>
        <Header
          title="Report"
          left={
            <Link
              to="/"
              className="text-night-pitch dark:text-floodlight block"
              aria-label="Back">
              <IconArrowLeft className="w-6 h-6" />
            </Link>
          }
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="py-12 text-center font-mono text-sm text-red-600 dark:text-red-400 border border-black/10 dark:border-white/10 rounded-card">
            {error || "Article not found."}
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Report"
        left={
          <Link
            to="/"
            className="text-night-pitch dark:text-floodlight block"
            aria-label="Back">
            <IconArrowLeft className="w-6 h-6" />
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          <article className="lg:col-span-2">
              <div className="w-full h-64 overflow-hidden bg-terracing/20 dark:bg-terracing/40">
              <img
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pt-4">
              <KindLabel>{article.kind}</KindLabel>
              <h1 className="mt-3 font-display font-bold uppercase leading-none text-4xl text-night-pitch dark:text-floodlight text-balance">
                {article.title}
              </h1>
              <p className="mt-3 font-mono text-xs text-terracing/60 dark:text-floodlight/50">
                By {article.author} · {article.time} ago
              </p>
            </div>

            {/* Live scoreboard embedded in the report */}
            <div className="pt-5">
              <Scoreboard match={liveMatch} />
            </div>

            {/* Match events — plain hairline list */}
            <ul className="mt-5">
              {liveMatch.events.map((e, i) => (
                <li
                  key={i}
                  className="flex gap-4 py-2.5 border-b border-black/10 dark:border-white/10 first:border-t">
                  <span className="font-mono text-sm text-terracing/60 dark:text-floodlight/50 w-8 shrink-0">
                    {e.min}
                  </span>
                  <span className="text-sm text-night-pitch dark:text-floodlight">
                    {e.text}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-5 space-y-4 text-[15px] leading-relaxed text-night-pitch dark:text-floodlight">
              <p>
                {article.excerpt} The visitors weathered an early storm before
                the hosts found their rhythm, and by the interval the contest
                had the unmistakable feel of a night that would be talked about
                long after the floodlights dimmed.
              </p>
              <p>
                What followed was a second half of raw intensity — the kind the
                terrace lives for. Chances came and went, tempers frayed, and
                the decisive moments arrived when the crowd least expected them.
              </p>
            </div>

            <div className="pt-5">
              <MetaRow upvotes={article.upvotes} comments={article.comments} />
            </div>

            {/* Reactions section — UGC, illustrated tone */}
            <section className="mt-8 border-t border-black/10 dark:border-white/10 pt-5">
              <h2 className="font-display font-bold uppercase text-lg tracking-wide text-night-pitch dark:text-floodlight">
                Fan Reactions
              </h2>
              <ul className="mt-3">
                {reactions.map((r, i) => (
                  <li key={i} className="py-4 border-b border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/avatar.png"
                        alt=""
                        className="w-7 h-7 rounded-full object-cover bg-terracing/30"
                      />
                       <span className="font-display font-semibold uppercase text-sm tracking-wide text-night-pitch dark:text-floodlight min-w-0 truncate">
                         {r.author}
                       </span>
                       <span className="font-mono text-[11px] text-terracing/60 dark:text-floodlight/50">
                         {r.time}
                       </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-night-pitch dark:text-floodlight/80">
                      {r.body}
                    </p>
                    <button className="mt-2 flex items-center gap-1.5 text-terracing/60 dark:text-floodlight/50 hover:text-terracing dark:hover:text-floodlight transition-colors duration-100 active:translate-y-[2px]">
                      <IconUpvote className="w-4 h-4" />
                      <span className="font-mono text-xs">{r.upvotes}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Button variant="outline">Add your reaction</Button>
              </div>
            </section>
          </article>

          {/* Sidebar with widgets */}
          <aside className="lg:col-span-1 space-y-4">
            <MatchPredictor articleId={article.id} />
            <CommentSection articleId={article.id} />
          </aside>
        </div>
      </div>
    </Screen>
  );
}
