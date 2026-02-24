import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChefHat, Wallet, Users, RefreshCw } from 'lucide-react';
import { Button, Slider } from './ui';
import { toast } from 'sonner';

interface AUTOCHOWProps {
  onGenerate: (params: {
    prepTime: number;
    variety: number;
    budget: number;
    people: number;
  }) => void;
}

const AUTOCHOW: React.FC<AUTOCHOWProps> = ({ onGenerate }) => {
  const [prepTime, setPrepTime] = useState([30]);
  const [variety, setVariety] = useState([70]);
  const [budget, setBudget] = useState([50]);
  const [people, setPeople] = useState([2]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    toast.success("Crafting your perfect meal plan...");
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      onGenerate({
        prepTime: prepTime[0],
        variety: variety[0],
        budget: budget[0],
        people: people[0]
      });
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="space-y-2">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">
          <span className="text-lime-500">AUTO</span>CHOW
        </h2>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Fine-tune your week with precision.</p>
      </div>

      <div className="grid gap-8">
        {/* Prep Time */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 bg-zinc-900 rounded-lg border border-white/5">
                <ChefHat className="w-3.5 h-3.5 text-lime-500" />
              </div>
              <span className="font-black uppercase text-[10px] tracking-widest">Prep Time</span>
            </div>
            <span className="text-lime-500 font-black italic">{prepTime}m</span>
          </div>
          <Slider 
            value={prepTime} 
            onValueChange={setPrepTime} 
            max={120} 
            step={5} 
            className="[&_[role=slider]]:bg-lime-500"
          />
        </div>

        {/* Variety */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 bg-zinc-900 rounded-lg border border-white/5">
                <Sparkles className="w-3.5 h-3.5 text-lime-500" />
              </div>
              <span className="font-black uppercase text-[10px] tracking-widest">Variety</span>
            </div>
            <span className="text-lime-500 font-black italic">{variety}%</span>
          </div>
          <Slider 
            value={variety} 
            onValueChange={setVariety} 
            max={100} 
            step={1} 
            className="[&_[role=slider]]:bg-lime-500"
          />
        </div>

        {/* Budget */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 bg-zinc-900 rounded-lg border border-white/5">
                <Wallet className="w-3.5 h-3.5 text-lime-500" />
              </div>
              <span className="font-black uppercase text-[10px] tracking-widest">Budget</span>
            </div>
            <span className="text-lime-500 font-black italic">₦{budget[0] * 1000}</span>
          </div>
          <Slider 
            value={budget} 
            onValueChange={setBudget} 
            max={100} 
            step={5} 
            className="[&_[role=slider]]:bg-lime-500"
          />
        </div>

        {/* People */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 bg-zinc-900 rounded-lg border border-white/5">
                <Users className="w-3.5 h-3.5 text-lime-500" />
              </div>
              <span className="font-black uppercase text-[10px] tracking-widest">People</span>
            </div>
            <span className="text-lime-500 font-black italic">{people}</span>
          </div>
          <Slider 
            value={people} 
            onValueChange={setPeople} 
            max={10} 
            min={1} 
            step={1} 
            className="[&_[role=slider]]:bg-lime-500"
          />
        </div>
      </div>

      <motion.div
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 left-4 right-4 z-40"
      >
        <Button 
          disabled={isGenerating}
          onClick={handleGenerate}
          className="w-full bg-lime-500 hover:bg-lime-400 text-black font-black text-lg py-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(132,204,22,0.3)] border-none uppercase italic group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            {isGenerating ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate My Week
                <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
              </>
            )}
          </span>
          {isGenerating && (
            <motion.div 
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default AUTOCHOW;