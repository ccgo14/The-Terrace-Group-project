import { useState } from 'react';
import { mockCategories, mockArticles } from '../data/mockData';
import MatchPredictor from './MatchPredictor';
import CommentSection from './CommentSection';

export default function Home() {

  const [activeCategory, setActiveCategory] = useState(mockCategories[0].id);


  const [activeScreen, setActiveScreen] = useState('home');

  const filteredArticles = mockArticles.filter(function(article) {
    return article.category_id === activeCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl border-x border-slate-200 flex flex-col relative pb-24">


        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 p-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">The Terrace</h1>

          <p className="text-xs text-slate-400 tracking-widest uppercase mt-0.5">Match Hub (Screen: {activeScreen})</p>


          <nav className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {mockCategories.map(function(cat) {
              return (
                <button
                  key={cat.id}
                  onClick={function() { setActiveCategory(cat.id); }}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>
        </header>


        <main className="p-4 flex-1 space-y-6">
          {filteredArticles.map(function(article) {
            return (
              <div key={article.id} className="border-b border-slate-100 pb-4">
                <span className="text-[10px] tracking-widest font-bold text-blue-600 uppercase">Match Node</span>
                <h2 className="text-lg font-bold text-slate-800 mt-0.5">{article.title}</h2>


                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-48 object-cover my-3 rounded-lg border border-slate-100"
                />

                <p className="text-sm text-slate-500 mt-1 mb-4">{article.summary}</p>


                <div className="flex gap-4 my-2 text-xs text-slate-400">
                  <button onClick={function() { console.log("Reply clicked for article ID: " + article.id); }}>💬 Reply</button>
                  <button onClick={function() { console.log("Like registered for article ID: " + article.id); }}>❤️ Like</button>
                  <button onClick={function() { console.log("Options menu opened for article ID: " + article.id); }}>⚙️ Options</button>
                </div>

                
                <MatchPredictor articleId={article.id} />
                <CommentSection articleId={article.id} />
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}