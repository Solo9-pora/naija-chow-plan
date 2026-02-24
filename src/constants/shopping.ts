import { ShoppingCategory } from '../types';

export const SHOPPING_DATA: ShoppingCategory[] = [
  {
    id: '1',
    name: 'Peppers & Tomatoes',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/peppers---tomatoes-e475a41e-1771928443712.webp',
    items: [
      { id: '1-1', name: 'Fresh Tomatoes', unit: 'basket', budgetPrice: 25000, actualPrice: 0, checked: false },
      { id: '1-2', name: 'Atarodo (Scotch Bonnet)', unit: 'paint rubber', budgetPrice: 4500, actualPrice: 0, checked: false },
      { id: '1-3', name: 'Tatashe', unit: 'paint rubber', budgetPrice: 3500, actualPrice: 0, checked: false },
      { id: '1-4', name: 'Onions (Red)', unit: 'bag', budgetPrice: 18000, actualPrice: 0, checked: false },
      { id: '1-5', name: 'Ginger & Garlic', unit: 'kg', budgetPrice: 2500, actualPrice: 0, checked: false },
    ],
  },
  {
    id: '2',
    name: 'Proteins (Meat & Fish)',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/proteins-6dc66dda-1771928443080.webp',
    items: [
      { id: '2-1', name: 'Beef (Soft)', unit: 'kg', budgetPrice: 5800, actualPrice: 0, checked: false },
      { id: '2-2', name: 'Goat Meat', unit: 'kg', budgetPrice: 8500, actualPrice: 0, checked: false },
      { id: '2-3', name: 'Hard Chicken', unit: 'full', budgetPrice: 7500, actualPrice: 0, checked: false },
      { id: '2-4', name: 'Eggs', unit: 'crate', budgetPrice: 4500, actualPrice: 0, checked: false },
      { id: '2-5', name: 'Titus Fish (Frozen)', unit: 'kg', budgetPrice: 4200, actualPrice: 0, checked: false },
      { id: '2-6', name: 'Catfish (Live)', unit: 'kg', budgetPrice: 4800, actualPrice: 0, checked: false },
      { id: '2-7', name: 'Stock Fish (Medium)', unit: 'pack', budgetPrice: 15000, actualPrice: 0, checked: false },
      { id: '2-8', name: 'Cow Foot (Cut)', unit: 'kg', budgetPrice: 6000, actualPrice: 0, checked: false },
    ],
  },
  {
    id: '3',
    name: 'Tubers & Roots',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4f400298-c6ef-4a87-916a-b152d7c260af/staples-a91573e9-1771928448984.webp',
    items: [
      { id: '3-1', name: 'Yam (Large)', unit: 'tuber', budgetPrice: 4500, actualPrice: 0, checked: false },
      { id: '3-2', name: 'Plantain (Ripe Bunch)', unit: 'bunch', budgetPrice: 3500, actualPrice: 0, checked: false },
      { id: '3-3', name: 'Sweet Potato', unit: 'paint rubber', budgetPrice: 2500, actualPrice: 0, checked: false },
      { id: '3-4', name: 'Garri (Ijebu White)', unit: 'paint rubber', budgetPrice: 2200, actualPrice: 0, checked: false },
      { id: '3-5', name: 'Cocoyam (Red)', unit: 'kg', budgetPrice: 3000, actualPrice: 0, checked: false },
    ],
  },
  {
    id: '4',
    name: 'Grains & Flour',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    items: [
      { id: '4-1', name: 'Foreign Rice', unit: '50kg', budgetPrice: 85000, actualPrice: 0, checked: false },
      { id: '4-2', name: 'Local Ofada Rice', unit: 'derica', budgetPrice: 1500, actualPrice: 0, checked: false },
      { id: '4-3', name: 'Honey Beans (Oloyin)', unit: 'paint rubber', budgetPrice: 6500, actualPrice: 0, checked: false },
      { id: '4-4', name: 'Semovita (Premium)', unit: '5kg', budgetPrice: 7800, actualPrice: 0, checked: false },
      { id: '4-5', name: 'Amala (Yam Flour)', unit: 'paint rubber', budgetPrice: 5000, actualPrice: 0, checked: false },
      { id: '4-6', name: 'Golden Penny Wheat', unit: 'kg', budgetPrice: 1800, actualPrice: 0, checked: false },
    ],
  },
  {
    id: '5',
    name: 'Vegetables & Greens',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
    items: [
      { id: '5-1', name: 'Ugwu (Pumpkin Leaves)', unit: 'large bundle', budgetPrice: 1500, actualPrice: 0, checked: false },
      { id: '5-2', name: 'Fresh Okra', unit: 'basket', budgetPrice: 2500, actualPrice: 0, checked: false },
      { id: '5-3', name: 'Bitter Leaves (Washed)', unit: 'pack', budgetPrice: 1000, actualPrice: 0, checked: false },
      { id: '5-4', name: 'Ewedu Leaves', unit: 'bundle', budgetPrice: 800, actualPrice: 0, checked: false },
      { id: '5-5', name: 'Uziza & Utazi', unit: 'small wrap', budgetPrice: 500, actualPrice: 0, checked: false },
    ],
  },
  {
    id: '6',
    name: 'Oils & Condiments',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
    items: [
      { id: '6-1', name: 'Vegetable Oil (King)', unit: '5L', budgetPrice: 14500, actualPrice: 0, checked: false },
      { id: '6-2', name: 'Palm Oil (Pure)', unit: '5L', budgetPrice: 11000, actualPrice: 0, checked: false },
      { id: '6-3', name: 'Maggi/Knorr Cubes', unit: 'pack', budgetPrice: 1500, actualPrice: 0, checked: false },
      { id: '6-4', name: 'Big Crayfish', unit: 'paint rubber', budgetPrice: 6500, actualPrice: 0, checked: false },
      { id: '6-5', name: 'Kitchen Salt', unit: 'kg', budgetPrice: 800, actualPrice: 0, checked: false },
      { id: '6-6', name: 'Curry & Thyme', unit: 'sachet', budgetPrice: 400, actualPrice: 0, checked: false },
    ],
  },
  {
    id: '7',
    name: 'Other Staples',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-1d5ee2c45163?w=400&h=400&fit=crop',
    items: [
      { id: '7-1', name: 'Indomie (70g)', unit: 'carton', budgetPrice: 8500, actualPrice: 0, checked: false },
      { id: '7-2', name: 'Spaghetti (Golden Penny)', unit: 'pack', budgetPrice: 950, actualPrice: 0, checked: false },
      { id: '7-3', name: 'Custard (Tin)', unit: '500g', budgetPrice: 3500, actualPrice: 0, checked: false },
      { id: '7-4', name: 'Cornflakes (Large)', unit: 'box', budgetPrice: 5500, actualPrice: 0, checked: false },
      { id: '7-5', name: 'Sugar (St. Louis)', unit: 'pack', budgetPrice: 1500, actualPrice: 0, checked: false },
      { id: '7-6', name: 'Peak Milk (Refill)', unit: 'pack', budgetPrice: 6000, actualPrice: 0, checked: false },
    ],
  },
];