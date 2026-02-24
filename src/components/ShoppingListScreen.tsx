import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Copy, Send, CheckSquare, Square, ReceiptText, Sparkles } from 'lucide-react';
import { SHOPPING_DATA } from '../constants/shopping';
import { ShoppingCategory, DayPlan, StockItem } from '../types';
import { toast } from 'sonner';

interface ShoppingListScreenProps {
  onBack: () => void;
  plan: DayPlan[];
  stock: StockItem[];
}

const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({ onBack, plan, stock }) => {
  const [categories, setCategories] = useState<ShoppingCategory[]>(SHOPPING_DATA);

  const recommendedItems = useMemo(() => {
    const requiredIngredients = new Set<string>();
    plan.forEach(day => {
      Object.values(day.meals).flat().forEach(meal => {
        meal?.ingredients?.forEach(ing => requiredIngredients.add(ing.toLowerCase()));
      });
    });

    const stockNames = new Set(stock.filter(s => s.quantity > 0).map(s => s.name.toLowerCase()));
    const missing = new Set<string>();
    
    requiredIngredients.forEach(ing => {
      if (!stockNames.has(ing)) {
        missing.add(ing);
      }
    });

    return missing;
  }, [plan, stock]);

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      };
    }));
  };

  const updatePrice = (categoryId: string, itemId: string, field: 'budgetPrice' | 'actualPrice', value: string) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => 
          item.id === itemId ? { ...item, [field]: numericValue } : item
        )
      };
    }));
  };

  const totalCost = useMemo(() => {
    return categories.reduce((total, cat) => {
      return total + cat.items.reduce((sum, item) => {
        if (!item.checked) return sum;
        const priceToUse = item.actualPrice > 0 ? item.actualPrice : item.budgetPrice;
        return sum + priceToUse;
      }, 0);
    }, 0);
  }, [categories]);

  const handleCopy = async () => {
    const text = `ChopTime Shopping List Summary: Total ₦${totalCost.toLocaleString()}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success('List summary copied to clipboard');
        return;
      }
      throw new Error('Clipboard API unavailable');
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) toast.success('List summary copied');
      else toast.error('Unable to copy total');
    }
  };

  const handleShareWhatsApp = () => {
    const checkedItems = categories.flatMap(c => c.items.filter(i => i.checked));
    if (checkedItems.length === 0) {
      toast.error('No items selected to share');
      return;
    }
    let message = `*ChopTime Market List*

`;
    categories.forEach(cat => {
      const items = cat.items.filter(i => i.checked);
      if (items.length > 0) {
        message += `*${cat.name.toUpperCase()}*
`;
        items.forEach(item => {
          const p = item.actualPrice > 0 ? item.actualPrice : item.budgetPrice;
          message += `- ${item.name} (${item.unit}): ₦${p.toLocaleString()}
`;
        });
        message += `
`;
      }
    });
    message += `*Total Estimate: ₦${totalCost.toLocaleString()}*`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handlePricepally = () => {
    toast.success('Sending selected items to Pricepally...');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32 font-sans selection:bg-lime-500/30 px-4">
      <header className="sticky top-0 z-50 flex items-center justify-between py-4 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 mx-[-1rem] px-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black italic uppercase tracking-tighter">Market List</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2.5 rounded-2xl bg-white/5 hover:bg-lime-500 hover:text-black transition-all">
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="py-6 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ReceiptText className="w-24 h-24" />
          </div>
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-lime-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Calculated Total</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black italic tracking-tighter">₦{totalCost.toLocaleString()}</span>
              <span className="text-zinc-600 font-bold uppercase text-[10px]">Checked Items</span>
            </div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Total based on items you've checked below</p>
          </div>
        </motion.div>

        <div className="space-y-10">
          {categories.map((category, idx) => (
            <motion.section key={category.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10">
                  <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
                </div>
                <h2 className="text-lg font-black italic uppercase tracking-tight">{category.name}</h2>
              </div>
              <div className="grid gap-4">
                {category.items.map((item) => {
                  const isRecommended = recommendedItems.has(item.name.toLowerCase());
                  return (
                    <div key={item.id} className={`group flex flex-col p-4 rounded-2xl border transition-all ${item.checked ? 'bg-zinc-900/40 border-transparent' : 'bg-zinc-900 border-white/5 hover:border-lime-500/30'} ${isRecommended && !item.checked ? 'border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.05)]' : ''}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-left">
                          <button onClick={() => toggleItem(category.id, item.id)} className={`transition-colors ${item.checked ? 'text-lime-500' : 'text-zinc-600'}`}>
                            {item.checked ? <CheckSquare className="w-7 h-7" /> : <Square className="w-7 h-7" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-bold uppercase tracking-tight ${item.checked ? 'text-lime-500' : 'text-zinc-200'}`}>{item.name}</h4>
                              {isRecommended && !item.checked && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[8px] font-black text-amber-500 uppercase tracking-widest">
                                  <Sparkles className="w-2 h-2" />
                                  Needed
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.unit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 block ml-1">Budget Price</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">₦</span>
                            <input type="text" inputMode="numeric" value={item.budgetPrice.toLocaleString()} onChange={(e) => updatePrice(category.id, item.id, 'budgetPrice', e.target.value)} className="w-full bg-black/50 border border-white/5 rounded-xl py-2.5 pl-7 pr-3 text-sm font-bold text-zinc-300 focus:outline-none focus:border-lime-500/50 transition-colors" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 block ml-1">Actual Price</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">₦</span>
                            <input type="text" inputMode="numeric" value={item.actualPrice > 0 ? item.actualPrice.toLocaleString() : ''} placeholder="0" onChange={(e) => updatePrice(category.id, item.id, 'actualPrice', e.target.value)} className={`w-full bg-black/50 border rounded-xl py-2.5 pl-7 pr-3 text-sm font-black transition-colors focus:outline-none ${item.actualPrice > 0 ? 'border-lime-500/50 text-lime-400' : 'border-white/5 text-zinc-500 focus:border-lime-500/50'}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-50">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <button onClick={handleShareWhatsApp} className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-black uppercase italic text-xs hover:bg-[#25D366]/20 transition-all">
            <Share2 className="w-4 h-4" />
            WhatsApp
          </button>
          <button onClick={handlePricepally} className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-lime-500 text-black font-black uppercase italic text-xs hover:bg-lime-400 transition-all">
            <Send className="w-4 h-4" />
            Pricepally
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListScreen;