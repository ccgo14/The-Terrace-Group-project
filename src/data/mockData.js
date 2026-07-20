// Static mock data for The Terrace. No API calls.

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
  { id: 1, name: "English Premier League", count: 45 },
  { id: 2, name: "La Liga", count: 32 },
  { id: 3, name: "Serie A", count: 28 },
  { id: 4, name: "Bundesliga", count: 24 },
  { id: 5, name: "Ligue 1", count: 21 },
  { id: 6, name: "Champions League", count: 18 },
];

export const mockArticles = [
  {
    id: "middletown-derby-stalemate",
    kind: "MATCH REPORT",
    type: "photo",
    title: "MIDDLETOWN DERBY ENDS STALEMATE",
    excerpt:
      "Ten men held on as the two rivals cancelled each other out in a bruising, goalless afternoon at the Vale.",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    author: "R. Okafor",
    time: "2h",
    category: "Match Reports",
    upvotes: 124,
    comments: 48,
  },
  {
    id: "city-stunned-late-drama",
    kind: "MATCH REPORT",
    type: "photo",
    title: "CITY STUNNED IN LATE DRAMA",
    excerpt:
      "A 94th-minute header ripped three points from City's grasp in front of a stunned home terrace.",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    author: "J. Nwosu",
    time: "5h",
    category: "Match Reports",
    upvotes: 302,
    comments: 96,
  },
  {
    id: "the-derby-was-ours",
    kind: "FAN REACTION",
    type: "illustration",
    title: "THE DERBY WAS OURS TO LOSE",
    excerpt:
      "Hot take from the North Stand: we bottled it again and the manager has to answer for the setup.",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    author: "TerraceTom",
    time: "1h",
    category: "Fan Reactions",
    upvotes: 512,
    comments: 214,
  },
  {
    id: "keep-the-faith",
    kind: "FAN REACTION",
    type: "illustration",
    title: "KEEP THE FAITH, IT'S A LONG SEASON",
    excerpt:
      "One dropped result is not a crisis. The kids are learning and the away end never stopped singing.",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
    author: "RedTillIDie",
    time: "3h",
    category: "Fan Reactions",
    upvotes: 88,
    comments: 33,
  },
  {
    id: "wanderers-tackle-report",
    kind: "MATCH REPORT",
    type: "photo",
    title: "WANDERERS GRIND OUT A POINT",
    excerpt:
      "A backs-to-the-wall away display earned the Wanderers a hard-fought draw against the run of play.",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    author: "A. Fofana",
    time: "8h",
    category: "Match Reports",
    upvotes: 176,
    comments: 51,
  },
];

export const mockReactions = [
  {
    id: 1,
    article_id: "city-stunned-late-drama",
    user_id: 1,
    reaction_type: "prediction",
    details: "Home Win (3-1) - City looks unstoppable at home right now.",
    author: "Caleb Dev",
    time: "5 minutes ago",
    body: "City's midfield control was exceptional throughout the match.",
    upvotes: 12,
  },
  {
    id: 2,
    article_id: "city-stunned-late-drama",
    user_id: 2,
    reaction_type: "analysis",
    details: "Draw (2-2) - Both teams are evenly matched defensively.",
    author: "Alex Coach",
    time: "10 minutes ago",
    body: "The visitors had their chances but couldn't convert in the final third.",
    upvotes: 8,
  },
  {
    id: 3,
    article_id: "the-derby-was-ours",
    user_id: 1,
    reaction_type: "hot take",
    details: "City will finish top 3 this season.",
    author: "Caleb Dev",
    time: "1 hour ago",
    body: "The squad depth and form are finally coming together.",
    upvotes: 34,
  },
];

export const currentUser = {
  id: 1,
  name: "Caleb Dev",
  role: "Predictor",
  permissions: "read-write",
};
