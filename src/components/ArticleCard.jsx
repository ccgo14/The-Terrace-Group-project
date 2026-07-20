import { Link } from "react-router-dom";
import { KindLabel, MetaRow } from "./UI";

// Match reports use photography; fan reactions use flat illustration.
// Cards are separated by hairline borders, never shadows.
export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="block w-full h-full flex flex-col border-b border-terracing/30">
      <div className="w-full h-40 overflow-hidden bg-terracing/20 dark:bg-black/30 flex-shrink-0">
        <img
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="px-4 py-4 flex flex-col flex-grow">
        <KindLabel>{article.kind}</KindLabel>
        <h2 className="mt-3 font-display font-bold uppercase leading-none text-2xl text-night-pitch dark:text-floodlight text-balance">
          {article.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-terracing text-pretty flex-grow">
          {article.excerpt}
        </p>
        <div className="mt-4">
          <MetaRow upvotes={article.upvotes} comments={article.comments} />
        </div>
      </div>
    </Link>
  );
}
