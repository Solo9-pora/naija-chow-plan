export interface Meal {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTime: string;
  imageUrl: string;
  calories?: number;
  tags?: string[];
  isCustom?: boolean;
  ingredients?: string[];
}

export interface DayPlan {
  day: string;
  date: string;
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snack: Meal[];
  };
  isCurrent?: boolean;
  completed?: boolean;
}

export interface UserPreferences {
  prepTime: number;
  variety: number;
  budget: number;
  people: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  unit: string;
  budgetPrice: number;
  actualPrice: number;
  checked: boolean;
}

export interface ShoppingCategory {
  id: string;
  name: string;
  imageUrl: string;
  items: ShoppingItem[];
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
}

export interface UserAccount {
  email: string;
  password?: string;
  fullName?: string;
  location?: string;
}