import { useState } from "react";
import { currentUser } from "../data/mockData";

export default function MatchPredictor({ articleId }) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [reaction_type, setReaction_type] = useState("Home Win");
  const [body, setBody] = useState("");

  const communityPercentage = 45;

  function submitPrediction(e) {
    e.preventDefault();
    if (currentUser.permissions !== "read-write") {
      return alert("Read-only access");
    }

    console.log("Prediction Node Submitted:", {
      articleId,
      userId: currentUser.id,
      homeScore,
      awayScore,
      reaction_type,
      body,
    });

    setHomeScore("");
    setAwayScore("");
    setBody("");
  }

  return (

    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700 tracking-wide">
          Submit Prediction
        </h3>


        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
          {communityPercentage}% consensus
        </span>
      </div>

      <form onSubmit={submitPrediction} className="space-y-3">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Home"
            value={homeScore}
            onChange={function (e) {
              setHomeScore(e.target.value);
            }}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-300"
            required
          />
          <span className="text-slate-400 font-bold">-</span>
          <input
            type="number"
            placeholder="Away"
            value={awayScore}
            onChange={function (e) {
              setAwayScore(e.target.value);
            }}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-300"
            required
          />
        </div>

        <select
          value={reaction_type}
          onChange={function (e) {
            setReaction_type(e.target.value);
          }}
          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
        >
          <option value="Home Win">Home Win</option>
          <option value="Away Win">Away Win</option>
          <option value="Draw">Draw</option>
        </select>

        <textarea
          placeholder="Justify your stance..."
          value={body}
          onChange={function (e) {
            setBody(e.target.value);
          }}
          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-700 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
          required
        />

        
        <button
          type="submit"
          className="w-full bg-slate-900 text-white rounded-xl py-3 font-semibold hover:bg-black transition-all duration-200 active:scale-95 shadow-sm hover:shadow"
        >
          Submit Prediction
        </button>
      </form>
    </div>
  );
}