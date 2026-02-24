import React, { useState } from 'react';
import { Coffee, Sun, Moon, Candy, Trash2, Clock, Plus, Edit2, Check, X, Search, UtensilsCrossed } from 'lucide-react';
import { Meal } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ICONS = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Candy
};

interface MealSlotProps {
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meals: Meal[];
  onAddMore: () => void;
  onRemoveMeal: (index: number) => void;
  onEditMeal: (index: number, newName: string) => void;
}

export const MealSlot = ({ category, meals, onAddMore, onRemoveMeal, onEditMeal }: MealSlotProps) => {
  const Icon = ICONS[category];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pl-1">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg", meals.length > 0 ? "bg-lime-500 text-black" : "bg-zinc-800 text-zinc-500")}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500">
            {category}
          </span>
        </div>
        <button 
          onClick={onAddMore}
          className="text-[10px] font-black uppercase italic text-lime-500 hover:text-white transition-colors flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add {meals.length > 0 ? "More" : "Meal"}
        </button>
      </div>

      <div className="space-y-3">
        {meals.map((meal, idx) => (
          <IndividualMealItem 
            key={`${meal.id}-${idx}`} 
            meal={meal} 
            onRemove={() => onRemoveMeal(idx)}
            onEdit={(name) => onEditMeal(idx, name)}
          />
        ))}

        {meals.length === 0 && (
          <button 
            onClick={onAddMore}
            className="w-full py-8 border-2 border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center gap-2 group hover:border-lime-500/30 transition-all"
          >
            <Plus className="w-6 h-6 text-zinc-600 group-hover:text-lime-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-lime-500">Select {category}</span>
          </button>
        )}
      </div>
    </div>
  );
};

interface IndividualMealItemProps {
  meal: Meal;
  onRemove: () => void;
  onEdit: (newName: string) => void;
}

const IndividualMealItem = ({ meal, onRemove, onEdit }: IndividualMealItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(meal.name);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(editValue);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 hover:border-lime-500/30 transition-all p-4"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
          <img 
            src={meal.imageUrl} 
            alt={meal.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="flex-1 bg-black border border-lime-500/50 rounded-lg px-2 py-1 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-lime-500"
              />
              <button onClick={handleSave} className="p-1 text-lime-500">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 text-zinc-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <h3 className="text-sm font-black text-white group-hover:text-lime-400 transition-colors leading-tight italic uppercase truncate flex items-center gap-2">
              {meal.name}
              <button 
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-opacity"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </h3>
          )}
          
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1 text-zinc-500 text-[8px] font-bold uppercase tracking-widest">
              <Clock className="w-3 h-3" />
              <span>{meal.prepTime}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-500 text-[8px] font-bold uppercase tracking-widest">
              <UtensilsCrossed className="w-3 h-3" />
              <span>NGR</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onRemove}
          className="h-9 w-9 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};