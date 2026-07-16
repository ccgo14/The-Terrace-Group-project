import { useState } from "react";
import { mockCategories, mockArticles } from "../data/mockData";
import MatchPredictor from "./MatchPredictor";
import CommentSection from "./CommentSection";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(mockCategories[0].id);
  const [activeScreen, setActiveScreen] = useState("home");

  const filteredArticles = mockArticles.filter(function (article) {
    return article.category_id === activeCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:grid md:grid-cols-4 md:gap-6 md:pt-8">
      <aside className="mb-6 md:col-span-1 md:mb-0">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 hidden md:block">
          Leagues
        </h2>
        <nav className="flex gap-2 overflow-x-auto scrollbar-hide md:flex-col md:overflow-visible">
          {mockCategories.map(function (cat) {
            return (
              <button
                key={cat.id}
                onClick={function () {
                  setActiveCategory(cat.id);
                }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 whitespace-nowrap md:w-full md:text-left md:px-4 md:py-2.5 md:rounded-xl ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}>
                {cat.name}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="md:col-span-3 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            The Terrace
          </h1>
          <p className="text-xs text-slate-400 tracking-widest uppercase">
            Match Hub (Screen: {activeScreen})
          </p>
        </div>

        {filteredArticles.map(function (article) {
          return (
            <article
              key={article.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-5 pb-0">
                <span className="text-[10px] tracking-widest font-bold text-blue-600 uppercase">
                  Match Node
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-0.5">
                  {article.title}
                </h2>
              </div>

              <div className="px-5 my-3">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-xl border border-slate-100 md:h-56"
                />
              </div>

              <p className="text-sm text-slate-500 mt-1 mb-4 px-5">
                {article.summary}
              </p>

              <div className="flex items-center justify-between px-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <button
                    onClick={function () {
                      console.log(
                        "Reply clicked for article ID: " + article.id,
                      );
                    }}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                    <span className="hidden sm:inline">Reply</span>
                  </button>
                  <button
                    onClick={function () {
                      console.log(
                        "Like registered for article ID: " + article.id,
                      );
                    }}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    <span>Like</span>
                  </button>
                </div>
                <button
                  onClick={function () {
                    console.log(
                      "Options menu opened for article ID: " + article.id,
                    );
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <circle cx="12" cy="6" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="18" r="2" />
                  </svg>
                </button>
              </div>

              <div className="p-5">
                <MatchPredictor articleId={article.id} />
                <CommentSection articleId={article.id} />
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
