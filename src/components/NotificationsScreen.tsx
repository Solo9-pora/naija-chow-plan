import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, Info, User } from 'lucide-react';
import { Button } from './ui';
import { toast } from 'sonner';

interface NotificationsScreenProps {
  onBack: () => void;
  onViewProfile?: () => void;
}

const notifications = [
  {
    id: 1,
    title: 'Plan Generated',
    message: 'Your weekly meal plan for this week is ready! Check it out.',
    time: '2 hours ago',
    type: 'success',
    read: false,
  },
  {
    id: 2,
    title: 'Low Stock Alert',
    message: 'You are running low on Tomatoes and Onions. Added to shopping list.',
    time: '5 hours ago',
    type: 'info',
    read: true,
  },
  {
    id: 3,
    title: 'New Meal Added',
    message: 'Someone shared a new Jollof Rice recipe in the community.',
    time: 'Yesterday',
    type: 'info',
    read: true,
  }
];

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack, onViewProfile }) => {
  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <header className="flex items-center justify-between mb-10 sticky top-0 bg-black/80 backdrop-blur-md py-4 z-20 mx-[-1.5rem] px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Notifications</h1>
            <p className="text-[10px] font-bold text-lime-500/70 uppercase tracking-widest">Stay updated</p>
          </div>
        </div>
        
        <button 
          onClick={onViewProfile}
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          aria-label="Profile"
        >
          <User className="w-5 h-5" />
        </button>
      </header>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-3xl border ${
              notif.read ? 'bg-zinc-900/50 border-white/5' : 'bg-lime-500/5 border-lime-500/20'
            } flex gap-4`}
          >
            <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
              notif.type === 'success' ? 'bg-lime-500 text-black' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-bold text-sm ${notif.read ? 'text-zinc-300' : 'text-white'}`}>
                  {notif.title}
                </h3>
                <span className="text-[10px] text-zinc-500 font-medium">{notif.time}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {notif.message}
              </p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 rounded-full bg-lime-500 mt-2" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button 
          variant="outline" 
          className="border-white/10 text-zinc-500 text-[10px] font-black uppercase tracking-widest px-8"
          onClick={() => toast.info('All marked as read')}
        >
          Mark all as read
        </Button>
      </div>
    </div>
  );
};