// Central data export file for route components
export {
  mockUsers as users,
  mockCategories as categories,
  mockArticles as articles,
  mockReactions as reactions,
  currentUser,
} from "./mockData";

// Additional data structures needed by route components
export const table = [
  { rank: 1, team: "Arsenal", played: 38, gd: "+45", points: 89 },
  { rank: 2, team: "Manchester City", played: 38, gd: "+38", points: 85 },
  { rank: 3, team: "Liverpool", played: 38, gd: "+32", points: 82 },
  { rank: 4, team: "Aston Villa", played: 38, gd: "+18", points: 68 },
  { rank: 5, team: "Tottenham", played: 38, gd: "+15", points: 66 },
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
    upvotes: 234,
    followers: 128,
  },
  bio: "Football analyst and terrace regular. Predicting matches since 2019.",
};
