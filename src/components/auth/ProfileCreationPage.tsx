import React from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '../ui';
import { User, MapPin, ArrowRight, Camera, ChevronLeft } from 'lucide-react';

interface ProfileCreationPageProps {
  onComplete: () => void;
  onBack: () => void;
}

const ProfileCreationPage: React.FC<ProfileCreationPageProps> = ({ onComplete, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-10 bg-black text-white relative">
      <button 
        onClick={onBack}
        className="absolute left-6 top-10 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 space-y-8 max-w-sm mx-auto w-full pt-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            About <span className="text-lime-500">You</span>
          </h1>
          <p className="text-zinc-500 font-medium">Let's personalize your experience</p>
        </div>

        {/* Profile Pic Placeholder */}
        <div className="flex justify-center py-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-zinc-900 border-2 border-lime-500/50 flex items-center justify-center overflow-hidden">
              <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/user-avatar-placeholder-1de934dc-1771957306761.webp" 
                alt="Profile Placeholder" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center text-black shadow-lg border-4 border-black">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input type="text" placeholder="Solomon Adebayo" className="pl-12" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-lime-500 px-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input type="text" placeholder="Lagos, Nigeria" className="pl-12" required />
            </div>
            <p className="text-[10px] text-zinc-500 italic px-1 font-medium">Used to suggest local market prices</p>
          </div>

          <Button type="submit" className="w-full mt-6 group h-14 rounded-3xl text-lg uppercase italic font-black">
            Complete Profile
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>
      </div>

      <div className="mt-auto text-center">
        <button onClick={onComplete} className="text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors py-4">
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default ProfileCreationPage;