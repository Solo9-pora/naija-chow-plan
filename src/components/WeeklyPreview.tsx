import React from 'react';
import { motion } from 'framer-motion';
import { DayPlan } from '../types';

interface WeeklyPreviewProps {
  plan: DayPlan[];
  onDayClick?: (index: number) => void;
}

export function WeeklyPreview({ plan, onDayClick }: WeeklyPreviewProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar">
      {plan.map((day, index) => {
        const lunchMeal = day.meals.lunch[0];
        const additionalMeals = day.meals.lunch.length > 1 ? ` + ${day.meals.lunch.length - 1}` : '';
        
        return (
          <motion.div 
            key={day.day} 
            onClick={() => onDayClick?.(index)}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex-shrink-0 w-36 h-48 rounded-3xl border transition-all overflow-hidden flex flex-col group cursor-pointer
              ${day.isCurrent 
                ? 'bg-zinc-800 border-lime-500 shadow-[0_10px_30px_rgba(132,204,22,0.1)]' 
                : 'bg-zinc-900/50 border-white/5 hover:border-white/10'}`}
          >
            <div className="h-24 overflow-hidden relative bg-zinc-800">
              {lunchMeal && (
                <img 
                  src={lunchMeal.imageUrl} 
                  alt={lunchMeal.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
              )}
              <div className={`absolute top-2 left-2 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10
                ${day.isCurrent ? 'bg-lime-500 text-black' : 'bg-black/40 text-white'}`}>
                 <span className="text-[10px] font-black uppercase tracking-tighter">{day.day.slice(0, 3)}</span>
              </div>
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
                  Lunch Selection
                </p>
                <p className={`text-xs font-black leading-tight line-clamp-2 uppercase italic
                  ${day.isCurrent ? 'text-lime-400' : 'text-white'}`}>
                  {lunchMeal?.name ? `${lunchMeal.name}${additionalMeals}` : 'No Meal'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <div className={`w-1.5 h-1.5 rounded-full ${day.isCurrent ? 'bg-lime-500 animate-pulse' : 'bg-zinc-600'}`} />
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                  {day.isCurrent ? 'Plan Ready' : 'Past Plan'}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default WeeklyPreview;