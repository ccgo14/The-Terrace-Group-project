import React, { useState } from 'react';
import { mockReactions, mockUsers } from '../data/mockData';

export default function CommentSection({ articleId }) {
  const targetReactions = mockReactions.filter((r) => r.article_id === articleId);

  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  const resolveUser = (userId) => {
    return mockUsers.find((u) => u.id === userId) || {};
  };

  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">Community Stances</h4>

      <div className="space-y-2">
        {targetReactions.map((reaction) => {
          const author = resolveUser(reaction.user_id);
          return (
            <div key={reaction.id} className="flex gap-3 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full bg-slate-200 border border-slate-200"
              />
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-700">{author.name}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase">
                    {reaction.reactionType} ({reaction.homeScore}-{reaction.awayScore})
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{reaction.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 items-center pt-1 text-xs text-slate-500">
        <button
          onClick={() => setUpvotes(upvotes + 1)}
          className="flex items-center gap-1 hover:text-blue-600 transition-all duration-150"
        >
          Upvote <span>{upvotes}</span>
        </button>
        <button
          onClick={() => setDownvotes(downvotes + 1)}
          className="flex items-center gap-1 hover:text-red-500 transition-all duration-150"
        >
          Downvote <span>{downvotes}</span>
        </button>
      </div>
    </div>
  );
}