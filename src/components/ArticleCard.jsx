import { useState } from "react";
import { Link } from "react-router-dom";
import { KindLabel, MetaRow } from "./UI";

// Match reports use photography; fan reactions use flat illustration.
// Cards are separated by hairline borders, never shadows.
export default function ArticleCard({ article }) {
  const [imgError, setImgError] = useState(false);
  const {
    title = "Untitled",
    excerpt = "",
    kind = "ARTICLE",
    upvotes = 0,
    comments = 0,
  } = article || {};

  return (
    <Link
      to={`/articles/${article.id}`}
      className="block w-full h-full flex flex-col border-b border-black/10 dark:border-white/10">
      <div className="w-full h-40 overflow-hidden bg-terracing/20 dark:bg-terracing/40 flex-shrink-0">
        {!imgError && (
          <img
            src={article.image || "/placeholder.svg"}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="px-4 py-4 flex flex-col flex-grow bg-white/80 dark:bg-terracing/40">
        <KindLabel>{kind}</KindLabel>
        <h2 className="mt-3 font-display font-bold uppercase leading-none text-2xl text-night-pitch dark:text-floodlight text-balance line-clamp-2">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-night-pitch dark:text-floodlight/80 text-pretty flex-grow line-clamp-2">
          {excerpt}
        </p>
        <div className="mt-4">
          <MetaRow upvotes={upvotes} comments={comments} />
        </div>
      </div>
    </Link>
  );
}
