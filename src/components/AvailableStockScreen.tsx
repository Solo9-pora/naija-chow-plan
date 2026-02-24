import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Trash2, Search, Package, Save, ChevronDown, List, Bell, User } from 'lucide-react';
import { StockItem } from '../types';
import { toast } from 'sonner';
import { SHOPPING_DATA } from '../constants/shopping';

interface AvailableStockScreenProps {
  onBack: () => void;
  onViewNotifications?: () => void;
  onViewProfile?: () => void;
  stock: StockItem[];
  onUpdateStock: (stock: StockItem[]) => void;
}

const AvailableStockScreen: React.FC<AvailableStockScreenProps> = ({ onBack, onViewNotifications, onViewProfile, stock, onUpdateStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: 'pcs' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStock = stock.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    const newItemObj: StockItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.name,
      quantity: newItem.quantity,
      unit: newItem.unit,
      lastUpdated: new Date().toISOString(),
    };

    onUpdateStock([...stock, newItemObj]);
    setNewItem({ name: '', quantity: 1, unit: 'pcs' });
    setIsAdding(false);
    toast.success(`${newItem.name} added to stock`);
  };

  const handleRemoveItem = (id: string) => {
    onUpdateStock(stock.filter(item => item.id !== id));
    toast.info('Item removed from stock');
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    onUpdateStock(stock.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty, lastUpdated: new Date().toISOString() };
      }
      return item;
    }));
  };

  const handleSelectItem = (itemName: string) => {
    setSearchTerm(itemName);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32 font-sans selection:bg-lime-500/30 px-4">
      <header className="sticky top-0 z-50 flex items-center justify-between py-4 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 mx-[-1rem] px-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black italic uppercase tracking-tighter">Available Stock</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={onViewNotifications} 
              className="relative p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lime-500 rounded-full border border-black animate-pulse" />
            </button>
            <button 
              onClick={onViewProfile} 
              className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="py-6 space-y-6">
        <div className="flex gap-2 relative">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-lime-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search pantry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-lime-500/50 transition-colors"
            />
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <button 
            onClick={() => setIsAdding(true)}
            className="p-3 bg-lime-500 text-black rounded-2xl hover:bg-lime-400 transition-all shadow-lg shadow-lime-500/10 active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 z-[60] bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl max-h-[400px] overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-white/5 bg-zinc-800/50">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                    <List className="w-3 h-3" />
                    Browse Predefined Items
                  </h4>
                </div>
                <div className="overflow-y-auto custom-scrollbar p-2">
                  {SHOPPING_DATA.map((category) => (
                    <div key={category.id} className="mb-4 last:mb-0">
                      <div className="px-3 py-1 text-[9px] font-black text-lime-500/70 uppercase tracking-widest">
                        {category.name}
                      </div>
                      <div className="grid grid-cols-1 gap-1 mt-1">
                        {category.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item.name)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-left transition-colors group"
                          >
                            <span className="text-xs font-bold text-zinc-300 group-hover:text-white">{item.name}</span>
                            <span className="text-[9px] font-medium text-zinc-600 uppercase">{item.unit}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-3xl bg-zinc-900 border border-white/5">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Total Items</span>
            <span className="text-2xl font-black italic text-lime-500">{stock.length}</span>
          </div>
          <div className="p-4 rounded-3xl bg-zinc-900 border border-white/5">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Out of Stock</span>
            <span className="text-2xl font-black italic text-red-500">{stock.filter(i => i.quantity === 0).length}</span>
          </div>
        </div>

        <div className="space-y-3">
          {filteredStock.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-zinc-900 text-zinc-600">
                <Package className="w-12 h-12" />
              </div>
              <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">
                {searchTerm ? `No matches for "${searchTerm}"` : 'Your pantry is empty'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-lime-500 text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Add "{searchTerm}" to stock?
                </button>
              )}
            </div>
          ) : (
            filteredStock.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group p-4 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h4 className="font-bold uppercase tracking-tight text-zinc-200">{item.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-[8px] font-bold text-zinc-600 uppercase">
                      Updated {new Date(item.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-black/50 rounded-xl border border-white/5">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="p-2 hover:text-lime-500 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="p-2 hover:text-lime-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {isAdding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Add to Stock</h3>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight">What's in your pantry?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Item Name</label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="e.g. Fresh Tomatoes"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Quantity</label>
                  <input 
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black border border-white/10 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:border-lime-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Unit</label>
                  <select 
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:border-lime-500 transition-colors appearance-none"
                  >
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="bag">bag</option>
                    <option value="crate">crate</option>
                    <option value="tuber">tuber</option>
                    <option value="bunch">bunch</option>
                    <option value="paint rubber">paint rubber</option>
                    <option value="basket">basket</option>
                    <option value="derica">derica</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-4 rounded-2xl bg-white/5 font-black uppercase italic text-xs hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddItem}
                className="flex-1 py-4 rounded-2xl bg-lime-500 text-black font-black uppercase italic text-xs hover:bg-lime-400 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AvailableStockScreen;