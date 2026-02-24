import React, { useState } from 'react';
import { Button, Input } from '../ui';
import { Mail, ArrowLeft, CheckCircle2, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

type ForgotPhase = 'email' | 'otp' | 'reset';

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<ForgotPhase>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        toast.error('Error', { description: error.message });
      } else {
        toast.success('Reset code sent!', { description: 'Check your email for the verification code.' });
        setPhase('otp');
      }
    } catch (err) {
      toast.error('Error', { description: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reset-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Incomplete Code', { description: 'Please enter all 6 digits.' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'recovery',
      });

      if (error) {
        toast.error('Verification Failed', { description: error.message });
      } else {
        toast.success('Code verified!');
        setPhase('reset');
      }
    } catch (err) {
      toast.error('Error', { description: 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        toast.error('Failed to resend code', { description: error.message });
      } else {
        toast.success('New code sent!');
      }
    } catch (err) {
      toast.error('Error resending code');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Mismatch', { description: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      toast.error('Too short', { description: 'Password must be at least 6 characters.' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error('Update Failed', { description: error.message });
      } else {
        toast.success('Password updated!', { description: 'You can now log in with your new password.' });
        onBack();
      }
    } catch (err) {
      toast.error('Error', { description: 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (phase === 'otp') {
    return (
      <div className="flex flex-col min-h-screen px-6 pt-12 pb-10 bg-black text-white relative">
        <button 
          onClick={() => setPhase('email')}
          className="absolute left-6 top-10 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 space-y-8 max-w-sm mx-auto w-full pt-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-lime-500/20 rounded-3xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-lime-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Enter <span className="text-lime-500">Code</span></h1>
            <p className="text-zinc-500 font-medium">We sent a 6-digit code to {email}</p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-8 pt-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`reset-otp-${i}`}
                  type="number"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
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

            <Button disabled={isLoading} type="submit" className="w-full h-14 rounded-3xl text-lg uppercase italic font-black bg-lime-500 text-black">
              {isLoading ? 'Verifying...' : 'Verify Code'}
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (phase === 'reset') {
    return (
      <div className="flex flex-col min-h-screen px-6 pt-12 pb-10 bg-black text-white relative">
        <div className="max-w-sm mx-auto w-full pt-10">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              New <span className="text-lime-500">Secret</span> Key
            </h1>
            <p className="text-zinc-500 font-medium">Set your new account password</p>
          </div>

          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-12 pr-12 bg-white/5 border-white/10"
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
              <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-12 pr-12 bg-white/5 border-white/10"
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

            <Button disabled={isLoading} type="submit" className="w-full mt-6 h-14 rounded-3xl text-lg uppercase italic font-black bg-lime-500 text-black">
              {isLoading ? 'Updating...' : 'Update Password'}
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-10 bg-black text-white relative">
      <div className="max-w-sm mx-auto w-full">
        <button onClick={onBack} className="mb-8 p-2 -ml-2 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="space-y-2 mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Reset <span className="text-lime-500">Chop</span> Access
          </h1>
          <p className="text-zinc-500 font-medium">Enter your email to recover your account</p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type="email" 
                placeholder="solomon@oyachop.com" 
                className="pl-12 bg-white/5 border-white/10" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <Button disabled={isLoading} type="submit" className="w-full h-14 rounded-3xl text-lg uppercase italic font-black bg-lime-500 text-black">
            {isLoading ? 'Sending...' : 'Send Recovery Code'}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;