import React, { useState } from 'react';
import { Button, Input } from '../ui';
import { Mail, Lock, ArrowRight, Github, Chrome, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface SignUpPageProps {
  onSuccess: (email: string, needsVerification: boolean) => void;
  onLoginClick: () => void;
  onBack: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSuccess, onLoginClick, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\\.,;:\s@"]+(\.[^<>()[\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Invalid Email', { description: 'Please enter a valid email address.' });
      return;
    }

    if (password.length < 6) {
      toast.error('Weak Password', { description: 'Password must be at least 6 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords Mismatch', { description: 'Please make sure your passwords match.' });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        toast.error('Sign Up Failed', { description: error.message });
      } else if (data.user) {
        if (data.session) {
          onSuccess(email, false);
        } else {
          toast.success('Check your email', { description: 'We sent a 6-digit verification code to your email.' });
          onSuccess(email, true);
        }
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
          <div className="w-16 h-16 bg-lime-500 rounded-3xl flex items-center justify-center transform rotate-12 shadow-[0_10px_30px_rgba(132,204,22,0.3)]">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/app-logo-9198864d-1771957220006.webp" 
              alt="Oya Chop" 
              className="w-12 h-12 object-contain -rotate-12"
            />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
            Join the <span className="text-lime-500 text-4xl">Chop</span> Clan
          </h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">Create your account to start planning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Email Address</label>
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
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Password</label>
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

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="pl-12 pr-12 bg-white/5 border-white/10 h-14 rounded-2xl focus:border-lime-500/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-500 transition-colors focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button 
            disabled={isLoading}
            type="submit" 
            className="w-full mt-6 group h-14 rounded-[2rem] text-lg uppercase italic font-black bg-lime-500 text-black hover:bg-lime-400 shadow-[0_15px_30px_rgba(132,204,22,0.2)]"
          >
            {isLoading ? 'Processing...' : 'Create Account'}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>

        <div className="relative pt-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
            <span className="bg-black px-4 text-zinc-600">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="rounded-2xl border-zinc-800 h-14 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5">
            <Chrome className="w-4 h-4 mr-2" />
            Google
          </Button>
          <Button variant="outline" className="rounded-2xl border-zinc-800 h-14 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>

        <p className="text-center text-zinc-500 text-xs font-bold uppercase tracking-widest pt-4">
          Already have an account?{' '}
          <button 
            type="button"
            onClick={onLoginClick}
            className="text-lime-500 font-black hover:underline underline-offset-4"
          >
            Log In
          </button>
        </p>
      </div>

      <div className="mt-auto text-center text-[10px] text-zinc-700 font-black uppercase tracking-[0.2em] pt-10">
        No Stress Planning • Oya Chop © 2025
      </div>
    </div>
  );
};

export default SignUpPage;