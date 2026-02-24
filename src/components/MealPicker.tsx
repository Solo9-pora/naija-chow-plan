import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { Meal } from '../types';
import { MEALS } from '../constants/meals';
import { Button, cn } from './ui';
import { motion, AnimatePresence } from 'framer-motion';

interface MealPickerProps {
  category: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (meal: Meal) => void;
}

export const MealPicker = ({ category, isOpen, onClose, onSelect }: MealPickerProps) => {
  const [search, setSearch] = useState('');
  
  const filteredMeals = MEALS.filter(
    (m) => (category === 'all' || m.category === category) && m.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-zinc-900 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
          <div>
            <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">
              Choose {category}
            </h3>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Select a meal for this slot</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-2xl transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search dishes..."
              className="w-full pl-11 pr-4 py-4 bg-black border border-white/5 rounded-2xl focus:ring-2 focus:ring-lime-500 outline-none text-sm text-white placeholder:text-zinc-600 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 no-scrollbar">
            {filteredMeals.length > 0 ? (
              filteredMeals.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => {
                    onSelect(meal);
                    onClose();
                  }}
                  className="w-full text-left p-4 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 border border-transparent hover:border-lime-500/30 transition-all group flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white group-hover:text-lime-400 transition-colors uppercase italic text-sm">{meal.name}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{meal.prepTime} • Nigerian</p>
                  </div>
                  <div className="p-2 rounded-xl bg-lime-500/10 text-lime-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">No dishes found.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};