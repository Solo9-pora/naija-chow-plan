import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Meal } from '../types';

interface AddMealOverlayProps {
  onClose: () => void;
  onSelect: (meal: Meal) => void;
  onCustom: (name: string) => void;
  category: string;
  allMeals: Meal[];
}

export const AddMealOverlay = ({ onClose, onSelect, onCustom, category, allMeals }: AddMealOverlayProps) => {
  const [search, setSearch] = useState('');
  const [customName, setCustomName] = useState('');

  const filteredMeals = allMeals.filter(m => 
    m.category === category && 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-x-0 bottom-0 z-[70] bg-[#0A0A0A] border-t-2 border-lime-500/30 rounded-t-[2.5rem] p-6 max-h-[80vh] flex flex-col"
    >
      <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black italic uppercase tracking-tighter">Add to {category}</h2>
        <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">Type Custom Meal</label>
          <div className="flex gap-2">
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && customName && onCustom(customName)}
              placeholder="Enter meal name..."
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-lime-500/50 transition-colors"
            />
            <button 
              onClick={() => customName && onCustom(customName)}
              disabled={!customName}
              className="bg-lime-500 text-black px-6 py-3 rounded-xl font-black uppercase italic text-xs disabled:opacity-50 active:scale-95 transition-transform"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3 pb-8">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Select Existing</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-zinc-900/50 border border-white/5 rounded-lg pl-9 pr-3 py-1.5 text-[10px] font-bold outline-none focus:border-lime-500/30 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {filteredMeals.map(meal => (
              <button
                key={meal.id}
                onClick={() => onSelect(meal)}
                className="flex flex-col gap-2 p-3 bg-zinc-900 rounded-2xl border border-white/5 hover:border-lime-500/50 transition-all text-left group"
              >
                <div className="h-24 w-full overflow-hidden rounded-xl bg-zinc-800">
                  <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                </div>
                <span className="text-[10px] font-black uppercase italic line-clamp-1 text-white group-hover:text-lime-500">{meal.name}</span>
              </button>
            ))}
            {filteredMeals.length === 0 && (
              <div className="col-span-2 py-8 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest">
                No meals found
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};