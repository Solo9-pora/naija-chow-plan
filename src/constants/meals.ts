import { Meal } from '../types';

export const MEALS: Meal[] = [
  // BREAKFAST
  {
    id: 'b1',
    name: 'Akara & Pap',
    category: 'breakfast',
    prepTime: '25m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/akara---pap-b4c3eec1-1771936052805.webp',
    ingredients: ['Honey Beans (Oloyin)', 'Vegetable Oil (King)', 'Onions (Red)', 'Atarodo (Scotch Bonnet)', 'Cornflakes (Large)'] // Pap substitute or related
  },
  {
    id: 'b2',
    name: 'Moi Moi & Pap',
    category: 'breakfast',
    prepTime: '45m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/moi-moi-f0500dc5-1771927628592.webp',
    ingredients: ['Honey Beans (Oloyin)', 'Palm Oil (Pure)', 'Eggs', 'Titus Fish (Frozen)', 'Onions (Red)']
  },
  {
    id: 'b3',
    name: 'Yam & Egg Sauce',
    category: 'breakfast',
    prepTime: '30m',
    imageUrl: 'https://images.unsplash.com/photo-1598449356475-b9f71ef7d84b?w=400&h=400&fit=crop',
    ingredients: ['Yam (Large)', 'Eggs', 'Fresh Tomatoes', 'Atarodo (Scotch Bonnet)', 'Vegetable Oil (King)']
  },
  {
    id: 'b4',
    name: 'Fried Plantain & Egg',
    category: 'breakfast',
    prepTime: '20m',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop',
    ingredients: ['Plantain (Ripe Bunch)', 'Eggs', 'Vegetable Oil (King)', 'Onions (Red)']
  },
  {
    id: 'b11',
    name: 'Ewa Riro (Bean Porridge)',
    category: 'breakfast',
    prepTime: '40m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/bean-porridge---plantain-b45f48bd-1771936115425.webp',
    ingredients: ['Honey Beans (Oloyin)', 'Palm Oil (Pure)', 'Onions (Red)', 'Big Crayfish', 'Plantain (Ripe Bunch)']
  },
  {
    id: 'b12',
    name: 'Spaghetti & Egg',
    category: 'breakfast',
    prepTime: '20m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/noodles---egg-a2982c09-1771936057370.webp',
    ingredients: ['Spaghetti (Golden Penny)', 'Eggs', 'Vegetable Oil (King)', 'Fresh Tomatoes']
  },

  // LUNCH
  {
    id: 'l1',
    name: 'Pounded Yam & Egusi',
    category: 'lunch',
    prepTime: '60m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/pounded-yam---egusi-soup-adbff277-1771936052242.webp',
    ingredients: ['Yam (Large)', 'Beef (Soft)', 'Palm Oil (Pure)', 'Big Crayfish', 'Ugwu (Pumpkin Leaves)']
  },
  {
    id: 'l2',
    name: 'Jollof Rice & Chicken',
    category: 'lunch',
    prepTime: '55m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/jollof-rice---chicken-cfcd5a88-1771936053223.webp',
    ingredients: ['Foreign Rice', 'Hard Chicken', 'Fresh Tomatoes', 'Tatashe', 'Vegetable Oil (King)']
  },
  {
    id: 'l4',
    name: 'Amala & Ewedu',
    category: 'lunch',
    prepTime: '45m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/amala---ewedu-soup-4247695e-1771936052339.webp',
    ingredients: ['Amala (Yam Flour)', 'Ewedu Leaves', 'Big Crayfish', 'Palm Oil (Pure)', 'Beef (Soft)']
  },
  {
    id: 'l5',
    name: 'Ofada Rice & Ayamase',
    category: 'lunch',
    prepTime: '50m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/ofada-rice---ayamase-109ca924-1771936053807.webp',
    ingredients: ['Local Ofada Rice', 'Palm Oil (Pure)', 'Atarodo (Scotch Bonnet)', 'Beef (Soft)', 'Eggs']
  },
  {
    id: 'l11',
    name: 'Okra Soup & Eba',
    category: 'lunch',
    prepTime: '40m',
    imageUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=400&fit=crop',
    ingredients: ['Fresh Okra', 'Garri (Ijebu White)', 'Palm Oil (Pure)', 'Big Crayfish', 'Beef (Soft)']
  },

  // DINNER
  {
    id: 'd2',
    name: 'Yam Porridge (Asaro)',
    category: 'dinner',
    prepTime: '40m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/yam-porridge--asaro-b63f02b1-1771936056815.webp',
    ingredients: ['Yam (Large)', 'Palm Oil (Pure)', 'Big Crayfish', 'Fresh Tomatoes', 'Atarodo (Scotch Bonnet)']
  },
  {
    id: 'd3',
    name: 'Noodles & Egg',
    category: 'dinner',
    prepTime: '15m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/noodles---egg-a2982c09-1771936057370.webp',
    ingredients: ['Indomie (70g)', 'Eggs', 'Vegetable Oil (King)', 'Onions (Red)']
  },
  {
    id: 'd7',
    name: 'Catfish Pepper Soup',
    category: 'dinner',
    prepTime: '35m',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/pepper-soup-b24cd985-1771927621312.webp',
    ingredients: ['Catfish (Live)', 'Uziza & Utazi', 'Onions (Red)', 'Atarodo (Scotch Bonnet)', 'Ginger & Garlic']
  }
];

// Re-export other constants if needed, but the user request focuses on the logic.
// Keeping it simple for now to avoid massive file. 
// I'll add more if needed.

export const WEEKLY_PLAN_TEMPLATE = [
  { day: 'Monday', date: '22' },
  { day: 'Tuesday', date: '23', isCurrent: true },
  { day: 'Wednesday', date: '24' },
  { day: 'Thursday', date: '25' },
  { day: 'Friday', date: '26' },
  { day: 'Saturday', date: '27' },
  { day: 'Sunday', date: '28' },
];