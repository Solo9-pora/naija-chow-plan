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
import OTPVerificationPage from './components/auth/OTPVerificationPage';
import { Calendar, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from './components/ui';
import { DayPlan, Meal, StockItem, UserPreferences } from './types';
import { MEALS, WEEKLY_PLAN_TEMPLATE } from './constants/meals';
import { generateWeeklyPlan, cn } from './lib/utils';
import { SideNav } from './components/SideNav';
import { NotificationsScreen } from './components/NotificationsScreen';
import { supabase } from './lib/supabase';

export type AppView = 'onboarding' | 'signup' | 'otp' | 'login' | 'forgot-password' | 'profile-creation' | 'home' | 'calendar' | 'shopping' | 'stock' | 'notifications';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('onboarding');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);
  const [hasPlan, setHasPlan] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  
  const [allMeals, setAllMeals] = useState<Meal[]>(MEALS);
  const [currentPlan, setCurrentPlan] = useState<DayPlan[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);

  // 1. Initial Load & Auth Listener
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserEmail(session.user.email || '');
          setIsGuest(false);
          const hasOnboarded = localStorage.getItem('choptimi_onboarded');
          if (hasOnboarded) {
            setView('home');
          } else {
            setView('profile-creation');
          }
        } else {
          const guestStatus = localStorage.getItem('choptimi_is_guest');
          if (guestStatus === 'true') {
            setIsGuest(true);
            setView('home');
            setHasPlan(true);
          } else {
            const hasOnboarded = localStorage.getItem('choptimi_onboarded');
            if (hasOnboarded) {
              setView('login');
            } else {
              setView('onboarding');
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsFirstLoad(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
        setUserEmail(session.user.email || '');
        setIsGuest(false);
        localStorage.removeItem('choptimi_is_guest');
        
        // Only redirect if they are in auth-related views
        const authViews: AppView[] = ['onboarding', 'signup', 'otp', 'login', 'forgot-password'];
        if (authViews.includes(view)) {
          const hasOnboarded = localStorage.getItem('choptimi_onboarded');
          setView(hasOnboarded ? 'home' : 'profile-creation');
        }
      } else if (event === 'SIGNED_OUT') {
        setUserEmail('');
        setIsGuest(false);
        setHasPlan(false);
        setView('onboarding');
      } else if (event === 'PASSWORD_RECOVERY') {
        setView('forgot-password');
      }
    });

    return () => subscription.unsubscribe();
  }, []); // Only run once on mount

  // 2. Load Local Data (Persistent)
  useEffect(() => {
    const savedCustomMeals = localStorage.getItem('choptimi_custom_meals');
    if (savedCustomMeals) {
      try {
        const parsed = JSON.parse(savedCustomMeals);
        setAllMeals(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNew = parsed.filter((m: Meal) => !existingIds.has(m.id));
          return [...prev, ...uniqueNew];
        });
      } catch (err) {}
    }

    const savedStock = localStorage.getItem('choptimi_stock');
    if (savedStock) {
      try {
        setStock(JSON.parse(savedStock));
      } catch (err) {}
    }

    const savedPlan = localStorage.getItem('choptimi_current_plan');
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        if (parsed && parsed.length > 0) {
          setCurrentPlan(parsed);
          setHasPlan(true);
        }
      } catch (err) {}
    }
  }, []);

  // 3. Auto-generate default plan if needed
  useEffect(() => {
    if (!hasPlan && view === 'home' && currentPlan.length === 0) {
      try {
        const initialPlan = generateWeeklyPlan(
          MEALS, 
          WEEKLY_PLAN_TEMPLATE, 
          { variety: 50, prepTime: 45, budget: 50, people: 2 }
        );
        if (initialPlan && initialPlan.length > 0) {
          setCurrentPlan(initialPlan);
          setHasPlan(true);
        }
      } catch (err) {}
    }
  }, [hasPlan, view, currentPlan.length]);

  const handleUpdateStock = (newStock: StockItem[]) => {
    if (isGuest) {
      handleRestrictedAction('Manage your stock');
      return;
    }
    setStock(newStock);
    localStorage.setItem('choptimi_stock', JSON.stringify(newStock));
  };

  const addCustomMeal = useCallback((meal: Meal) => {
    setAllMeals(prev => {
      if (prev.find(m => m.name.toLowerCase() === meal.name.toLowerCase())) return prev;
      const newMeals = [...prev, meal];
      if (!isGuest) {
        const customOnly = newMeals.filter(m => m.isCustom);
        localStorage.setItem('choptimi_custom_meals', JSON.stringify(customOnly));
      }
      return newMeals;
    });
  }, [isGuest]);

  const updateDayPlan = useCallback((dayIndex: number, newMeals: DayPlan['meals']) => {
    setCurrentPlan(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], meals: newMeals };
      localStorage.setItem('choptimi_current_plan', JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  const handleOnboardingComplete = (asGuest: boolean, preferences?: UserPreferences) => {
    if (asGuest) {
      setIsGuest(true);
      localStorage.setItem('choptimi_is_guest', 'true');
      localStorage.setItem('choptimi_onboarded', 'true');
      
      if (preferences) {
        try {
          const guestPlan = generateWeeklyPlan(allMeals, WEEKLY_PLAN_TEMPLATE, preferences);
          setCurrentPlan(guestPlan);
          localStorage.setItem('choptimi_current_plan', JSON.stringify(guestPlan));
        } catch (err) {
          console.error("Failed to generate guest plan:", err);
        }
      }
      
      setHasPlan(true);
      setView('home');
      toast.success('Welcome! Your weekly plan is ready.', {
        description: 'Explore your meals or sign up for more features.',
        icon: <Sparkles className="w-4 h-4 text-lime-500" />
      });
    } else {
      setView('signup');
    }
  };

  const handleSignUpInit = (email: string, needsVerification: boolean) => {
    setUserEmail(email);
    if (needsVerification) {
      setView('otp');
    } else {
      setView('profile-creation');
    }
  };

  const handleOTPVerify = () => {
    setView('profile-creation');
  };

  const handleProfileComplete = () => {
    localStorage.setItem('choptimi_onboarded', 'true');
    setView('home');
    toast.success('Profile created! Welcome to Oya Chop!');
  };

  const handleLoginSuccess = (email: string) => {
    setIsGuest(false);
    localStorage.removeItem('choptimi_is_guest');
    localStorage.setItem('choptimi_onboarded', 'true');
    setUserEmail(email);
    setView('home');
    toast.success('Welcome back!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('choptimi_onboarded');
    localStorage.removeItem('choptimi_is_guest');
    localStorage.removeItem('choptimi_current_plan');
    setIsGuest(false);
    setHasPlan(false);
    setCurrentPlan([]);
    setView('onboarding');
    toast.info('Logged out successfully');
  };

  const handleGenerate = (params: { prepTime: number; variety: number; budget: number; people: number }) => {
    if (isGuest && hasPlan) {
      handleRestrictedAction('Regenerate weekly plans');
      return;
    }
    try {
      const newPlan = generateWeeklyPlan(allMeals, WEEKLY_PLAN_TEMPLATE, params);
      if (newPlan && newPlan.length > 0) {
        setCurrentPlan(newPlan);
        localStorage.setItem('choptimi_current_plan', JSON.stringify(newPlan));
        setHasPlan(true);
        setSelectedDayIndex(1);
        setView('calendar');
      }
    } catch (err) {}
  };

  const handleManualSave = (plan: DayPlan[]) => {
    if (plan && plan.length > 0) {
      setCurrentPlan(plan);
      localStorage.setItem('choptimi_current_plan', JSON.stringify(plan));
      setHasPlan(true);
      setView('calendar');
    }
  };

  const handleRestrictedAction = (featureName: string) => {
    toast("Sign up for full access", {
      description: `Please sign up to ${featureName.toLowerCase()}.`,
      action: {
        label: "Sign Up",
        onClick: () => setView('signup')
      },
      icon: <AlertCircle className="w-4 h-4 text-lime-500" />
    });
  };

  const handleBackToHome = () => setView('home');
  const goToShopping = () => isGuest ? handleRestrictedAction('Access shopping lists') : setView('shopping');
  const goToStock = () => isGuest ? handleRestrictedAction('Manage your pantry') : setView('stock');
  const goToNotifications = () => isGuest ? handleRestrictedAction('View notifications') : setView('notifications');
  const goToProfile = () => isGuest ? setView('signup') : setView('profile-creation');
  
  const handlePreviewDayClick = (index: number) => {
    setSelectedDayIndex(index);
    setView('calendar');
  };

  if (isFirstLoad) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white selection:bg-lime-500/30 overflow-x-hidden relative">
      <Toaster position="top-center" richColors />
      
      <SideNav 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={(v) => setView(v as AppView)}
        onLogout={handleLogout}
        isGuest={isGuest}
      />

      <AnimatePresence mode="wait">
        {view === 'onboarding' && (
          <motion.div key="onboarding-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto min-h-screen">
            <OnboardingScreen 
              onComplete={handleOnboardingComplete} 
              onLoginClick={() => setView('login')}
              onSignUpClick={() => setView('signup')}
            />
          </motion.div>
        )}

        {view === 'signup' && (
          <motion.div key="signup-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto min-h-screen">
            <SignUpPage 
              onSuccess={handleSignUpInit} 
              onLoginClick={() => setView('login')} 
              onBack={() => setView(isGuest ? 'home' : 'onboarding')}
            />
          </motion.div>
        )}

        {view === 'otp' && (
          <motion.div key="otp-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto min-h-screen">
            <OTPVerificationPage 
              email={userEmail} 
              onVerify={handleOTPVerify} 
              onBack={() => setView('signup')} 
            />
          </motion.div>
        )}

        {view === 'login' && (
          <motion.div key="login-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto min-h-screen">
            <LoginPage 
              onSuccess={handleLoginSuccess} 
              onSignUpClick={() => setView('signup')} 
              onForgotClick={() => setView('forgot-password')} 
              onBack={() => setView(isGuest ? 'home' : 'onboarding')}
              onNeedsVerification={(email) => {
                setUserEmail(email);
                setView('otp');
              }}
            />
          </motion.div>
        )}

        {view === 'forgot-password' && (
          <motion.div key="forgot-password-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto min-h-screen">
            <ForgotPasswordPage onBack={() => setView('login')} />
          </motion.div>
        )}

        {view === 'profile-creation' && (
          <motion.div key="profile-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full">
              <ProfileCreationPage onComplete={handleProfileComplete} onBack={() => setView('home')} />
            </div>
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
              isGuest={isGuest}
            />
            <main className="flex-1 space-y-10 pt-6">
              {hasPlan && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="bg-lime-500/10 border border-lime-500/20 rounded-3xl p-4 flex items-center justify-between shadow-[0_10px_30px_rgba(132,204,22,0.1)] transition-all hover:border-lime-500/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-lime-500 p-2 rounded-xl shadow-[0_5px_15px_rgba(132,204,22,0.3)]">
                      <Calendar className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-black italic uppercase text-sm leading-none text-white">Active Week</h4>
                      <p className="text-[10px] font-bold text-lime-500/70 uppercase tracking-widest mt-1">Plan Ready</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setView('calendar')} 
                    size="sm" 
                    className="bg-lime-500 hover:bg-lime-400 text-black font-black uppercase italic text-[10px] h-8 rounded-xl px-4 shadow-lg"
                  >
                    View Plan
                  </Button>
                </motion.div>
              )}
              
              <div className="relative">
                <div className={cn(isGuest && hasPlan && "opacity-60 grayscale-[0.5] pointer-events-none")}>
                  <AUTOCHOW onGenerate={handleGenerate} />
                </div>
                {isGuest && hasPlan && (
                   <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-center">
                      <div className="bg-black/60 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <h5 className="text-sm font-black uppercase italic mb-2">Automate Everything</h5>
                        <p className="text-[10px] text-zinc-400 mb-4 font-bold uppercase tracking-tight">Sign up to unlock traffic-smart AI generation and smart shopping.</p>
                        <Button 
                          onClick={() => setView('signup')} 
                          className="bg-lime-500 hover:bg-lime-400 text-black font-black uppercase italic rounded-2xl h-12 px-6 w-full shadow-[0_10px_20px_rgba(132,204,22,0.2)]"
                        >
                          Join the Clan
                        </Button>
                      </div>
                   </div>
                )}
              </div>

              <div className="space-y-6 pb-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold uppercase italic tracking-tighter">Your Menu</h3>
                  <button onClick={() => setView('calendar')} className="text-lime-500 text-[10px] font-black uppercase tracking-widest border-b border-lime-500/30">View Detailed</button>
                </div>
                <WeeklyPreview plan={currentPlan} onDayClick={handlePreviewDayClick} />
              </div>
            </main>
            <FAB 
              onPlusClick={() => setIsManualModalOpen(true)} 
              onVoiceClick={() => isGuest ? handleRestrictedAction('Use voice assistant') : toast.info('Voice assistant coming soon!')} 
            />
          </motion.div>
        )}

        {view === 'calendar' && (
          <motion.div key="calendar-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-md mx-auto min-h-screen">
            <GeneratedWeeklyCalendarView 
              plan={currentPlan} 
              onBack={handleBackToHome} 
              onRegenerate={() => isGuest ? handleRestrictedAction('Regenerate plan') : setView('home')} 
              onViewShopping={goToShopping} 
              onViewStock={goToStock} 
              onViewNotifications={goToNotifications}
              onViewProfile={goToProfile}
              initialDayIndex={selectedDayIndex} 
              allMeals={allMeals} 
              stock={stock} 
              onAddCustomMeal={addCustomMeal} 
              onUpdateDayPlan={updateDayPlan} 
              isGuest={isGuest}
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

      <ManualMealEntryModal 
        isOpen={isManualModalOpen} 
        onClose={() => setIsManualModalOpen(false)} 
        onSave={handleManualSave} 
        allMeals={allMeals} 
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-lime-500/5 to-transparent pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-black to-transparent pointer-events-none -z-10" />
    </div>
  );
};

export default App;