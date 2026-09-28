import React, { useState } from 'react';
import { Sun, Sunset, Moon, Coffee, Plus, Trash2, Edit2, Check, X, Sparkles } from 'lucide-react';
import { DailyLog, LoggedMealItem, MealType } from '../types/nutrition';

interface MealSectionProps {
  log: DailyLog;
  calorieTarget: number;
  onOpenAddFoodModal: (mealType: MealType) => void;
  onUpdateItemAmount: (mealType: MealType, itemId: string, newAmount: number) => void;
  onDeleteItem: (mealType: MealType, itemId: string) => void;
}

interface MealConfig {
  type: MealType;
  title: string;
  recommendedPercent: number;
  icon: string;
  hint: string;
}

const MEAL_CONFIGS: MealConfig[] = [
  {
    type: 'breakfast',
    title: 'Bữa Sáng',
    recommendedPercent: 25,
    icon: '🥞',
    hint: 'Khởi động ngày mới giàu protein & carb tốt',
  },
  {
    type: 'lunch',
    title: 'Bữa Trưa',
    recommendedPercent: 35,
    icon: '🍱',
    hint: 'Bữa chính cung cấp năng lượng dồi dào',
  },
  {
    type: 'dinner',
    title: 'Bữa Tối',
    recommendedPercent: 30,
    icon: '🥗',
    hint: 'Ưu tiên đạm nạc, nhiều rau xanh, hạn chế tinh bột trễ',
  },
  {
    type: 'snack',
    title: 'Bữa Phụ & Ăn Vặt',
    recommendedPercent: 10,
    icon: '🍓',
    hint: 'Sữa chua, hạt hoặc hoa quả tươi bổ dưỡng',
  },
];

export const MealSection: React.FC<MealSectionProps> = ({
  log,
  calorieTarget,
  onOpenAddFoodModal,
  onUpdateItemAmount,
  onDeleteItem,
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number>(1);

  const startEdit = (item: LoggedMealItem) => {
    setEditingItemId(item.id);
    setEditAmount(item.servingAmount);
  };

  const saveEdit = (mealType: MealType, itemId: string) => {
    if (editAmount > 0) {
      onUpdateItemAmount(mealType, itemId, editAmount);
    }
    setEditingItemId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Thực đơn 4 bữa trong ngày</span>
            <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/50">
              Chi tiết món ăn
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi chính xác lượng calo và 3 chất dinh dưỡng đa lượng từng món ăn
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {MEAL_CONFIGS.map((meal) => {
          const items: LoggedMealItem[] = log.meals[meal.type] || [];
          const mealCalories = items.reduce((sum, item) => sum + item.calories, 0);
          const mealProtein = items.reduce((sum, item) => sum + item.protein, 0);
          const mealCarbs = items.reduce((sum, item) => sum + item.carbs, 0);
          const mealFat = items.reduce((sum, item) => sum + item.fat, 0);
          const targetKcal = Math.round(calorieTarget * (meal.recommendedPercent / 100));

          return (
            <div
              key={meal.type}
              className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-2xs shadow-rose-100/30 hover:border-rose-200 transition-all"
            >
              {/* Meal Card Header */}
              <div className="p-4 sm:p-5 border-b border-rose-100/70 bg-linear-to-r from-rose-50/40 via-white to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/70 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                    {meal.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{meal.title}</h3>
                      <span className="text-xs text-rose-500 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                        Mục tiêu ~{targetKcal} kcal
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 hidden sm:block mt-0.5">{meal.hint}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {/* Calorie & Macro Summary */}
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-black text-rose-600 tabular-nums">
                      {mealCalories} <span className="text-xs font-semibold text-slate-400">kcal</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <span>P: {Math.round(mealProtein)}g</span>
                      <span>·</span>
                      <span>C: {Math.round(mealCarbs)}g</span>
                      <span>·</span>
                      <span>F: {Math.round(mealFat)}g</span>
                    </div>
                  </div>

                  {/* Add Food Button */}
                  <button
                    onClick={() => onOpenAddFoodModal(meal.type)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200/70 text-xs font-bold rounded-xl transition-all shadow-2xs whitespace-nowrap active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm món</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="py-6 px-4 text-center bg-white">
                  <p className="text-xs text-slate-400">
                    Chưa có món nào trong {meal.title.toLowerCase()}.
                  </p>
                  <button
                    onClick={() => onOpenAddFoodModal(meal.type)}
                    className="mt-2 text-xs font-bold text-rose-500 hover:text-rose-600 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Chọn món ăn từ thư viện</span>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-rose-50 bg-white">
                  {items.map((item) => {
                    const isEditing = editingItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 sm:px-5 sm:py-3.5 flex items-center justify-between hover:bg-rose-50/25 transition-colors gap-3"
                      >
                        {/* Food Info with Appetizing Emoji */}
                        <div className="min-w-0 flex-1 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-center justify-center text-xl shrink-0">
                            {item.emoji || '🍽️'}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-sm font-bold text-slate-800 truncate">
                                {item.name}
                              </span>
                              <span className="text-xs text-slate-400">
                                {item.servingAmount !== 1 && `(${item.servingAmount}x) `}
                                {item.servingUnit}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                              <span className="font-extrabold text-rose-600 tabular-nums">
                                {item.calories} kcal
                              </span>
                              <span>Đạm: {item.protein}g</span>
                              <span>Carb: {item.carbs}g</span>
                              <span>Béo: {item.fat}g</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions & Stepper */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5 bg-white border border-rose-300 rounded-xl p-1 shadow-2xs">
                              <button
                                onClick={() => setEditAmount(Math.max(0.25, editAmount - 0.25))}
                                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-rose-50 rounded-lg"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                step="0.25"
                                min="0.25"
                                max="10"
                                value={editAmount}
                                onChange={(e) => setEditAmount(parseFloat(e.target.value) || 1)}
                                className="w-12 text-center text-xs font-bold text-slate-800 focus:outline-hidden"
                              />
                              <button
                                onClick={() => setEditAmount(editAmount + 0.25)}
                                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-rose-50 rounded-lg"
                              >
                                +
                              </button>
                              <button
                                onClick={() => saveEdit(meal.type, item.id)}
                                className="w-6 h-6 flex items-center justify-center bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-2xs"
                                title="Lưu số lượng"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingItemId(null)}
                                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
                                title="Hủy"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(item)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                title="Sửa khẩu phần"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteItem(meal.type, item.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                title="Xóa món này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
