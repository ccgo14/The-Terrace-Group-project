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
        <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-terracing">
          Community Stances
        </h4>

        <div className="space-y-3">
          {reactionsList.map(function (reaction) {
            const author = resolveUser(reaction.user_id);
            return (
              <div
                key={reaction.id}
                className="flex gap-3 items-start bg-floodlight dark:bg-night-pitch p-3 rounded-card border border-terracing/30 hover:bg-night-pitch hover:text-floodlight dark:hover:bg-floodlight dark:hover:text-night-pitch transition-colors duration-100">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-8 h-8 rounded-full bg-terracing/30 border border-terracing/30 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold uppercase text-sm tracking-wide text-night-pitch dark:text-floodlight">
                        {author.name}
                      </span>
                      <span className="font-mono text-[11px] text-terracing">
                        5 Minutes Ago
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-terracing border border-terracing/50 px-1.5 py-0.5 rounded-card">
                      {reaction.reaction_type || "prediction"}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-night-pitch dark:text-floodlight mt-1">
                    {reaction.details || reaction.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upvote / Downvote actions */}
        <div className="flex gap-4 items-center pt-2 text-xs text-terracing">
          <button
            onClick={function () {
              setUpvotes(upvotes + 1);
            }}
            className="flex items-center gap-1 text-terracing hover:text-night-pitch dark:hover:text-floodlight transition-colors duration-100">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            Upvote <span className="font-mono">{upvotes}</span>
          </button>
          <button
            onClick={function () {
              setDownvotes(downvotes + 1);
            }}
            className="flex items-center gap-1 text-terracing hover:text-night-pitch dark:hover:text-floodlight transition-colors duration-100">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            Downvote <span className="font-mono">{downvotes}</span>
          </button>
        </div>
      </div>

      <form
        onSubmit={onAddComment}
        className="sticky bottom-0 bg-floodlight/95 dark:bg-night-pitch/95 border-t border-terracing/30 p-3 flex gap-2 items-center">
        <img
          src={mockUsers[0].avatar}
          alt="You"
          className="w-8 h-8 rounded-full border border-terracing/30 flex-shrink-0"
        />
        <input
          type="text"
          placeholder="Type Something..."
          value={newCommentText}
          onChange={function (e) {
            setNewCommentText(e.target.value);
          }}
          className="flex-1 px-4 py-2.5 text-sm text-night-pitch dark:text-floodlight bg-transparent border border-terracing/50 rounded-card focus:outline-none focus:border-night-pitch dark:focus:border-floodlight transition-colors duration-100 placeholder:text-terracing/70"
        />
        <button
          type="submit"
          disabled={!newCommentText.trim()}
          className={`w-10 h-10 rounded-card flex items-center justify-center transition-colors duration-100 flex-shrink-0 ${
            newCommentText.trim()
              ? "bg-night-pitch text-floodlight border border-night-pitch hover:bg-floodlight hover:text-night-pitch dark:bg-floodlight dark:text-night-pitch dark:border-floodlight dark:hover:bg-night-pitch dark:hover:text-floodlight"
              : "bg-transparent text-terracing border border-terracing/50 cursor-not-allowed"
          }`}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
