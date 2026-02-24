import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, cn } from './ui';
import { ChefHat, Users, Zap, Utensils } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const FAMILY_SIZES = [
  { id: 'solo', label: 'Solo', icon: <Users className="w-4 h-4" /> },
  { id: 'couple', label: 'Couple', icon: <Users className="w-4 h-4" /> },
  { id: 'family', label: 'Family 4+', icon: <Users className="w-4 h-4" /> },
];

const VARIETY_STYLES = [
  { id: 'traditional', label: 'Traditional', icon: <Utensils className="w-4 h-4" /> },
  { id: 'quick', label: 'Quick & Easy', icon: <Zap className="w-4 h-4" /> },
  { id: 'gourmet', label: 'Gourmet', icon: <ChefHat className="w-4 h-4" /> },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [familySize, setFamilySize] = useState('family');
  const [variety, setVariety] = useState('traditional');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col min-h-screen px-6 pt-12 pb-10 bg-black text-white"
    >
      <div className="flex-1 space-y-8">
        {/* Header Section */}
        <div className="space-y-2 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-black italic uppercase tracking-tighter leading-tight"
          >
            Oya Chop <span className="text-lime-500 underline decoration-2 underline-offset-4">Stress-Free</span>, Solomon! 🇳🇬
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 font-medium"
          >
            Plan your week in 30 seconds
          </motion.p>
        </div>

        {/* Illustration Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-square w-full max-w-[280px] mx-auto"
        >
          <div className="absolute inset-0 bg-lime-500/20 blur-[80px] rounded-full" />
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/naija-meal-calendar-illustration-82a4dad2-1771930192641.webp" 
            alt="Nigerian Meal Calendar"
            className="relative w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Preferences Section */}
        <div className="space-y-6">
          {/* Family Size */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Family Size</label>
            <div className="flex flex-wrap gap-2">
              {FAMILY_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setFamilySize(size.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border",
                    familySize === size.id 
                      ? "bg-lime-500 border-lime-500 text-black shadow-[0_0_20px_rgba(132,204,22,0.3)]" 
                      : "bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800"
                  )}
                >
                  {size.icon}
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Variety Style */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Variety Style</label>
            <div className="flex flex-wrap gap-2">
              {VARIETY_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setVariety(style.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border",
                    variety === style.id 
                      ? "bg-lime-500 border-lime-500 text-black shadow-[0_0_20px_rgba(132,204,22,0.3)]" 
                      : "bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800"
                  )}
                >
                  {style.icon}
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10"
      >
        <Button 
          onClick={onComplete}
          size="lg"
          className="w-full h-16 rounded-[2rem] text-lg font-black uppercase italic tracking-tighter shadow-lg shadow-lime-500/20"
        >
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
};