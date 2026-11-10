import React from 'react';
import {
  Utensils,
  Beef,
  Pizza,
  Soup,
  Salad,
  Flame,
  CakeSlice,
  Coffee,
  SlidersHorizontal,
  Leaf
} from 'lucide-react';

const iconMap = {
  Utensils: Utensils,
  Beef: Beef,
  Pizza: Pizza,
  Soup: Soup,
  Salad: Salad,
  Flame: Flame,
  CakeSlice: CakeSlice,
  Coffee: Coffee,
};

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isVegOnly,
  setIsVegOnly,
  sortBy,
  setSortBy,
  itemCount,
}) => {
  return (
    <div className="py-6 border-b border-stone-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Top bar: Category Pills scrollable row */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Utensils;
            const isSelected = selectedCategory === cat.name || (cat.id === 'all' && selectedCategory === 'all');

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id === 'all' ? 'all' : cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-md shadow-stone-900/20'
                    : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 border border-stone-200/50'
                }`}
              >
                <IconComponent
                  className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-stone-500'}`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom bar: Filters, Veg switch, and Sort dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-500">
              Showing <span className="font-bold text-stone-900">{itemCount}</span> delicious options
            </span>

            {/* Vegetarian Toggle Button */}
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isVegOnly
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Leaf className={`w-3.5 h-3.5 ${isVegOnly ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span>Veg Only</span>
              {isVegOnly && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs font-medium text-stone-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-100 hover:bg-stone-200/80 text-xs font-semibold text-stone-800 rounded-xl px-3 py-1.5 border border-stone-200/70 outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated (⭐ 4.8+)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
