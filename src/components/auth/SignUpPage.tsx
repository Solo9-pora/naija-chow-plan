import React from 'react';
import { Button, Input } from '../ui';
import { Mail, Lock, ArrowRight, Github, Chrome, ChevronLeft } from 'lucide-react';

interface SignUpPageProps {
  onSuccess: () => void;
  onLoginClick: () => void;
  onBack: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSuccess, onLoginClick, onBack }) => {
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
          <div className="w-16 h-16 bg-lime-500 rounded-3xl flex items-center justify-center transform rotate-12">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/app-logo-9198864d-1771957220006.webp" 
              alt="Oya Chop" 
              className="w-12 h-12 object-contain -rotate-12"
            />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Join the <span className="text-lime-500">Chop</span> Clan
          </h1>
          <p className="text-zinc-500 font-medium">Create your account to start planning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type="email" 
                placeholder="solomon@oyachop.com" 
                className="pl-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="pl-12"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 group h-14 rounded-3xl text-lg uppercase italic font-black">
            Create Account
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-zinc-500 font-bold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="rounded-2xl border-zinc-800 h-12">
            <Chrome className="w-4 h-4 mr-2" />
            Google
          </Button>
          <Button variant="outline" className="rounded-2xl border-zinc-800 h-12">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>

        <p className="text-center text-zinc-500 text-sm font-medium pt-4">
          Already have an account?{' '}
          <button 
            onClick={onLoginClick}
            className="text-lime-500 font-bold hover:underline underline-offset-4"
          >
            Log In
          </button>
        </p>
      </div>

      <div className="mt-auto text-center text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em] pt-10">
        No Stress Planning • Oya Chop © 2025
      </div>
    </div>
  );
};

export default SignUpPage;