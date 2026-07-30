import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

/**
 * MatchPredictor Component
 *
 * Allows authenticated users to submit a predicted score, outcome stance,
 * and optional written justification for a given match context.
 *
 * @param {Object} props
 * @param {string} [props.articleId] - Optional associated article context.
 * @param {number|string} props.matchId - ID of the match being predicted.
 */
export default function MatchPredictor({ articleId: _articleId, matchId }) {
  // Score inputs
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  // Stance and justification text
  const [reactionType, setReactionType] = useState("Home Win");
  const [body, setBody] = useState("");

  // Network and UI feedback states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Placeholder consensus stat (can be backed by API in future iterations)
  const [communityPercentage] = useState(45);

  // Authentication context
  const { user } = useAuth();
  const currentUserId = user?.id || user?.user_id;

  /**
   * Auto-calculate reaction_type based on score inputs whenever scores change.
   */
  useEffect(() => {
    if (homeScore === "" || awayScore === "") return;

    const h = Number(homeScore);
    const a = Number(awayScore);

    if (h > a) {
      setReactionType("Home Win");
    } else if (a > h) {
      setReactionType("Away Win");
    } else {
      setReactionType("Draw");
    }
  }, [homeScore, awayScore]);

  /**
   * Handles form submission to the Flask API backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!matchId) {
      setError("Missing match context.");
      return;
    }

    setError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      await api.post("/predictions", {
        match_id: matchId,
        predicted_home_score: Number(homeScore),
        predicted_away_score: Number(awayScore),
      });

      // Clear form inputs on successful submission
      setHomeScore("");
      setAwayScore("");
      setBody("");
      setSuccessMsg("Prediction recorded successfully!");
    } catch (err) {
      console.error("Failed to submit prediction:", err);
      setError(err.response?.data?.message || "Failed to submit prediction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-terracing/40 border border-black/10 dark:border-white/10 rounded-cardLg p-4">
      {/* Header section with title and community consensus badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold uppercase text-sm tracking-wide text-night-pitch dark:text-floodlight">
          Submit Prediction
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-amber-live border border-amber-live/30 px-2 py-1 rounded-card">
          {communityPercentage}% consensus
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Score Inputs */}
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Home"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-card p-3 text-sm text-center font-mono font-bold text-night-pitch dark:text-floodlight focus:outline-none focus:border-black/50 dark:focus:border-white/50 transition-colors duration-100 placeholder:text-terracing/40 dark:placeholder:text-floodlight/40"
            required
          />
          <span className="text-terracing/60 dark:text-floodlight/50 font-mono font-bold">
            -
          </span>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Away"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-card p-3 text-sm text-center font-mono font-bold text-night-pitch dark:text-floodlight focus:outline-none focus:border-black/50 dark:focus:border-white/50 transition-colors duration-100 placeholder:text-terracing/40 dark:placeholder:text-floodlight/40"
            required
          />
        </div>

        {/* Outcome Dropdown */}
        <select
          value={reactionType}
          onChange={(e) => setReactionType(e.target.value)}
          className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-card p-3 text-sm text-night-pitch dark:text-floodlight font-body focus:outline-none focus:border-black/50 dark:focus:border-white/50 transition-colors duration-100 appearance-none">
          <option value="Home Win">Home Win</option>
          <option value="Away Win">Away Win</option>
          <option value="Draw">Draw</option>
        </select>

        {/* Written Justification */}
        <textarea
          placeholder="Justify your stance..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-card p-3 text-sm text-night-pitch dark:text-floodlight font-body h-20 resize-none focus:outline-none focus:border-black/50 dark:focus:border-white/50 transition-colors duration-100 placeholder:text-terracing/40 dark:placeholder:text-floodlight/40"
          required
        />

        {/* Success Feedback Message */}
        {successMsg && (
          <p className="text-sm font-mono text-center text-emerald-600 dark:text-emerald-400">
            {successMsg}
          </p>
        )}

        {/* Error Feedback Message */}
        {error && (
          <p className="text-sm font-mono text-center text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Unauthenticated User Warning */}
        {!currentUserId && (
          <p className="text-sm font-mono text-center text-terracing/60 dark:text-floodlight/50">
            You must be logged in to submit a prediction.
          </p>
        )}

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={submitting || !currentUserId || !matchId}
          className="w-full bg-black text-white border-black rounded-card py-3 font-display font-semibold uppercase tracking-wide hover:opacity-90 dark:bg-white dark:text-black dark:border-white transition-colors duration-100 active:translate-y-[2px] disabled:opacity-40">
          {submitting ? "Submitting..." : "Submit Prediction"}
        </button>
      </form>
    </div>
  );
}
