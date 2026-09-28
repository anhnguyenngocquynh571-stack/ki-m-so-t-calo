import React, { useState, useMemo } from 'react';
import { Search, Plus, BookOpen, Utensils, Sparkles, Flame, Check } from 'lucide-react';
import { FoodItem, MealType } from '../types/nutrition';
import { FOOD_CATEGORIES, DEFAULT_VIETNAMESE_FOODS } from '../data/vietnameseFoodData';

interface FoodLibraryViewProps {
  customFoods: FoodItem[];
  onQuickAdd: (food: FoodItem, mealType: MealType) => void;
  onOpenCreateCustom: () => void;
}

function removeTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export const FoodLibraryView: React.FC<FoodLibraryViewProps> = ({
  customFoods,
  onQuickAdd,
  onOpenCreateCustom,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [nutritionalFilter, setNutritionalFilter] = useState<'all' | 'low_cal' | 'high_protein' | 'low_fat'>('all');
  const [selectedMealForAdd, setSelectedMealForAdd] = useState<MealType>('lunch');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const allFoods = useMemo(() => {
    return [...customFoods, ...DEFAULT_VIETNAMESE_FOODS];
  }, [customFoods]);

  const filteredFoods = useMemo(() => {
    const rawSearch = removeTones(search.trim());

    return allFoods.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Nutritional filter
      if (nutritionalFilter === 'low_cal' && item.calories > 200) return false;
      if (nutritionalFilter === 'high_protein' && item.protein < 20) return false;
      if (nutritionalFilter === 'low_fat' && item.fat > 5) return false;

      // Text search
      if (!rawSearch) return true;
      return removeTones(item.name).includes(rawSearch);
    });
  }, [allFoods, search, selectedCategory, nutritionalFilter]);

  const handleAddClick = (food: FoodItem) => {
    onQuickAdd(food, selectedMealForAdd);
    setJustAddedId(food.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner in Soft Rose Gradient */}
      <div className="bg-linear-to-r from-rose-500 via-pink-500 to-rose-400 rounded-3xl p-6 sm:p-7 text-white shadow-xs shadow-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner shrink-0">
            🥗
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Thư Viện Món Ăn Dinh Dưỡng
              </h2>
              <span className="text-[11px] font-bold bg-white text-rose-600 px-2 py-0.5 rounded-full shadow-2xs">
                {allFoods.length} món ngon
              </span>
            </div>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
              Kho dữ liệu món ăn Việt Nam hấp dẫn kèm biểu tượng trực quan, chuẩn hàm lượng calo, chất đạm, tinh bột và chất béo.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateCustom}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-bold rounded-2xl shadow-xs transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tự tạo món mới</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-2xs shadow-rose-100/30 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm phở bò, bún chả, cơm tấm, ức gà, bánh mì, chuối..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-rose-200/80 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-rose-50/20"
            />
          </div>

          {/* Quick Target Meal Selector */}
          <div className="w-full sm:w-auto flex items-center gap-2 bg-rose-50/70 p-1.5 rounded-2xl border border-rose-100">
            <span className="text-xs font-bold text-rose-700 whitespace-nowrap pl-2">
              Bữa ăn cần thêm:
            </span>
            <select
              value={selectedMealForAdd}
              onChange={(e) => setSelectedMealForAdd(e.target.value as MealType)}
              className="text-xs font-bold bg-white border border-rose-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-hidden"
            >
              <option value="breakfast">☀️ Bữa Sáng</option>
              <option value="lunch">🍱 Bữa Trưa</option>
              <option value="dinner">🌙 Bữa Tối</option>
              <option value="snack">🍓 Bữa Phụ</option>
            </select>
          </div>
        </div>

        {/* Categories Bar with Icons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-rose-500 text-white shadow-xs shadow-rose-200 scale-102'
                  : 'bg-rose-50/60 text-slate-600 hover:bg-rose-100/70 hover:text-rose-600'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Nutritional Sub-filters */}
        <div className="flex items-center gap-2 pt-3 border-t border-rose-100/70 text-xs text-slate-500 overflow-x-auto">
          <span className="font-bold text-rose-600 shrink-0">Lọc dinh dưỡng:</span>
          <button
            onClick={() => setNutritionalFilter('all')}
            className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
              nutritionalFilter === 'all'
                ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                : 'hover:bg-rose-50 text-slate-600'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setNutritionalFilter('low_cal')}
            className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
              nutritionalFilter === 'low_cal'
                ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                : 'hover:bg-rose-50 text-slate-600'
            }`}
          >
            🌱 Dưới 200 kcal
          </button>
          <button
            onClick={() => setNutritionalFilter('high_protein')}
            className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
              nutritionalFilter === 'high_protein'
                ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                : 'hover:bg-rose-50 text-slate-600'
            }`}
          >
            💪 Giàu đạm (&gt;20g)
          </button>
          <button
            onClick={() => setNutritionalFilter('low_fat')}
            className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
              nutritionalFilter === 'low_fat'
                ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                : 'hover:bg-rose-50 text-slate-600'
            }`}
          >
            🥑 Ít béo (&lt;5g)
          </button>
        </div>
      </div>

      {/* Foods Grid with Eye-Catching Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFoods.map((food) => {
          const isJustAdded = justAddedId === food.id;

          return (
            <div
              key={food.id}
              className="bg-white rounded-3xl border border-rose-100 p-5 shadow-2xs shadow-rose-100/30 hover:border-rose-300 hover:shadow-md hover:shadow-rose-100/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header with Large Delicious Emoji Icon */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-rose-50 to-pink-50 border border-rose-100/80 flex items-center justify-center text-3xl shadow-2xs shrink-0 group-hover:scale-108 transition-transform">
                    {food.emoji || '🍽️'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-rose-600 transition-colors">
                        {food.name}
                      </h3>
                      {food.isCustom && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Tự tạo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {food.servingUnit}
                    </p>
                  </div>
                </div>

                {/* Big Calorie Callout in Rose Accent */}
                <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100 mb-3.5 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-rose-800">Năng lượng:</span>
                  <div className="text-xl font-black text-rose-600 tabular-nums">
                    {food.calories} <span className="text-xs font-semibold text-rose-400">kcal</span>
                  </div>
                </div>

                {/* Macro Pills with Icons */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div className="bg-rose-50/40 p-2 rounded-xl border border-rose-100/70">
                    <span className="text-[10px] text-slate-400 block font-semibold">🥩 Đạm</span>
                    <span className="font-extrabold text-slate-800 tabular-nums">{food.protein}g</span>
                  </div>
                  <div className="bg-pink-50/40 p-2 rounded-xl border border-pink-100/70">
                    <span className="text-[10px] text-slate-400 block font-semibold">🌾 Carb</span>
                    <span className="font-extrabold text-slate-800 tabular-nums">{food.carbs}g</span>
                  </div>
                  <div className="bg-purple-50/40 p-2 rounded-xl border border-purple-100/70">
                    <span className="text-[10px] text-slate-400 block font-semibold">🥑 Béo</span>
                    <span className="font-extrabold text-slate-800 tabular-nums">{food.fat}g</span>
                  </div>
                </div>
              </div>

              {/* Quick 1-click Add Button */}
              <button
                onClick={() => handleAddClick(food)}
                className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                  isJustAdded
                    ? 'bg-rose-600 text-white scale-98'
                    : 'bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200/80 active:scale-98'
                }`}
              >
                {isJustAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã thêm vào nhật ký!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>+ Thêm 1 khẩu phần ({food.calories} kcal)</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {filteredFoods.length === 0 && (
        <div className="bg-white rounded-3xl border border-rose-100 p-12 text-center text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-base font-bold text-slate-800">Không tìm thấy món ăn phù hợp</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Bạn có thể thử tìm từ khóa khác hoặc bấm nút "+ Tự tạo món mới" ở trên để bổ sung thực phẩm riêng.
          </p>
        </div>
      )}
    </div>
  );
};
