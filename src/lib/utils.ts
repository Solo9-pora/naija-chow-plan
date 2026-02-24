import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DayPlan, Meal } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreeting(name: string = "Solomon"): string {
  const hour = new Date().getHours();
  let greeting = "";
  
  if (hour < 12) greeting = "Morning";
  else if (hour < 17) greeting = "Afternoon";
  else greeting = "Evening";
  
  return `${greeting} ${name}! Wetin we dey plan today?`;
}

/**
 * Generates a weekly plan based on preferences and meal list.
 * Avoids consecutive repeats for each meal category.
 */
export function generateWeeklyPlan(
  allMeals: Meal[],
  template: { day: string; date: string; isCurrent?: boolean }[],
  preferences: { variety: number; prepTime: number; budget: number; people: number },
  availableMealIds?: string[]
): DayPlan[] {
  if (!allMeals || allMeals.length === 0) return [];

  const breakfastMeals = allMeals.filter(m => m.category === 'breakfast');
  const lunchMeals = allMeals.filter(m => m.category === 'lunch');
  const dinnerMeals = allMeals.filter(m => m.category === 'dinner');
  const snackMeals = allMeals.filter(m => m.category === 'snack');

  const history: Record<string, string[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  };

  const getNextMeal = (categoryMeals: Meal[], category: string, dayIndex: number): Meal | null => {
    if (categoryMeals.length === 0) return null;
    
    let pool = [...categoryMeals];

    // Priority: If availableMealIds is provided (shopping list mode), 
    // filter pool to ONLY include those meals if possible.
    if (availableMealIds && availableMealIds.length > 0) {
      const availablePool = pool.filter(m => availableMealIds.includes(m.id));
      if (availablePool.length > 0) {
        const prevId = history[category][dayIndex - 1];
        const nonRepeatPool = availablePool.filter(m => m.id !== prevId);
        
        const selected = (nonRepeatPool.length > 0 ? nonRepeatPool : availablePool)[Math.floor(Math.random() * (nonRepeatPool.length > 0 ? nonRepeatPool.length : availablePool.length))];
        history[category].push(selected.id);
        return selected;
      }
    }

    // Standard Generation Logic
    const maxPrep = (preferences.prepTime || 45) + 15;
    const timeFiltered = pool.filter(m => parseInt(m.prepTime || '60') <= maxPrep);
    if (timeFiltered.length > 0) pool = timeFiltered;

    // Avoid consecutive repeats
    if (dayIndex > 0) {
      const prevId = history[category][dayIndex - 1];
      const repeatFiltered = pool.filter(m => m.id !== prevId);
      if (repeatFiltered.length > 0) pool = repeatFiltered;
    }

    // Variety: If variety > 50%, avoid meals from the last 3 days
    if (preferences.variety > 50 && dayIndex > 2) {
      const recentIds = history[category].slice(Math.max(0, dayIndex - 3), dayIndex);
      const varietyFiltered = pool.filter(m => !recentIds.includes(m.id));
      if (varietyFiltered.length > 0) pool = varietyFiltered;
    }

    const selected = pool[Math.floor(Math.random() * pool.length)] || categoryMeals[0];
    if (selected) {
      history[category].push(selected.id);
    }
    return selected;
  };

  return template.map((day, i) => {
    const breakfast = getNextMeal(breakfastMeals, 'breakfast', i);
    const lunch = getNextMeal(lunchMeals, 'lunch', i);
    const dinner = getNextMeal(dinnerMeals, 'dinner', i);
    const snack = getNextMeal(snackMeals, 'snack', i);

    return {
      ...day,
      completed: i < (template.findIndex(d => d.isCurrent) || 0),
      meals: {
        breakfast: breakfast ? [breakfast] : [],
        lunch: lunch ? [lunch] : [],
        dinner: dinner ? [dinner] : [],
        snack: snack ? [snack] : [],
      }
    };
  });
}