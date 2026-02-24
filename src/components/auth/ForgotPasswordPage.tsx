import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '../ui';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen px-6 items-center justify-center bg-black text-white text-center">
        <div className="w-20 h-20 bg-lime-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-lime-500" />
        </div>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Check your mail!</h2>
        <p className="text-zinc-500 text-sm max-w-[250px] mb-8">
          We've sent a recovery link to your email if it exists in our system.
        </p>
        <Button onClick={onBack} variant="outline" className="w-full max-w-[200px] border-zinc-800">
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-10 bg-black text-white">
      <div className="max-w-sm mx-auto w-full">
        <button onClick={onBack} className="mb-8 p-2 -ml-2 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Reset <span className="text-lime-500">Chop</span> Access
          </h1>
          <p className="text-zinc-500 font-medium">Enter your email to recover your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input type="email" placeholder="solomon@oyachop.com" className="pl-12" required />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Send Recovery Link
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;