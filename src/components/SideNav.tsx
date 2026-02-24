import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Heart, 
  Bell, 
  Settings, 
  Clock, 
  LogOut
} from 'lucide-react';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: any) => void;
  onLogout: () => void;
}

const menuItems = [
  { icon: User, label: 'Profile', view: 'profile-creation' },
  { icon: Heart, label: 'Favorite', view: 'favorites', disabled: true },
  { icon: Bell, label: 'Notifications', view: 'notifications' },
  { icon: Settings, label: 'Settings', view: 'settings', disabled: true },
  { icon: Clock, label: 'Coming Soon', view: 'coming-soon', disabled: true },
];

export const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose, onNavigate, onLogout }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[75%] max-w-[320px] bg-zinc-950 border-r border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 pt-24 flex flex-col h-full">
              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (!item.disabled) {
                        onNavigate(item.view);
                        onClose();
                      }
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                      item.disabled 
                        ? 'opacity-40 cursor-not-allowed' 
                        : 'hover:bg-lime-500/10 active:scale-95 group'
                    }`}
                  >
                    <div className={`p-2 rounded-xl bg-white/5 group-hover:bg-lime-500 transition-colors`}>
                      <item.icon className={`w-5 h-5 ${item.disabled ? 'text-zinc-500' : 'text-white group-hover:text-black'}`} />
                    </div>
                    <span className={`font-bold text-sm tracking-wide ${item.disabled ? 'text-zinc-500' : 'text-zinc-200'}`}>
                      {item.label}
                    </span>
                    {item.disabled && (
                      <span className="ml-auto text-[8px] font-black uppercase tracking-widest text-lime-500/50">Soon</span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="pt-6 mt-auto border-t border-white/10 pb-8">
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-all active:scale-95 group"
                >
                  <div className="p-2 rounded-xl bg-red-500/10 group-hover:bg-red-500 transition-colors">
                    <LogOut className="w-5 h-5 group-hover:text-white" />
                  </div>
                  <span className="font-bold text-sm tracking-wide">Log Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};