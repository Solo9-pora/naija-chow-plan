import React, { useState } from 'react';
import { Clock, UtensilsCrossed, Trash2, Plus, Edit2, Check, X, Search } from 'lucide-react';
import { Meal } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MealItemProps {
  meal: Meal;
  type: string;
  onRemove: () => void;
  onEdit: (newName: string) => void;
}

export const MealItem = ({ meal, type, onRemove, onEdit }: MealItemProps) => {
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 hover:border-lime-500/30 transition-all p-4"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
          <img 
            src={meal.imageUrl} 
            alt={meal.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="flex-1 min-w-0">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-lime-500/80">
            {type}
          </span>
          
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="flex-1 bg-black border border-lime-500/50 rounded-lg px-2 py-1 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-lime-500"
              />
              <button onClick={handleSave} className="p-1 text-lime-500">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 text-zinc-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h3 className="text-base font-black text-white group-hover:text-lime-400 transition-colors leading-tight italic uppercase truncate flex items-center gap-2">
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
            <div className="flex items-center gap-1 text-zinc-500 text-[9px] font-bold uppercase tracking-widest">
              <Clock className="w-3 h-3" />
              <span>{meal.prepTime}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-500 text-[9px] font-bold uppercase tracking-widest">
              <UtensilsCrossed className="w-3 h-3" />
              <span>NGR</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onRemove}
          className="h-10 w-10 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

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
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Type Custom Meal</label>
          <div className="flex gap-2">
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter meal name..."
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-lime-500/50 transition-colors"
            />
            <button 
              onClick={() => customName && onCustom(customName)}
              disabled={!customName}
              className="bg-lime-500 text-black px-4 py-3 rounded-xl font-black uppercase italic text-xs disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Select Existing</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-zinc-900/50 border border-white/5 rounded-lg pl-9 pr-3 py-1.5 text-[10px] font-bold outline-none focus:border-lime-500/30"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pb-6">
            {filteredMeals.map(meal => (
              <button
                key={meal.id}
                onClick={() => onSelect(meal)}
                className="flex flex-col gap-2 p-3 bg-zinc-900 rounded-2xl border border-white/5 hover:border-lime-500/50 transition-all text-left group"
              >
                <div className="h-20 w-full overflow-hidden rounded-xl bg-zinc-800">
                  <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[10px] font-black uppercase italic line-clamp-1">{meal.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};