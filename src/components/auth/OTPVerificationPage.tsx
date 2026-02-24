import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '../ui';
import { ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface OTPVerificationPageProps {
  email: string;
  onVerify: () => void;
  onBack: () => void;
}

const OTPVerificationPage: React.FC<OTPVerificationPageProps> = ({ email, onVerify, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Incomplete Code', { description: 'Please enter all 6 digits.' });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup',
      });

      if (error) {
        toast.error('Verification Failed', { description: error.message });
      } else {
        toast.success('Verified successfully!');
        onVerify();
      }
    } catch (err: any) {
      toast.error('Error', { description: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) {
        toast.error('Failed to resend code', { description: error.message });
      } else {
        toast.success('New code sent!');
      }
    } catch (err) {
      toast.error('Error resending code');
    }
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
          <div className="w-16 h-16 bg-lime-500/20 rounded-3xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-lime-500" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Check <span className="text-lime-500">Mail</span>
          </h1>
          <p className="text-zinc-500 font-medium">
            We sent a code to <span className="text-white font-bold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          <div className="flex justify-center gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="number"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-black text-lime-500 focus:border-lime-500 focus:outline-none transition-colors"
              />
            ))}
          </div>

          <div className="text-center">
            <button 
              type="button"
              className="text-xs font-black uppercase tracking-widest text-lime-500/50 hover:text-lime-500"
              onClick={handleResend}
            >
              Resend Code
            </button>
          </div>

          <Button 
            disabled={isLoading}
            type="submit" 
            className="w-full group h-14 rounded-3xl text-lg uppercase italic font-black bg-lime-500 text-black hover:bg-lime-400"
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationPage;