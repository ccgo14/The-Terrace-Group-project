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
    <div className="mt-4 space-y-3">
      <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
        Community Stances
      </h4>

      <div className="space-y-2">
        {reactionsList.map(function (reaction) {
          const author = resolveUser(reaction.user_id);
          return (
            <div
              key={reaction.id}
              className="flex gap-3 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full bg-slate-200 border border-slate-200"
              />
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-700">
                    {author.name}
                  </span>

                  <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase">
                    {reaction.reaction_type || "prediction"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1">
                  {reaction.details || reaction.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={onAddComment} className="flex gap-2 pt-1">
        <input
          type="text"
          placeholder="Share your stance on this match..."
          value={newCommentText}
          onChange={function (e) {
            setNewCommentText(e.target.value);
          }}
          className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-medium text-xs px-4 rounded-lg hover:bg-blue-700 transition-all duration-150">
          Post
        </button>
      </form>

      <div className="flex gap-4 items-center pt-1 text-xs text-slate-500">
        <button
          onClick={function () {
            setUpvotes(upvotes + 1);
          }}
          className="flex items-center gap-1 hover:text-blue-600 transition-all duration-150">
          Upvote <span>{upvotes}</span>
        </button>
        <button
          onClick={function () {
            setDownvotes(downvotes + 1);
          }}
          className="flex items-center gap-1 hover:text-red-500 transition-all duration-150">
          Downvote <span>{downvotes}</span>
        </button>
      </div>
    </div>
  );
}
