import { useState } from "react";
import { mockReactions, mockUsers } from "../data/mockData";

export default function CommentSection({ articleId }) {
  const [reactionsList, setReactionsList] = useState(
    mockReactions.filter(function (r) {
      return r.article_id === articleId;
    }),
  );

  const [newCommentText, setNewCommentText] = useState("");
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  function resolveUser(userId) {
    return (
      mockUsers.find(function (u) {
        return u.id === userId;
      }) || {}
    );
  }

  function onAddComment(event) {
    event.preventDefault();

    if (newCommentText.trim() === "") {
      return;
    }

    const brandNewComment = {
      id: reactionsList.length + 1,
      article_id: articleId,
      user_id: 1,
      reaction_type: "hot take",
      details: newCommentText,
    };

    const updatedArray = reactionsList.concat(brandNewComment);
    setReactionsList(updatedArray);
    setNewCommentText("");
  }

  return (
    <div className="relative">
      
      <div className="max-h-96 overflow-y-auto p-5 space-y-4">
        <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
          Community Stances
        </h4>

        <div className="space-y-3">
          {reactionsList.map(function (reaction) {
            const author = resolveUser(reaction.user_id);
            return (

              <div
                key={reaction.id}
                className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors duration-200"
              >

                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-8 h-8 rounded-full bg-slate-200 border border-slate-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2">

                      <span className="text-xs font-bold text-slate-700">
                        {author.name}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        5 Minutes Ago
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase">
                      {reaction.reaction_type || "prediction"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {reaction.details || reaction.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upvote / Downvote actions */}
        <div className="flex gap-4 items-center pt-2 text-xs text-slate-500">
          <button
            onClick={function () {
              setUpvotes(upvotes + 1);
            }}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Upvote <span>{upvotes}</span>
          </button>
          <button
            onClick={function () {
              setDownvotes(downvotes + 1);
            }}
            className="flex items-center gap-1 hover:text-red-500 transition-colors duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Downvote <span>{downvotes}</span>
          </button>
        </div>
      </div>


      <form
        onSubmit={onAddComment}
        className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-slate-200 p-3 flex gap-2 items-center"
      >
        <img
          src={mockUsers[0].avatar}
          alt="You"
          className="w-8 h-8 rounded-full border border-slate-200 flex-shrink-0"
        />


        <input
          type="text"
          placeholder="Type Something..."
          value={newCommentText}
          onChange={function (e) {
            setNewCommentText(e.target.value);
          }}
          className="flex-1 px-4 py-2.5 text-sm text-slate-900 bg-slate-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
        />


        <button
          type="submit"
          disabled={!newCommentText.trim()}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
            newCommentText.trim()
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}