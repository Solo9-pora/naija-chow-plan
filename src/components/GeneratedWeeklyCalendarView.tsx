import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Clock, AlertCircle, PackageCheck, Bell, User, Lock, LogIn } from 'lucide-react';
import { DayPlan, Meal, StockItem } from '../types';
import { Button } from './ui';
import { MealSlot } from './MealSlot';
import { AddMealOverlay } from './AddMealOverlay';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface GeneratedWeeklyCalendarViewProps {
  plan: DayPlan[];
  onBack: () => void;
  onRegenerate: () => void;
  onViewShopping: () => void;
  onViewStock: () => void;
  onViewNotifications?: () => void;
  onViewProfile?: () => void;
  initialDayIndex?: number;
  allMeals: Meal[];
  stock: StockItem[];
  onAddCustomMeal: (meal: Meal) => void;
  onUpdateDayPlan: (dayIndex: number, newMeals: DayPlan['meals']) => void;
  isGuest?: boolean;
}

const GeneratedWeeklyCalendarView: React.FC<GeneratedWeeklyCalendarViewProps> = ({ 
  plan,
  onBack, 
  onRegenerate, 
  onViewShopping,
  onViewStock,
  onViewNotifications,
  onViewProfile,
  initialDayIndex = 1,
  allMeals,
  stock,
  onAddCustomMeal,
  onUpdateDayPlan,
  isGuest = false
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(initialDayIndex);
  const [addingToCategory, setAddingToCategory] = useState<keyof DayPlan['meals'] | null>(null);

  const selectedDay = plan[selectedIndex] || plan[0];

  const missingItems = useMemo(() => {
    if (isGuest) return []; // Hide missing items logic for guests to simplify
    const requiredIngredients = new Set<string>();
    plan.forEach(day => {
      Object.values(day.meals).flat().forEach(meal => {
        meal?.ingredients?.forEach(ing => requiredIngredients.add(ing.toLowerCase()));
      });
    });

    const stockNames = new Set(stock.filter(s => s.quantity > 0).map(s => s.name.toLowerCase()));
    const missing: string[] = [];
    requiredIngredients.forEach(ing => {
      if (!stockNames.has(ing)) missing.push(ing);
    });
    return missing;
  }, [plan, stock, isGuest]);

  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!selectedDay) return null;

  const handleRemoveMeal = (category: keyof DayPlan['meals'], mealIndex: number) => {
    const newMeals = { ...selectedDay.meals };
    newMeals[category] = newMeals[category].filter((_, i) => i !== mealIndex);
    onUpdateDayPlan(selectedIndex, newMeals);
    toast.info('Meal removed');
  };

  const handleEditMeal = (category: keyof DayPlan['meals'], mealIndex: number, newName: string) => {
    const newMeals = { ...selectedDay.meals };
    const updatedMeal = { ...newMeals[category][mealIndex], name: newName };
    newMeals[category] = [...newMeals[category]];
    newMeals[category][mealIndex] = updatedMeal;
    onUpdateDayPlan(selectedIndex, newMeals);
    toast.success('Meal updated');
  };

  const handleAddExistingMeal = (meal: Meal) => {
    if (!addingToCategory) return;
    const newMeals = { ...selectedDay.meals };
    newMeals[addingToCategory] = [...newMeals[addingToCategory], meal];
    onUpdateDayPlan(selectedIndex, newMeals);
    setAddingToCategory(null);
    toast.success(`${meal.name} added!`);
  };

  const handleAddCustomMealLocal = (name: string) => {
    if (!addingToCategory) return;
    const newCustomMeal: Meal = {
      id: `custom-${Date.now()}`,
      name,
      category: addingToCategory,
      prepTime: '20m',
      imageUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=400&fit=crop',
      isCustom: true,
      ingredients: []
    };
    onAddCustomMeal(newCustomMeal);
    const newMeals = { ...selectedDay.meals };
    newMeals[addingToCategory] = [...newMeals[addingToCategory], newCustomMeal];
    onUpdateDayPlan(selectedIndex, newMeals);
    setAddingToCategory(null);
    toast.success(`New meal "${name}" added and saved!`);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-32 font-sans selection:bg-lime-500/30 px-4">
      <header className="sticky top-0 z-50 flex items-center justify-between py-4 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-white/5 mx-[-1rem] px-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight uppercase italic">Your Week</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={onViewNotifications} 
              className="relative p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {!isGuest && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lime-500 rounded-full border border-black animate-pulse" />}
            </button>
            <button 
              onClick={onViewProfile} 
              className={cn(
                "p-2 rounded-xl hover:bg-white/10 text-white transition-colors",
                isGuest && "text-lime-500"
              )}
              aria-label="Profile"
            >
              {isGuest ? <LogIn className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </button>
          </div>
          <button onClick={onViewShopping} className="relative p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="py-6 space-y-8">
        <section>
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-2">
            {plan.map((day, idx) => (
              <motion.div key={day.day} data-index={idx} onClick={() => setSelectedIndex(idx)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`relative flex-shrink-0 w-20 py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all cursor-pointer ${idx === selectedIndex ? 'bg-lime-500/10 border-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.2)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                <span className={`text-xs font-medium uppercase tracking-wider ${idx === selectedIndex ? 'text-lime-500' : 'text-zinc-500'}`}>{day.day.slice(0, 3)}</span>
                <span className={`text-xl font-bold ${idx === selectedIndex ? 'text-white' : 'text-zinc-300'}`}>{day.date}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {!isGuest && missingItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-3xl bg-zinc-900 border border-amber-500/30 flex items-start gap-4">
            <div className="p-2 bg-amber-500/20 rounded-xl"><AlertCircle className="w-5 h-5 text-amber-500" /></div>
            <div className="flex-1 space-y-2">
              <h4 className="text-xs font-black uppercase italic tracking-wider text-amber-500">Missing Ingredients</h4>
              <p className="text-[10px] font-bold text-zinc-400 uppercase leading-relaxed">You have {missingItems.length} items needed for this week's meals that aren't in your available stock.</p>
              <div className="flex gap-3 pt-1">
                <button onClick={onViewShopping} className="text-[9px] font-black uppercase text-lime-500 border-b border-lime-500/30">Add to Market List</button>
                <button onClick={onViewStock} className="text-[9px] font-black uppercase text-zinc-500 border-b border-zinc-500/30">Check Stock</button>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.section key={selectedDay.day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">{selectedDay.isCurrent ? "Today's" : selectedDay.day + "'s"} Plan</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full">
                <Clock className="w-3.5 h-3.5 text-lime-500" />
                <span className="text-[10px] font-black text-lime-500 uppercase tracking-widest">Prep: {Object.values(selectedDay.meals).flat().reduce((acc, m) => acc + (m ? parseInt(m.prepTime) : 0), 0)}m</span>
              </div>
            </div>
            <div className="space-y-10">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((category) => (
                <MealSlot key={category} category={category} meals={selectedDay.meals[category]} onAddMore={() => setAddingToCategory(category)} onRemoveMeal={(idx) => handleRemoveMeal(category, idx)} onEditMeal={(idx, name) => handleEditMeal(category, idx, name)} />
              ))}
            </div>
          </motion.section>
        </AnimatePresence>

        <section className="mt-8">
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-lime-500 to-lime-600 text-black shadow-[0_20px_50px_rgba(132,204,22,0.2)] relative overflow-hidden group">
            {isGuest && <div className="absolute top-0 right-0 p-4 opacity-20"><Lock className="w-8 h-8" /></div>}
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-black italic uppercase leading-none tracking-tighter">Available Stock</h3>
                <p className="text-sm font-bold opacity-80 uppercase tracking-tight">Manage your personal pantry items.</p>
              </div>
              <div className="p-3 bg-black/10 rounded-2xl backdrop-blur-sm"><PackageCheck className="w-6 h-6" /></div>
            </div>
            <div className="flex flex-col gap-3 relative z-10">
              <Button onClick={onViewStock} className="w-full bg-black text-white hover:bg-zinc-900 border-none h-14 rounded-2xl font-black uppercase italic text-sm">Check Available Stock</Button>
              <Button onClick={onViewShopping} variant="outline" className="w-full bg-transparent border-black/20 text-black hover:bg-black/5 h-14 rounded-2xl font-black uppercase italic text-sm">Go to Market List</Button>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {addingToCategory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAddingToCategory(null)} className="fixed inset-0 z-[65] bg-black/80 backdrop-blur-md" />
            <AddMealOverlay category={addingToCategory} allMeals={allMeals} onClose={() => setAddingToCategory(null)} onSelect={handleAddExistingMeal} onCustom={handleAddCustomMealLocal} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeneratedWeeklyCalendarView;