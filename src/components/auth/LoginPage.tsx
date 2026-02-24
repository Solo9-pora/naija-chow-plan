import React from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '../ui';
import { Mail, Lock, ArrowRight, ChevronLeft } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onSignUpClick: () => void;
  onForgotClick: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onSignUpClick, onForgotClick, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-10 bg-black text-white relative">
      <button 
        onClick={onBack}
        className="absolute left-6 top-10 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 space-y-8 max-w-sm mx-auto w-full pt-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-lime-500 rounded-3xl flex items-center justify-center transform -rotate-6">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/app-logo-9198864d-1771957220006.webp" 
              alt="Oya Chop" 
              className="w-12 h-12 object-contain rotate-6"
            />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Welcome <span className="text-lime-500">Back</span>
          </h1>
          <p className="text-zinc-500 font-medium">Sign in to your kitchen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input type="email" placeholder="solomon@oyachop.com" className="pl-12" required />
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
              <Input type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" className="pl-12" required />
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 group h-14 rounded-3xl text-lg uppercase italic font-black">
            Login Now
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm font-medium pt-4">
          Don't have an account?{' '}
          <button 
            onClick={onSignUpClick}
            className="text-lime-500 font-bold hover:underline underline-offset-4"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;