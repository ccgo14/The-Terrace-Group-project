import { Screen, Header } from "../components/UI";
import BottomNav from "../components/BottomNav";
import { reactions, users, articles } from "../data";

// Matches the Figma "My Comment" screen: every reaction the current user has
// posted, across all articles, in one list — not nested inside Profile.
const CURRENT_USER_ID = 1; // placeholder until real auth wires in the logged-in user

export default function MyComments() {
  const myReactions = (reactions || []).filter(
    (r) => r.user_id === CURRENT_USER_ID
  );

  return (
    <Screen sidebar>
      <Header title="My Comments" />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 lg:pb-6">
        {myReactions.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-12">
            You haven't posted a reaction yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {myReactions.map((r) => {
              const author = users.find((u) => u.id === r.user_id) || {};
              const article = articles.find((a) => a.id === r.article_id);
              return (
                <li
                  key={r.id}
                  className="p-4 border border-black/10 dark:border-white/10 rounded-card"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={author.avatar || "/images/default-avatar.png"}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover bg-terracing/30"
                    />
                    <span className="font-display font-semibold uppercase text-sm tracking-wide text-night-pitch dark:text-floodlight">
                      {author.name || "You"}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      5 Minutes Ago
                    </span>
                  </div>

                  {article && (
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.06em] text-neutral-500 dark:text-neutral-400">
                      on &ldquo;{article.title}&rdquo;
                    </p>
                  )}

                  <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {r.details || r.body}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <BottomNav active="comments" />
    </Screen>
  );
}
