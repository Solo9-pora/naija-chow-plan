import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calendar, Coffee, Utensils, Moon, PieChart, Plus, Trash2 } from 'lucide-react';
import { WEEKLY_PLAN_TEMPLATE } from '../constants/meals';
import { Button } from './ui';
import { Meal, DayPlan } from '../types';
import { toast } from 'sonner';

interface ManualMealEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: DayPlan[]) => void;
  allMeals: Meal[];
}

const mealTimes = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'text-yellow-400' },
  { id: 'lunch', label: 'Lunch', icon: Utensils, color: 'text-orange-400' },
  { id: 'dinner', label: 'Dinner', icon: Moon, color: 'text-indigo-400' },
  { id: 'snack', label: 'Snacks/Small Chops', icon: PieChart, color: 'text-lime-400' },
] as const;

export const ManualMealEntryModal: React.FC<ManualMealEntryModalProps> = ({ isOpen, onClose, onSave, allMeals }) => {
  const [localPlan, setLocalPlan] = useState<DayPlan[]>(() => 
    WEEKLY_PLAN_TEMPLATE.map(day => ({
      ...day,
      meals: {
        breakfast: [allMeals.find(m => m.category === 'breakfast')!],
        lunch: [allMeals.find(m => m.category === 'lunch')!],
        dinner: [allMeals.find(m => m.category === 'dinner')!],
        snack: [allMeals.find(m => m.category === 'snack')!],
      }
    }))
  );

  const handleMealChange = (dayIndex: number, mealTime: keyof DayPlan['meals'], mealIdx: number, mealId: string) => {
    const selectedMeal = allMeals.find(m => m.id === mealId);
    if (!selectedMeal) return;

    setLocalPlan(prev => {
      const newPlan = [...prev];
      const newMealsForTime = [...newPlan[dayIndex].meals[mealTime]];
      newMealsForTime[mealIdx] = selectedMeal;
      
      newPlan[dayIndex] = {
        ...newPlan[dayIndex],
        meals: {
          ...newPlan[dayIndex].meals,
          [mealTime]: newMealsForTime
        }
      };
      return newPlan;
    });
  };

  const addMealToSlot = (dayIndex: number, mealTime: keyof DayPlan['meals']) => {
    const defaultMeal = allMeals.find(m => m.category === mealTime) || allMeals[0];
    setLocalPlan(prev => {
      const newPlan = [...prev];
      newPlan[dayIndex] = {
        ...newPlan[dayIndex],
        meals: {
          ...newPlan[dayIndex].meals,
          [mealTime]: [...newPlan[dayIndex].meals[mealTime], defaultMeal]
        }
      };
      return newPlan;
    });
  };

  const removeMealFromSlot = (dayIndex: number, mealTime: keyof DayPlan['meals'], mealIdx: number) => {
    setLocalPlan(prev => {
      const newPlan = [...prev];
      const newMealsForTime = newPlan[dayIndex].meals[mealTime].filter((_, i) => i !== mealIdx);
      
      newPlan[dayIndex] = {
        ...newPlan[dayIndex],
        meals: {
          ...newPlan[dayIndex].meals,
          [mealTime]: newMealsForTime
        }
      };
      return newPlan;
    });
  };

  const handleSave = () => {
    onSave(localPlan);
    toast.success('Weekly plan saved successfully!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-lime-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg max-h-[90vh] bg-black border-2 border-lime-500/30 rounded-[2.5rem] shadow-2xl shadow-lime-500/20 flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-lime-500/10 flex items-center justify-between bg-lime-500/5">
              <div className="flex items-center gap-3">
                <div className="bg-lime-500 p-2 rounded-xl">
                  <Calendar className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-black italic uppercase leading-none tracking-tighter">Manual Entry</h2>
                  <p className="text-[10px] font-bold text-lime-500/50 uppercase tracking-widest mt-1">Design your own week</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {localPlan.map((day, dayIndex) => (
                <motion.div 
                  key={day.day}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dayIndex * 0.05 }}
                  className="bg-white/5 rounded-3xl p-5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black uppercase italic tracking-wider text-lime-500">
                      {day.day} <span className="text-white/30 ml-1 font-normal">Dec {day.date}</span>
                    </h3>
                    {day.isCurrent && (
                      <span className="bg-lime-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Today</span>
                    )}
                  </div>

                  <div className="space-y-6">
                    {mealTimes.map(({ id, label, icon: Icon, color }) => (
                      <div key={id} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between pl-1">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-3 h-3 ${color}`} />
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/50">{label}</label>
                          </div>
                          <button 
                            onClick={() => addMealToSlot(dayIndex, id)}
                            className="text-[9px] font-black uppercase text-lime-500 flex items-center gap-1 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Add More
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {day.meals[id].map((meal, mealIdx) => (
                            <div key={mealIdx} className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <select
                                  value={meal?.id || ''}
                                  onChange={(e) => handleMealChange(dayIndex, id, mealIdx, e.target.value)}
                                  className="w-full bg-black/40 border border-lime-500/20 rounded-xl px-3 py-2.5 text-xs font-bold appearance-none focus:outline-none focus:border-lime-500/50 transition-colors cursor-pointer pr-10 text-white"
                                >
                                  {allMeals.filter(m => m.category === id).map(m => (
                                    <option key={m.id} value={m.id} className="bg-neutral-900 text-white">
                                      {m.name}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <Utensils className="w-4 h-4 text-lime-500/40" />
                                </div>
                              </div>
                              {day.meals[id].length > 1 && (
                                <button 
                                  onClick={() => removeMealFromSlot(dayIndex, id, mealIdx)}
                                  className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 border-t border-lime-500/10 bg-lime-500/5">
              <Button 
                onClick={handleSave}
                className="w-full bg-lime-500 hover:bg-lime-400 text-black h-14 rounded-2xl font-black italic uppercase tracking-tighter flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <Save className="w-5 h-5" />
                Confirm Weekly Plan
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};