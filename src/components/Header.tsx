import React from 'react';
import { ShoppingCart, Menu, X, Bell, User, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  onCartClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  hideNotifications?: boolean;
  hideProfile?: boolean;
  isGuest?: boolean;
}

export function Header({ 
  onCartClick, 
  onNotificationClick, 
  onProfileClick,
  isSidebarOpen, 
  toggleSidebar,
  hideNotifications = false,
  hideProfile = false,
  isGuest = false
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-0 py-4 bg-transparent sticky top-0 z-[80]">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className={cn(
            "p-2.5 rounded-2xl transition-all duration-500 relative z-[90]",
            isSidebarOpen 
              ? "bg-lime-500 text-black shadow-[0_0_20px_rgba(132,204,22,0.4)] rotate-90" 
              : "bg-white/5 border border-white/10 text-white"
          )}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className={cn(
          "flex items-center gap-2 transition-opacity duration-300",
          isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <div className="w-9 h-9 bg-lime-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(132,204,22,0.3)]">
            <span className="text-black font-black text-xl italic">C</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white italic uppercase">ChopTime</h1>
        </div>
      </div>
      
      <div className={cn(
        "flex items-center gap-2 transition-opacity duration-300",
        isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        {!hideNotifications && (
          <button 
            onClick={onNotificationClick}
            className="relative p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {!isGuest && <span className="absolute top-2 right-2 w-2 h-2 bg-lime-500 rounded-full border border-black animate-pulse" />}
          </button>
        )}
        
        {!hideProfile && (
          <button 
            onClick={onProfileClick}
            className={cn(
              "p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors",
              isGuest && "border-lime-500/50 text-lime-500"
            )}
          >
            {isGuest ? <LogIn className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </button>
        )}

        <button 
          onClick={onCartClick}
          className="relative p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors ml-1"
        >
          <ShoppingCart className="w-5 h-5" />
          {!isGuest && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-lime-500 rounded-full text-[8px] font-black text-black flex items-center justify-center border-2 border-black">
              3
            </span>
          )}
        </button>
      </div>
    </header>
  );
}