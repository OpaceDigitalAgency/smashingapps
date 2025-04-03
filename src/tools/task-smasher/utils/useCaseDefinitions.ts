export type UseCaseDefinition = {
  label: string;
  keywords: string[];
  negativeKeywords: string[];
  description: string;
};

export const useCaseDefinitions: Record<string, UseCaseDefinition> = {
  daily: {
    label: "Daily Organizer",
    keywords: [
      "today", "tomorrow", "morning", "evening", "daily", "schedule", 
      "routine", "appointment", "meeting", "call", "reminder", "day", 
      "organize", "plan", "check", "review", "update", "email", "task",
      "calendar", "agenda", "work", "personal"
    ],
    negativeKeywords: [
      "recipe", "cook", "ingredient", "marketing", "campaign", "seo",
      "diy", "build", "paint", "travel", "flight", "hotel", "vacation"
    ],
    description: "Everyday tasks, scheduled activities, and daily routines"
  },
  goals: {
    label: "Goal Planner",
    keywords: [
      "goal", "objective", "milestone", "achieve", "accomplish", "target",
      "plan", "strategy", "vision", "mission", "success", "measure",
      "progress", "track", "growth", "improve", "develop", "habit", 
      "resolution", "challenge", "deadline", "outcome", "result"
    ],
    negativeKeywords: [
      "recipe", "cook", "ingredient", "marketing", "campaign", "daily",
      "today", "tomorrow", "shopping", "buy", "purchase", "grocery"
    ],
    description: "Long-term objectives, milestones, and personal development targets"
  },
  marketing: {
    label: "Marketing Tasks",
    keywords: [
      "marketing", "campaign", "social media", "post", "content", "email",
      "newsletter", "audience", "engagement", "analytics", "metrics",
      "conversion", "lead", "customer", "brand", "seo", "advertising",
      "promotion", "launch", "strategy", "market", "competitor", "website",
      "web design", "web development", "UI", "UX", "user interface", "user experience"
    ],
    negativeKeywords: [
      "recipe", "cook", "ingredient", "diy", "build", "paint",
      "shopping", "grocery", "personal", "home", "cleaning", "fix"
    ],
    description: "Marketing campaigns, content creation, SEO, and advertising tasks with project planning"
  },
  recipe: {
    label: "Recipe Steps",
    keywords: [
      "recipe", "cook", "bake", "ingredient", "food", "meal", "prep",
      "kitchen", "dish", "dinner", "lunch", "breakfast", "snack",
      "portion", "serve", "taste", "flavor", "spice", "grill", "roast",
      "mix", "stir", "chop", "slice", "dice", "heat", "simmer", "boil"
    ],
    negativeKeywords: [
      "marketing", "campaign", "seo", "email", "meeting", "work",
      "presentation", "analysis", "report", "review", "assignment"
    ],
    description: "Cooking recipes with ingredients, step-by-step instructions, and kitchen tasks"
  },
  home: {
    label: "Home Chores",
    keywords: [
      "clean", "tidy", "organize", "declutter", "laundry", "dishes",
      "vacuum", "mop", "dust", "wash", "fold", "iron", "repair", "fix",
      "maintenance", "garden", "lawn", "mow", "plant", "water", 
      "furniture", "decorate", "home", "house", "apartment", "room"
    ],
    negativeKeywords: [
      "marketing", "campaign", "seo", "work", "meeting", "presentation",
      "travel", "flight", "hotel", "vacation", "report", "analysis"
    ],
    description: "Household tasks, cleaning, organizing, and home maintenance"
  },
  freelance: {
    label: "Freelancer Projects",
    keywords: [
      "client", "project", "deadline", "proposal", "contract", "invoice",
      "freelance", "gig", "work", "design", "develop", "write", "edit",
      "draft", "revise", "submit", "deliver", "feedback", "meeting",
      "call", "portfolio", "rate", "quote", "payment", "budget"
    ],
    negativeKeywords: [
      "recipe", "cook", "ingredient", "home", "cleaning", "personal",
      "shopping", "grocery", "travel", "vacation", "family"
    ],
    description: "Client work, freelance projects, and business management tasks"
  },
  travel: {
    label: "Trip Planner",
    keywords: [
      "travel", "trip", "vacation", "journey", "flight", "hotel", "booking",
      "reservation", "itinerary", "destination", "sight", "tour", "visa",
      "passport", "pack", "luggage", "map", "guide", "transportation",
      "ticket", "accommodation", "explore", "visit", "adventure"
    ],
    negativeKeywords: [
      "recipe", "marketing", "work", "meeting", "home", "cleaning",
      "laundry", "assignment", "report", "analysis", "presentation"
    ],
    description: "Travel planning, vacation itineraries, and trip logistics"
  },
  shopping: {
    label: "Shopping Tasks",
    keywords: [
      "shopping", "buy", "purchase", "store", "shop", "mall", "online",
      "cart", "checkout", "order", "delivery", "pickup", "return", 
      "exchange", "price", "compare", "sale", "discount", "coupon",
      "item", "product", "brand", "grocery", "list", "budget"
    ],
    negativeKeywords: [
      "marketing", "campaign", "work", "meeting", "presentation",
      "travel", "flight", "hotel", "vacation", "report", "analysis"
    ],
    description: "Shopping lists, purchase planning, and store errands"
  },
  study: {
    label: "Study Plan",
    keywords: [
      "study", "learn", "course", "class", "assignment", "homework",
      "project", "exam", "test", "quiz", "lecture", "note", "research",
      "paper", "thesis", "essay", "read", "write", "review", "practice",
      "solve", "understand", "memorize", "education", "school", "college"
    ],
    negativeKeywords: [
      "recipe", "marketing", "campaign", "home", "cleaning", "shopping",
      "travel", "vacation", "client", "freelance", "work"
    ],
    description: "Academic tasks, learning goals, and education-related activities"
  },
  events: {
    label: "Event Planning",
    keywords: [
      "event", "party", "celebration", "wedding", "birthday", "anniversary",
      "holiday", "gathering", "meetup", "venue", "guest", "invite",
      "invitation", "rsvp", "decorate", "catering", "food", "drink",
      "music", "entertainment", "schedule", "plan", "organize", "host"
    ],
    negativeKeywords: [
      "marketing", "campaign", "work", "meeting", "presentation",
      "assignment", "report", "analysis", "study", "exam", "test"
    ],
    description: "Party planning, event organization, and gathering logistics"
  },
  diy: {
    label: "DIY Projects",
    keywords: [
      "diy", "build", "make", "craft", "create", "project", "tool",
      "material", "wood", "paint", "glue", "cut", "measure", "assemble",
      "design", "fix", "repair", "upcycle", "repurpose", "restore",
      "renovate", "install", "construct", "handmade", "homemade"
    ],
    negativeKeywords: [
      "marketing", "campaign", "work", "meeting", "presentation",
      "study", "exam", "assignment", "report", "analysis"
    ],
    description: "Do-it-yourself projects, crafts, and home improvement tasks"
  },
  creative: {
    label: "Creative Projects",
    keywords: [
      "creative", "art", "design", "draw", "paint", "sketch", "illustration",
      "write", "story", "poetry", "novel", "blog", "content", "photo",
      "video", "film", "edit", "music", "compose", "record", "podcast",
      "create", "idea", "inspiration", "portfolio", "project"
    ],
    negativeKeywords: [
      "marketing", "campaign", "work", "meeting", "presentation",
      "shopping", "grocery", "cleaning", "home", "laundry"
    ],
    description: "Artistic endeavors, content creation, and creative pursuits"
  }
};