import React from "react";
import { useParams } from "react-router-dom";
import { Screen, Header } from "../components/UI";
import BottomNav from "../components/BottomNav";
import MatchPredictor from "../components/MatchPredictor";

/**
 * MatchPredictorPage
 *
 * Page route component that extracts `matchId` from the URL parameters
 * and renders the interactive MatchPredictor component within the main page layout.
 */
export default function MatchPredictorPage() {
  // Extract matchId from URL (e.g., /matches/5 -> matchId = "5")
  const { matchId } = useParams();

  return (
    <Screen sidebar nav>
      <Header title="Match Predictor" />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-0 lg:pb-0">
        {/* Pass numeric matchId prop to the MatchPredictor component */}
        <MatchPredictor matchId={matchId ? Number(matchId) : null} />
      </main>
      <BottomNav active="feed" />
    </Screen>
  );
}