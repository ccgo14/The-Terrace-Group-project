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
    <div className="bg-floodlight dark:bg-night-pitch border border-terracing/40 rounded-cardLg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold uppercase text-sm tracking-wide text-night-pitch dark:text-floodlight">
          Submit Prediction
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-amber-live border border-amber-live/30 px-2 py-1 rounded-card">
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
            className="w-full bg-transparent border border-terracing/50 rounded-card p-3 text-sm text-center font-mono font-bold text-night-pitch dark:text-floodlight focus:outline-none focus:border-night-pitch dark:focus:border-floodlight transition-colors duration-100 placeholder:text-terracing/70"
            required
          />
          <span className="text-terracing font-mono font-bold">-</span>
          <input
            type="number"
            placeholder="Away"
            value={awayScore}
            onChange={function (e) {
              setAwayScore(e.target.value);
            }}
            className="w-full bg-transparent border border-terracing/50 rounded-card p-3 text-sm text-center font-mono font-bold text-night-pitch dark:text-floodlight focus:outline-none focus:border-night-pitch dark:focus:border-floodlight transition-colors duration-100 placeholder:text-terracing/70"
            required
          />
        </div>

        <select
          value={reaction_type}
          onChange={function (e) {
            setReaction_type(e.target.value);
          }}
          className="w-full bg-transparent border border-terracing/50 rounded-card p-3 text-sm text-night-pitch dark:text-floodlight font-body focus:outline-none focus:border-night-pitch dark:focus:border-floodlight transition-colors duration-100 appearance-none">
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
          className="w-full bg-transparent border border-terracing/50 rounded-card p-3 text-sm text-night-pitch dark:text-floodlight font-body h-20 resize-none focus:outline-none focus:border-night-pitch dark:focus:border-floodlight transition-colors duration-100 placeholder:text-terracing/70"
          required
        />

        <button
          type="submit"
          className="w-full bg-night-pitch text-floodlight border border-night-pitch rounded-card py-3 font-display font-semibold uppercase tracking-wide hover:bg-floodlight hover:text-night-pitch dark:bg-floodlight dark:text-night-pitch dark:border-floodlight dark:hover:bg-night-pitch dark:hover:text-floodlight transition-colors duration-100 active:translate-y-[2px]">
          Submit Prediction
        </button>
      </form>
    </div>
  );
}
