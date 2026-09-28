import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Check, Utensils, Sparkles, Filter } from 'lucide-react';
import { FoodItem, MealType } from '../types/nutrition';
import { FOOD_CATEGORIES, DEFAULT_VIETNAMESE_FOODS } from '../data/vietnameseFoodData';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMeal: MealType;
  customFoods: FoodItem[];
  onAddFoodToMeal: (mealType: MealType, food: FoodItem, servingAmount: number) => void;
  onSaveCustomFood: (food: FoodItem) => void;
}

function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

const COMMON_EMOJIS = ['🥗', '🍲', '🍜', '🍱', '🍚', '🥩', '🍗', '🍣', '🥚', '🍞', '🥑', '🍎', '🍌', '🍓', '🍉', '☕', '🧋', '🥖', '🥪', '🥟'];

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  targetMeal,
  customFoods,
  onAddFoodToMeal,
  onSaveCustomFood,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMealType, setSelectedMealType] = useState<MealType>(targetMeal);
  
  // Selection drawer state
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingAmount, setServingAmount] = useState<number>(1);

  // Custom food form state
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🥗');
  const [customServingUnit, setCustomServingUnit] = useState('1 phần (150g)');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customCategory, setCustomCategory] = useState<FoodItem['category']>('vietnamese_main');

  const allFoods = useMemo(() => {
    return [...customFoods, ...DEFAULT_VIETNAMESE_FOODS];
  }, [customFoods]);

  React.useEffect(() => {
    setSelectedMealType(targetMeal);
  }, [targetMeal]);

  const filteredFoods = useMemo(() => {
    const rawSearch = removeVietnameseTones(searchQuery.trim());

    return allFoods.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!rawSearch) return true;
      return removeVietnameseTones(item.name).includes(rawSearch);
    });
  }, [allFoods, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setServingAmount(1);
  };

  const handleConfirmAdd = () => {
    if (selectedFood && servingAmount > 0) {
      onAddFoodToMeal(selectedMealType, selectedFood, servingAmount);
      setSelectedFood(null);
      onClose();
    }
  };

  const handleCreateCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    const cals = parseFloat(customCalories);
    if (!customName.trim() || isNaN(cals) || cals < 0) return;

    const newFood: FoodItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      categoryLabel: FOOD_CATEGORIES.find(c => c.id === customCategory)?.label || 'Món tự tạo',
      servingUnit: customServingUnit.trim() || '1 khẩu phần',
      calories: Math.round(cals),
      protein: parseFloat(customProtein) || 0,
      carbs: parseFloat(customCarbs) || 0,
      fat: parseFloat(customFat) || 0,
      isCustom: true,
      emoji: customEmoji || '🥗',
    };

    onSaveCustomFood(newFood);
    onAddFoodToMeal(selectedMealType, newFood, 1);
    
    // Reset form
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    onClose();
  };

  const mealLabels: Record<MealType, { label: string; icon: string }> = {
    breakfast: { label: 'Bữa Sáng', icon: '☀️' },
    lunch: { label: 'Bữa Trưa', icon: '🍱' },
    dinner: { label: 'Bữa Tối', icon: '🌙' },
    snack: { label: 'Bữa Phụ', icon: '🍓' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-rose-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-xl shadow-2xs text-rose-500">
              {mealLabels[selectedMealType].icon}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Thêm món vào {mealLabels[selectedMealType].label}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-slate-400">Chọn bữa:</span>
                <div className="flex gap-1">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMealType(m)}
                      className={`text-xs px-2.5 py-0.5 rounded-lg font-bold transition-all ${
                        selectedMealType === m
                          ? 'bg-rose-500 text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-rose-100 hover:bg-rose-50'
                      }`}
                    >
                      {mealLabels[m].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-rose-100 bg-white px-5 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'search'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            🔍 Tra cứu thực đơn ({allFoods.length} món)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'custom'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            ✨ Tự tạo món ăn mới
          </button>
        </div>

        {/* Search Tab Content */}
        {activeTab === 'search' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Input & Category Pills */}
            <div className="p-4 border-b border-rose-100 space-y-3 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm phở bò, bún bò, cơm tấm, ức gà, bánh mì..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-rose-200/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-rose-50/20"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-rose-400 hover:text-rose-600 font-semibold"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Category Filter bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {FOOD_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : 'bg-rose-50/60 text-slate-600 hover:bg-rose-100/70 hover:text-rose-600'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Foods List with Appetizing Icons */}
            <div className="flex-1 overflow-y-auto divide-y divide-rose-50 p-2 sm:p-4">
              {filteredFoods.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-3xl mb-2">🍽️</div>
                  <p className="text-sm font-bold text-slate-700">
                    Không tìm thấy món "{searchQuery}"
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Bạn có thể tự tạo món này và lưu lại để dùng cho những ngày sau.
                  </p>
                  <button
                    onClick={() => {
                      setCustomName(searchQuery);
                      setActiveTab('custom');
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tự tạo món "{searchQuery}"</span>
                  </button>
                </div>
              ) : (
                filteredFoods.map((food) => {
                  const isCurrentSelected = selectedFood?.id === food.id;

                  return (
                    <div
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isCurrentSelected
                          ? 'bg-rose-50 border border-rose-300 shadow-2xs'
                          : 'hover:bg-rose-50/40 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-xl shrink-0">
                          {food.emoji || '🍽️'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 truncate">
                              {food.name}
                            </span>
                            {food.isCustom && (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-200">
                                Tự tạo
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {food.servingUnit}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="font-extrabold text-rose-600 tabular-nums">
                              {food.calories} kcal
                            </span>
                            <span>Đạm: {food.protein}g</span>
                            <span>Carb: {food.carbs}g</span>
                            <span>Béo: {food.fat}g</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                          isCurrentSelected
                            ? 'bg-rose-500 text-white shadow-2xs'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}>
                          {isCurrentSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Serving Adjuster Drawer */}
            {selectedFood && (
              <div className="p-4 bg-rose-50/60 border-t border-rose-100 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{selectedFood.emoji || '🍽️'}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {selectedFood.name}
                      </h4>
                      <span className="text-xs text-slate-400">
                        Đơn vị chuẩn: {selectedFood.servingUnit}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-white border border-rose-200 rounded-xl p-1 shadow-2xs">
                    <button
                      onClick={() => setServingAmount(Math.max(0.25, parseFloat((servingAmount - 0.25).toFixed(2))))}
                      className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-rose-50 rounded-lg"
                    >
                      -
                    </button>
                    <div className="flex items-center px-2">
                      <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                        {servingAmount}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">phần</span>
                    </div>
                    <button
                      onClick={() => setServingAmount(parseFloat((servingAmount + 0.25).toFixed(2)))}
                      className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-rose-50 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Multiplier Buttons */}
                <div className="flex gap-2">
                  {[0.5, 1, 1.5, 2].map((num) => (
                    <button
                      key={num}
                      onClick={() => setServingAmount(num)}
                      className={`text-xs px-3 py-1 rounded-xl font-bold transition-colors ${
                        servingAmount === num
                          ? 'bg-rose-500 text-white shadow-2xs'
                          : 'bg-white border border-rose-200 text-slate-600 hover:bg-rose-50'
                      }`}
                    >
                      {num}x khẩu phần
                    </button>
                  ))}
                </div>

                {/* Real-time Calculated Total & CTA */}
                <div className="pt-2 border-t border-rose-200/70 flex items-center justify-between">
                  <div className="text-xs text-slate-600 space-x-2">
                    <span className="text-base font-black text-rose-600 tabular-nums">
                      {Math.round(selectedFood.calories * servingAmount)} kcal
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>P: {(selectedFood.protein * servingAmount).toFixed(1)}g</span>
                    <span>C: {(selectedFood.carbs * servingAmount).toFixed(1)}g</span>
                    <span>F: {(selectedFood.fat * servingAmount).toFixed(1)}g</span>
                  </div>

                  <button
                    onClick={handleConfirmAdd}
                    className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xs shadow-rose-200 transition-all active:scale-95"
                  >
                    + Thêm vào {mealLabels[selectedMealType].label}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Food Form */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCreateCustomFood} className="flex-1 overflow-y-auto p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên món ăn hoặc thực phẩm *
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ví dụ: Cá chẽm hấp gừng, Chè dưỡng nhan..."
                className="w-full px-3.5 py-2 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {/* Choose an Emoji Icon */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Chọn biểu tượng món ăn hấp dẫn
              </label>
              <div className="flex items-center gap-1.5 flex-wrap bg-rose-50/50 p-2 rounded-2xl border border-rose-100">
                {COMMON_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setCustomEmoji(em)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all ${
                      customEmoji === em
                        ? 'bg-rose-500 shadow-xs scale-110'
                        : 'bg-white hover:bg-rose-100/70 border border-rose-100'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đơn vị khẩu phần
                </label>
                <input
                  type="text"
                  value={customServingUnit}
                  onChange={(e) => setCustomServingUnit(e.target.value)}
                  placeholder="Ví dụ: 1 đĩa (200g), 1 ly 300ml"
                  className="w-full px-3.5 py-2 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phân loại nhóm món
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as FoodItem['category'])}
                  className="w-full px-3.5 py-2 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
                >
                  <option value="vietnamese_main">🍚 Cơm & Món mặn</option>
                  <option value="vietnamese_noodles">🍜 Bún, Phở, Mì</option>
                  <option value="protein_rich">🥩 Thịt, Cá, Trứng (Giàu đạm)</option>
                  <option value="healthy_staple">🥗 Eat Clean & Tinh bột tốt</option>
                  <option value="fruit_snack">🍓 Trái cây & Ăn nhẹ</option>
                  <option value="beverage">🧋 Đồ uống</option>
                  <option value="street_food">🥖 Ăn vặt & Fastfood</option>
                </select>
              </div>
            </div>

            {/* Calories & Macros Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
              <div>
                <label className="block text-xs font-bold text-rose-700 mb-1">
                  Calo (kcal) *
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  placeholder="350"
                  className="w-full px-2.5 py-1.5 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đạm (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                  placeholder="25"
                  className="w-full px-2.5 py-1.5 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Carb (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(e.target.value)}
                  placeholder="40"
                  className="w-full px-2.5 py-1.5 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chất béo (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customFat}
                  onChange={(e) => setCustomFat(e.target.value)}
                  placeholder="8"
                  className="w-full px-2.5 py-1.5 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-rose-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-rose-50 rounded-xl"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-xs shadow-rose-200 active:scale-95"
              >
                Lưu món & Thêm vào {mealLabels[selectedMealType].label}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
