import { Screen, Header } from "../components/UI";
import BottomNav from "../components/BottomNav";
import MatchPredictor from "../components/MatchPredictor";

import { useParams } from "react-router-dom";
import { Screen, Header } from "../components/UI";
import BottomNav from "../components/BottomNav";
import MatchPredictor from "../components/MatchPredictor";

export default function MatchPredictorPage() {
  const { matchId } = useParams();

  return (
    <Screen sidebar nav>
      <Header title="Match Predictor" />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-0 lg:pb-0">
        <MatchPredictor matchId={matchId ? Number(matchId) : null} />
      </main>
      <BottomNav active="feed" />
    </Screen>
  );
}
