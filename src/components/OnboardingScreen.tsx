import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, cn } from './ui';
import { Users, Zap, DollarSign, Sparkles, MapPin, ChevronRight, X, LogIn, Loader2 } from 'lucide-react';
import { UserPreferences } from '../types';

interface OnboardingScreenProps {
  onComplete: (isGuest: boolean, preferences?: UserPreferences) => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const FAMILY_SIZES = [
  { id: 'solo', label: 'Solo' },
  { id: 'couple', label: 'Couple' },
  { id: 'family', label: 'Family 4+' },
];

const TOGGLES = [
  { id: 'quickPrep', label: 'Quick Prep', icon: <Zap className="w-3.5 h-3.5" /> },
  { id: 'budgetMode', label: 'Budget Mode', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { id: 'highVariety', label: 'High Variety', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, onLoginClick, onSignUpClick }) => {
  const [selectedFamilySizes, setSelectedFamilySizes] = useState<string[]>(['family']);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    quickPrep: true,
    budgetMode: false,
    highVariety: true,
  });
  const [showLocationNudge, setShowLocationNudge] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const toggleFamilySize = (id: string) => {
    setSelectedFamilySizes(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const togglePreference = (id: string) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Artificial delay for "generating" feel
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  const handleProceed = () => {
    const preferences: UserPreferences = {
      prepTime: toggles.quickPrep ? 20 : 45,
      variety: toggles.highVariety ? 80 : 40,
      budget: toggles.budgetMode ? 30 : 60,
      people: selectedFamilySizes.includes('family') ? 4 : (selectedFamilySizes.includes('couple') ? 2 : 1)
    };
    onComplete(true, preferences);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen px-6 pt-12 pb-10 bg-black text-white relative overflow-hidden"
    >
      {/* Login button in top right */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          type="button"
          onClick={onLoginClick}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest text-lime-500"
        >
          <LogIn className="w-3 h-3" />
          Log In
        </button>
      </div>

      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-lime-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-lime-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-start gap-8 z-10">
        {/* Header Section */}
        <div className="space-y-3 text-center w-full pt-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-white"
          >
            Oya Chop <br />
            <span className="text-lime-500">No Stress</span> 🇳🇬
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-zinc-400 font-bold text-sm md:text-base tracking-tight"
          >
            Plan your week sharp sharp – no daily wahala.
          </motion.p>
        </div>

        {/* Visual Section */}
        <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center my-2">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", damping: 12 }}
            className="w-44 h-52 bg-zinc-900/80 border border-white/10 rounded-3xl p-4 shadow-2xl backdrop-blur-sm relative z-20"
          >
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <div className="w-8 h-2 bg-lime-500/50 rounded-full" />
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/5" />)}
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="w-full h-1.5 bg-white/10 rounded-full" />
                    <div className="w-2/3 h-1 bg-white/5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.img 
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/jollof-rice-icon-5affb9cc-1771966075079.webp" 
            alt="Jollof"
            className="absolute -top-2 -left-2 w-20 h-20 object-contain z-30 drop-shadow-[0_20px_30px_rgba(132,204,22,0.3)]"
          />
          <motion.img 
            animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/egusi-soup-icon-a6517d12-1771966075456.webp" 
            alt="Egusi"
            className="absolute top-1/2 -right-4 -translate-y-1/2 w-24 h-24 object-contain z-30 drop-shadow-[0_20px_30px_rgba(234,179,8,0.3)]"
          />
        </div>

        {/* Interaction Section */}
        <div className="w-full space-y-6 mt-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Users className="w-4 h-4 text-lime-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-500">Family Size</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FAMILY_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => toggleFamilySize(size.id)}
                  disabled={isGenerating || isGenerated}
                  className={cn(
                    "px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border flex-1 text-center",
                    selectedFamilySizes.includes(size.id) 
                      ? "bg-lime-500 border-lime-500 text-black shadow-[0_10px_20px_rgba(132,204,22,0.2)]" 
                      : "bg-zinc-900/50 border-white/10 text-zinc-500 hover:border-white/30",
                    (isGenerating || isGenerated) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {TOGGLES.map((toggle) => (
              <button
                key={toggle.id}
                onClick={() => togglePreference(toggle.id)}
                disabled={isGenerating || isGenerated}
                className={cn(
                  "flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group",
                  toggles[toggle.id] ? "bg-lime-500/5 border-lime-500/50" : "bg-zinc-900/30 border-white/5",
                  (isGenerating || isGenerated) && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    toggles[toggle.id] ? "bg-lime-500 text-black" : "bg-white/5 text-zinc-500"
                  )}>
                    {toggle.icon}
                  </div>
                  <span className={cn(
                    "text-xs font-bold",
                    toggles[toggle.id] ? "text-white" : "text-zinc-500"
                  )}>{toggle.label}</span>
                </div>
                <div className={cn(
                  "w-8 h-5 rounded-full border-2 transition-all relative p-0.5",
                  toggles[toggle.id] ? "border-lime-500 bg-lime-500/20" : "border-white/10 bg-white/5"
                )}>
                  <motion.div 
                    animate={{ x: toggles[toggle.id] ? 12 : 0 }}
                    className={cn("w-3 h-3 rounded-full shadow-sm", toggles[toggle.id] ? "bg-lime-500" : "bg-zinc-700")} 
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex flex-col gap-4">
        {!isGenerated ? (
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            size="lg"
            className="w-full h-14 rounded-3xl bg-lime-500 hover:bg-lime-400 text-black text-base font-black uppercase italic tracking-tighter shadow-[0_20px_40px_rgba(132,204,22,0.3)] transition-all active:scale-95 group relative overflow-hidden"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Cooking Plan...
              </div>
            ) : (
              <div className="flex items-center">
                Generate My First Week
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
            {isGenerating && (
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-white/20 skew-x-12"
              />
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleProceed} 
            size="lg"
            className="w-full h-14 rounded-3xl bg-white text-black text-base font-black uppercase italic tracking-tighter shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all active:scale-95 group"
          >
            View My Week
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform text-lime-500" />
          </Button>
        )}
        
        <div className="flex items-center justify-center gap-4 px-1">
          <Button 
            variant="outline"
            onClick={onSignUpClick}
            className="flex-1 h-12 rounded-2xl bg-zinc-900 border-white/5 text-[10px] font-black uppercase tracking-widest text-white hover:border-lime-500/50 hover:bg-zinc-800"
          >
            Sign Up
          </Button>
          <Button 
            variant="outline"
            onClick={onLoginClick}
            className="flex-1 h-12 rounded-2xl bg-zinc-900 border-white/5 text-[10px] font-black uppercase tracking-widest text-lime-500 hover:border-lime-500/50 hover:bg-zinc-800"
          >
            Log In
          </Button>
        </div>

        <p className="text-center text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
          Join the clan for full meal automation
        </p>
      </div>
    </motion.div>
  );
};