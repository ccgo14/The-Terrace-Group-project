export const mockUsers = [
  {
    id: 1,
    name: "Caleb Dev",
    role: "Predictor",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: 2,
    name: "Alex Coach",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
];

export const mockCategories = [
  { id: 1, name: "English Premier League" },
  { id: 2, name: "La Liga" },
];

export const mockArticles = [
  {
    id: 101,
    category_id: 1,
    author_id: 2,
    title: "Arsenal vs Chelsea Derby",
    summary: "The battle for London supremacy at the Emirates.",
  },
  {
    id: 102,
    category_id: 2,
    author_id: 2,
    title: "El Clásico Showdown",
    summary: "Real Madrid hosts Barcelona in a crucial title decider.",
  },
];

export const mockReactions = [
  {
    id: 1,
    article_id: 101,
    user_id: 1,
    reactionType: "Home Win",
    body: "Arsenal looks unstoppable at home right now.",
    homeScore: 3,
    awayScore: 1,
  },
  {
    id: 2,
    article_id: 102,
    user_id: 2,
    reactionType: "Draw",
    body: "Both teams are evenly matched defensively.",
    homeScore: 2,
    awayScore: 2,
  },
];

export const currentUser = {
  id: 1,
  name: "Caleb Dev",
  role: "Predictor",
  permissions: "read-write",
};
