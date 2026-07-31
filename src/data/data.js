// Canonical mock data exports with standardized schemas and fallback aliases.
export {
  mockUsers as users,
  mockCategories as categories,
  mockArticles as articles,
  mockReactions as reactions,
  currentUser,
} from "./mockData";

export const table = [
  { rank: 1, pos: 1, team: "Arsenal", played: 38, gd: "+45", points: 89, pts: 89 },
  { rank: 2, pos: 2, team: "Manchester City", played: 38, gd: "+38", points: 85, pts: 85 },
  { rank: 3, pos: 3, team: "Liverpool", played: 38, gd: "+32", points: 82, pts: 82 },
  { rank: 4, pos: 4, team: "Aston Villa", played: 38, gd: "+18", points: 68, pts: 68 },
  { rank: 5, pos: 5, team: "Tottenham", played: 38, gd: "+15", points: 66, pts: 66 },
];

export const leagues = [
  { id: 1, name: "English Premier League", country: "England" },
  { id: 2, name: "La Liga", country: "Spain" },
  { id: 3, name: "Serie A", country: "Italy" },
  { id: 4, name: "Bundesliga", country: "Germany" },
  { id: 5, name: "Ligue 1", country: "France" },
  { id: 6, name: "Champions League", country: "Europe" },
];

export const liveMatch = {
  status: "LIVE",
  minute: "67'",
  home: { name: "Arsenal", score: 2 },
  away: { name: "Chelsea", score: 1 },
  events: [
    { min: "12'", text: "Arsenal opens the scoring with a brilliant header" },
    { min: "34'", text: "Chelsea equalizes from a corner kick" },
    { min: "58'", text: "Arsenal retakes the lead with a counter-attack" },
  ],
};

export const profile = {
  id: 1,
  name: "Caleb Dev",
  handle: "@calebdev",
  username: "@calebdev",
  role: "Predictor",
  avatar: "https://i.pravatar.cc/150?img=33",
  stats: {
    posts: 47,
    predictions: 47,
    upvotes: 234,
    followers: 128,
    accuracy: 73,
  },
  bio: "Football analyst and terrace regular. Predicting matches since 2019.",
};
