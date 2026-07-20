// Re-export mock data with expected names for route components
export { mockUsers as users, mockCategories as categories, mockArticles as articles, mockReactions as reactions, currentUser } from "./mockData";

// Additional data structures needed by route components
export const table = [
  { pos: 1, team: "Arsenal", played: 38, gd: "+45", pts: 89 },
  { pos: 2, team: "Manchester City", played: 38, gd: "+38", pts: 85 },
  { pos: 3, team: "Liverpool", played: 38, gd: "+32", pts: 82 },
  { pos: 4, team: "Aston Villa", played: 38, gd: "+18", pts: 68 },
  { pos: 5, team: "Tottenham", played: 38, gd: "+15", pts: 66 },
];

export const liveMatch = {
  home: "Arsenal",
  away: "Chelsea",
  homeScore: 2,
  awayScore: 1,
  minute: 67,
  events: [
    { min: 12, text: "Arsenal opens the scoring with a brilliant header" },
    { min: 34, text: "Chelsea equalizes from a corner kick" },
    { min: 58, text: "Arsenal retakes the lead with a counter-attack" },
  ],
};

export const profile = {
  id: 1,
  name: "Caleb Dev",
  username: "@calebdev",
  role: "Predictor",
  avatar: "https://i.pravatar.cc/150?img=33",
  stats: {
    predictions: 47,
    accuracy: 73,
    upvotes: 234,
  },
  bio: "Football analyst and terrace regular. Predicting matches since 2019.",
};
