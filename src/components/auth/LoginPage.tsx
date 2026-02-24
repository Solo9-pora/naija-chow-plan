import React, { useState } from 'react';
import { Button, Input } from '../ui';
import { Mail, Lock, ArrowRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface LoginPageProps {
  onSuccess: (email: string) => void;
  onSignUpClick: () => void;
  onForgotClick: () => void;
  onBack: () => void;
  onNeedsVerification?: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onSignUpClick, onForgotClick, onBack, onNeedsVerification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Missing Info', { description: 'Please fill in all fields.' });
      return;
    }
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          toast.error('Verification Required', { description: 'Please verify your email before logging in.' });
          onNeedsVerification?.(email);
        } else {
          toast.error('Login Failed', { description: error.message });
        }
      } else if (data.user) {
        onSuccess(email);
      }
    } catch (err: any) {
      toast.error('Error', { description: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-10 bg-black text-white relative">
      <button 
        type="button"
        onClick={onBack}
        className="absolute left-6 top-10 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 space-y-8 max-w-sm mx-auto w-full pt-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-lime-500 rounded-3xl flex items-center justify-center transform -rotate-6 shadow-[0_10px_30px_rgba(132,204,22,0.3)]">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/app-logo-9198864d-1771957220006.webp" 
              alt="Oya Chop" 
              className="w-12 h-12 object-contain rotate-6"
            />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
            Welcome <span className="text-lime-500 text-4xl">Back</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">Sign in to your kitchen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type="email" 
                placeholder="solomon@oyachop.com" 
                className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl focus:border-lime-500/50" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-lime-500">Password</label>
              <button 
                type="button"
                onClick={onForgotClick}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-lime-500 transition-colors"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="pl-12 pr-12 bg-white/5 border-white/10 h-14 rounded-2xl focus:border-lime-500/50" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-500 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button 
            disabled={isLoading}
            type="submit" 
            className="w-full mt-6 group h-14 rounded-[2rem] text-lg uppercase italic font-black bg-lime-500 text-black hover:bg-lime-400 shadow-[0_15px_30px_rgba(132,204,22,0.2)]"
          >
            {isLoading ? 'Checking...' : 'Login Now'}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-xs font-bold uppercase tracking-widest pt-4">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={onSignUpClick}
            className="text-lime-500 font-black hover:underline underline-offset-4"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;