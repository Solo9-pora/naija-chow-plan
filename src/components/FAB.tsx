import React from 'react';
import { Plus, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface FABProps {
  onPlusClick?: () => void;
  onVoiceClick?: () => void;
}

export function FAB({ onPlusClick, onVoiceClick }: FABProps) {
  return (
    <div className="fixed bottom-8 right-6 flex flex-col items-end gap-3 z-50">
      <motion.button
        onClick={onPlusClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 bg-[#a3e635] text-black rounded-2xl shadow-2xl shadow-lime-500/40 flex items-center justify-center border-4 border-white/20 hover:border-white/40 transition-all"
      >
        <Plus className="w-8 h-8 stroke-[3]" />
      </motion.button>
      <button 
        onClick={onVoiceClick}
        className="bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-white/10 hover:bg-gray-800 transition-colors"
      >
        <Mic className="w-3 h-3 text-lime-500" />
        Voice Plan
      </button>
    </div>
  );
}