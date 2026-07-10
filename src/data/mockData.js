
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
    image_url: "https://picsum.photos/400/300?random=1" // Added simple image placeholder link
  },
  {
    id: 102,
    category_id: 2,
    author_id: 2,
    title: "El Clásico Showdown",
    summary: "Real Madrid hosts Barcelona in a crucial title decider.",
    image_url: "https://picsum.photos/400/300?random=2" // Added simple image placeholder link
  },
];


export const mockReactions = [
  {
    id: 1,
    article_id: 101,
    user_id: 1,
    reaction_type: "prediction",
    details: "Home Win (3-1) - Arsenal looks unstoppable at home right now.", // Combined score and body into text
  },
  {
    id: 2,
    article_id: 102,
    user_id: 2,
    reaction_type: "analysis",
    details: "Draw (2-2) - Both teams are evenly matched defensively.",
  },
];


export const currentUser = {
  id: 1,
  name: "Caleb Dev",
  role: "Predictor",
  permissions: "read-write",
};