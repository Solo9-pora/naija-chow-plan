import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Header } from './components/Header';
import AUTOCHOW from './components/AUTOCHOW';
import WeeklyPreview from './components/WeeklyPreview';
import { FAB } from './components/FAB';
import GeneratedWeeklyCalendarView from './components/GeneratedWeeklyCalendarView';
import ShoppingListScreen from './components/ShoppingListScreen';
import AvailableStockScreen from './components/AvailableStockScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { ManualMealEntryModal } from './components/ManualMealEntryModal';
import SignUpPage from './components/auth/SignUpPage';
import LoginPage from './components/auth/LoginPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ProfileCreationPage from './components/auth/ProfileCreationPage';
import { Calendar } from 'lucide-react';
import { Button } from './components/ui';
import { DayPlan, Meal, StockItem } from './types';
import { MEALS, WEEKLY_PLAN_TEMPLATE } from './constants/meals';
import { generateWeeklyPlan } from './lib/utils';
import { SideNav } from './components/SideNav';
import { NotificationsScreen } from './components/NotificationsScreen';

type AppView = 'onboarding' | 'signup' | 'login' | 'forgot-password' | 'profile-creation' | 'home' | 'calendar' | 'shopping' | 'stock' | 'notifications';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('onboarding');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Default to Tuesday
  const [hasPlan, setHasPlan] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Dynamic meal list including custom ones
  const [allMeals, setAllMeals] = useState<Meal[]>(MEALS);
  
  // Lifted plan state
  const [currentPlan, setCurrentPlan] = useState<DayPlan[]>([]);

  // Available Stock state
  const [stock, setStock] = useState<StockItem[]>([]);

  // Load custom meals and stock from localStorage on init
  useEffect(() => {
    const savedCustomMeals = localStorage.getItem('choptimi_custom_meals');
    if (savedCustomMeals) {
      try {
        const parsed = JSON.parse(savedCustomMeals);
        setAllMeals(prev => [...prev, ...parsed]);
      } catch (err) {
        console.error("Failed to parse custom meals", err);
      }
    }

    const savedStock = localStorage.getItem('choptimi_stock');
    if (savedStock) {
      try {
        setStock(JSON.parse(savedStock));
      } catch (err) {
        console.error("Failed to parse stock", err);
      }
    }
  }, []);

  const handleUpdateStock = (newStock: StockItem[]) => {
    setStock(newStock);
    localStorage.setItem('choptimi_stock', JSON.stringify(newStock));
  };

  const addCustomMeal = useCallback((meal: Meal) => {
    setAllMeals(prev => {
      // Check if meal already exists
      if (prev.find(m => m.name.toLowerCase() === meal.name.toLowerCase())) return prev;
      const newMeals = [...prev, meal];
      const customOnly = newMeals.filter(m => m.isCustom);
      localStorage.setItem('choptimi_custom_meals', JSON.stringify(customOnly));
      return newMeals;
    });
  }, []);

  const updateDayPlan = useCallback((dayIndex: number, newMeals: DayPlan['meals']) => {
    setCurrentPlan(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], meals: newMeals };
      return updated;
    });
  }, []);

  useEffect(() => {
    try {
      const initialPlan = generateWeeklyPlan(
        MEALS, 
        WEEKLY_PLAN_TEMPLATE, 
        { variety: 50, prepTime: 45, budget: 50, people: 2 }
      );
      if (initialPlan && initialPlan.length > 0) {
        setCurrentPlan(initialPlan);
      }

      const hasOnboarded = localStorage.getItem('choptimi_onboarded');
      if (hasOnboarded) {
        setView('home');
        setHasPlan(true); 
      }
    } catch (err) {
      console.error("Initialization error:", err);
    } finally {
      setIsFirstLoad(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  const handleOnboardingComplete = () => {
    setView('signup');
  };

  const handleSignUpSuccess = () => {
    setView('profile-creation');
  };

  const handleProfileComplete = () => {
    localStorage.setItem('choptimi_onboarded', 'true');
    setView('home');
    toast.success('Welcome to Oya Chop!');
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('choptimi_onboarded', 'true');
    setView('home');
    toast.success('Welcome back!');
  };

  const handleLogout = () => {
    localStorage.removeItem('choptimi_onboarded');
    setView('login');
    toast.info('Logged out successfully');
  };

  const handleGenerate = (params: { prepTime: number; variety: number; budget: number; people: number }) => {
    try {
      const newPlan = generateWeeklyPlan(allMeals, WEEKLY_PLAN_TEMPLATE, params);
      if (newPlan && newPlan.length > 0) {
        setCurrentPlan(newPlan);
        setHasPlan(true);
        setSelectedDayIndex(1);
        setView('calendar');
      }
    } catch (err) {
      console.error("Generation error:", err);
    }
  };

  const handleManualSave = (plan: DayPlan[]) => {
    if (plan && plan.length > 0) {
      setCurrentPlan(plan);
      setHasPlan(true);
      setView('calendar');
    }
  };

  const handleBackToHome = () => setView('home');
  const goToShopping = () => setView('shopping');
  const goToStock = () => setView('stock');
  const goToNotifications = () => setView('notifications');
  const goToProfile = () => setView('profile-creation');
  
  const handlePreviewDayClick = (index: number) => {
    setSelectedDayIndex(index);
    setView('calendar');
  };

  if (isFirstLoad) return null;

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white selection:bg-lime-500/30 overflow-x-hidden relative">
      <Toaster position="top-center" richColors />
      
      <SideNav 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={(v) => setView(v as AppView)}
        onLogout={handleLogout}
      />

      <AnimatePresence mode="wait">
        {view === 'onboarding' && (
          <motion.div key="onboarding-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto min-h-screen">
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {view === 'signup' && (
          <motion.div key="signup-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto min-h-screen">
            <SignUpPage 
              onSuccess={handleSignUpSuccess} 
              onLoginClick={() => setView('login')} 
              onBack={() => setView('onboarding')}
            />
          </motion.div>
        )}

        {view === 'login' && (
          <motion.div key="login-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto min-h-screen">
            <LoginPage 
              onSuccess={handleLoginSuccess} 
              onSignUpClick={() => setView('signup')} 
              onForgotClick={() => setView('forgot-password')} 
              onBack={() => setView('onboarding')}
            />
          </motion.div>
        )}

        {view === 'forgot-password' && (
          <motion.div key="forgot-password-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto min-h-screen">
            <ForgotPasswordPage onBack={() => setView('login')} />
          </motion.div>
        )}

        {view === 'profile-creation' && (
          <motion.div key="profile-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto min-h-screen">
            <ProfileCreationPage onComplete={handleProfileComplete} onBack={() => setView('home')} />
          </motion.div>
        )}

        {view === 'home' && (
          <motion.div key="home-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto min-h-screen flex flex-col px-4 pb-24">
            <Header 
              onCartClick={goToShopping} 
              onNotificationClick={goToNotifications}
              onProfileClick={goToProfile}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <main className="flex-1 space-y-10 pt-6">
              {hasPlan && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-lime-500/10 border border-lime-500/20 rounded-3xl p-4 flex items-center justify-between shadow-[0_10px_30px_rgba(132,204,22,0.1)]">
                  <div className="flex items-center gap-3">
                    <div className="bg-lime-500 p-2 rounded-xl"><Calendar className="w-5 h-5 text-black" /></div>
                    <div>
                      <h4 className="font-black italic uppercase text-sm leading-none">Active Week</h4>
                      <p className="text-[10px] font-bold text-lime-500/70 uppercase tracking-widest mt-1">Plan Ready</p>
                    </div>
                  </div>
                  <Button onClick={() => setView('calendar')} size="sm" className="bg-lime-500 text-black font-black uppercase italic text-[10px] h-8 rounded-xl px-4">View Week</Button>
                </motion.div>
              )}
              <AUTOCHOW onGenerate={handleGenerate} />
              <div className="space-y-6 pb-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold uppercase italic tracking-tighter">Current Plan Preview</h3>
                  <button onClick={() => setView('calendar')} className="text-lime-500 text-[10px] font-black uppercase tracking-widest border-b border-lime-500/30">View Detailed</button>
                </div>
                <WeeklyPreview plan={currentPlan} onDayClick={handlePreviewDayClick} />
              </div>
            </main>
            <FAB onPlusClick={() => setIsManualModalOpen(true)} onVoiceClick={() => console.log('Voice triggered')} />
          </motion.div>
        )}

        {view === 'calendar' && (
          <motion.div key="calendar-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-md mx-auto min-h-screen">
            <GeneratedWeeklyCalendarView 
              plan={currentPlan} 
              onBack={handleBackToHome} 
              onRegenerate={() => setView('home')} 
              onViewShopping={goToShopping} 
              onViewStock={goToStock} 
              onViewNotifications={goToNotifications}
              onViewProfile={goToProfile}
              initialDayIndex={selectedDayIndex} 
              allMeals={allMeals} 
              stock={stock} 
              onAddCustomMeal={addCustomMeal} 
              onUpdateDayPlan={updateDayPlan} 
            />
          </motion.div>
        )}

        {view === 'shopping' && (
          <motion.div key="shopping-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="max-w-md mx-auto min-h-screen">
            <ShoppingListScreen 
              onBack={() => setView('calendar')} 
              plan={currentPlan} 
              stock={stock} 
            />
          </motion.div>
        )}

        {view === 'stock' && (
          <motion.div key="stock-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="max-w-md mx-auto min-h-screen">
            <AvailableStockScreen 
              onBack={() => setView('calendar')} 
              onViewNotifications={goToNotifications}
              onViewProfile={goToProfile}
              stock={stock} 
              onUpdateStock={handleUpdateStock} 
            />
          </motion.div>
        )}

        {view === 'notifications' && (
          <motion.div key="notifications-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="max-w-md mx-auto min-h-screen">
            <NotificationsScreen onBack={handleBackToHome} />
          </motion.div>
        )}
      </AnimatePresence>

      <ManualMealEntryModal isOpen={isManualModalOpen} onClose={() => setIsManualModalOpen(false)} onSave={handleManualSave} allMeals={allMeals} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-lime-500/5 to-transparent pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-black to-transparent pointer-events-none -z-10" />
    </div>
  );
};

export default App;