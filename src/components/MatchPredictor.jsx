import React, { useState } from "react";
import { currentUser } from "../data/mockData";

export default function MatchPredictor({ articleId }) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [reactionType, setReactionType] = useState("Home Win");
  const [body, setBody] = useState("");

  const submitPrediction = (e) => {
    e.preventDefault();
    if (currentUser.permissions !== "read-write")
      return alert("Read-only access");

    console.log("Prediction Node Submitted:", {
      articleId,
      userId: currentUser.id,
      homeScore,
      awayScore,
      reactionType,
      body,
    });

    setHomeScore("");
    setAwayScore("");
    setBody("");
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm mb-4">
      <h3 className="text-sm font-bold text-slate-700 tracking-wide mb-3">
        Submit Prediction
      </h3>
      <form onSubmit={submitPrediction} className="space-y-3">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Home"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-center focus:outline-none focus:border-blue-500"
            required
          />
          <span className="text-slate-400 font-bold">-</span>
          <input
            type="number"
            placeholder="Away"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-center focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <select
          value={reactionType}
          onChange={(e) => setReactionType(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500">
          <option value="Home Win">Home Win</option>
          <option value="Away Win">Away Win</option>
          <option value="Draw">Draw</option>
        </select>

        <textarea
          placeholder="Justify your stance..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 h-16 resize-none focus:outline-none focus:border-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium text-xs py-2 rounded-lg transition-all duration-200 hover:bg-blue-700 shadow-sm active:scale-95">
          Lock Prediction
        </button>
      </form>
    </div>
  );
}
