import React, { useState, useMemo } from 'react';
import { Calculator, X, Check, Target, Info, Flame, Heart, Droplet, Sparkles } from 'lucide-react';
import { UserProfile, ActivityLevel, CalorieGoal } from '../types/nutrition';
import {
  calculateProfileNutrition,
  ACTIVITY_LEVEL_FACTORS,
  CALORIE_GOAL_CONFIG,
} from '../utils/tdeeCalculator';

interface TdeeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const TdeeCalculatorModal: React.FC<TdeeCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [gender, setGender] = useState<'male' | 'female'>(currentProfile.gender);
  const [age, setAge] = useState<number>(currentProfile.age || 26);
  const [height, setHeight] = useState<number>(currentProfile.height || 165);
  const [weight, setWeight] = useState<number>(currentProfile.weight || 60);
  const [targetWeight, setTargetWeight] = useState<number>(currentProfile.targetWeight || 55);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(currentProfile.activityLevel || 'light');
  const [goal, setGoal] = useState<CalorieGoal>(currentProfile.goal || 'lose_slow');

  const calculatedProfile = useMemo(() => {
    return calculateProfileNutrition({
      gender,
      age: Math.max(12, Math.min(100, age)),
      height: Math.max(100, Math.min(250, height)),
      weight: Math.max(30, Math.min(300, weight)),
      targetWeight,
      activityLevel,
      goal,
    });
  }, [gender, age, height, weight, targetWeight, activityLevel, goal]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(calculatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-rose-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-rose-500 border border-rose-200 flex items-center justify-center text-xl shadow-2xs">
              🎯
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tính TDEE & Thiết Lập Mục Tiêu Calo
              </h2>
              <p className="text-xs text-rose-500 font-semibold">
                Công thức y khoa Mifflin-St Jeor chuẩn quốc tế
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Section 1: Basic Body Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <span>🌸 1. Thông số cơ thể</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Gender */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giới tính
                </label>
                <div className="grid grid-cols-2 gap-1 bg-rose-50/70 p-1 rounded-xl border border-rose-100">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-1 text-xs font-bold rounded-lg transition-colors ${
                      gender === 'female' ? 'bg-rose-500 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Nữ
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-1 text-xs font-bold rounded-lg transition-colors ${
                      gender === 'male' ? 'bg-rose-500 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Nam
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tuổi (năm)
                </label>
                <input
                  type="number"
                  min="14"
                  max="95"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                  className="w-full px-3 py-1.5 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chiều cao (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="230"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 160)}
                  className="w-full px-3 py-1.5 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cân nặng (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="30"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 50)}
                  className="w-full px-3 py-1.5 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Activity Level */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <span>🏃‍♀️ 2. Mức độ hoạt động thể chất</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(ACTIVITY_LEVEL_FACTORS) as ActivityLevel[]).map((level) => {
                const item = ACTIVITY_LEVEL_FACTORS[level];
                const isSelected = activityLevel === level;

                return (
                  <div
                    key={level}
                    onClick={() => setActivityLevel(level)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-rose-400 bg-rose-50 shadow-2xs ring-1 ring-rose-400'
                        : 'border-rose-100 hover:border-rose-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      <span className="text-[11px] text-rose-400 font-bold">x{item.factor}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Goal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <span>🎯 3. Mục tiêu vóc dáng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(CALORIE_GOAL_CONFIG) as CalorieGoal[]).map((g) => {
                const item = CALORIE_GOAL_CONFIG[g];
                const isSelected = goal === g;

                return (
                  <div
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-rose-400 bg-rose-50 shadow-2xs ring-1 ring-rose-400'
                        : 'border-rose-100 hover:border-rose-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      <span className={`text-[11px] font-bold ${
                        item.calorieDelta < 0 ? 'text-rose-600' : item.calorieDelta > 0 ? 'text-pink-600' : 'text-slate-500'
                      }`}>
                        {item.calorieDelta > 0 ? `+${item.calorieDelta}` : item.calorieDelta} kcal
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Calculation Result Preview in Pink & White */}
          <div className="bg-linear-to-br from-rose-500 to-pink-500 text-white rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm shadow-rose-200">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div>
                <span className="text-xs text-rose-100 font-semibold">Đề xuất năng lượng mỗi ngày</span>
                <div className="text-3xl font-black text-white tabular-nums">
                  {calculatedProfile.calorieTarget.toLocaleString()} <span className="text-sm font-semibold text-rose-200">kcal/ngày</span>
                </div>
              </div>

              <div className="text-right text-xs text-rose-100 space-y-1">
                <div>BMR cơ bản: <strong className="text-white">{calculatedProfile.bmr} kcal</strong></div>
                <div>TDEE tiêu thụ: <strong className="text-white">{calculatedProfile.tdee} kcal</strong></div>
              </div>
            </div>

            {/* Macro Recommendations */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white/15 backdrop-blur-xs p-2.5 rounded-2xl border border-white/20">
                <span className="text-[11px] text-rose-100 block font-semibold">🥩 Đạm</span>
                <span className="text-base font-black text-white tabular-nums">
                  {calculatedProfile.proteinTargetGrams}g
                </span>
                <span className="text-[10px] text-rose-200 block mt-0.5">
                  ({calculatedProfile.proteinTargetGrams * 4} kcal)
                </span>
              </div>

              <div className="bg-white/15 backdrop-blur-xs p-2.5 rounded-2xl border border-white/20">
                <span className="text-[11px] text-rose-100 block font-semibold">🌾 Carb</span>
                <span className="text-base font-black text-white tabular-nums">
                  {calculatedProfile.carbTargetGrams}g
                </span>
                <span className="text-[10px] text-rose-200 block mt-0.5">
                  ({calculatedProfile.carbTargetGrams * 4} kcal)
                </span>
              </div>

              <div className="bg-white/15 backdrop-blur-xs p-2.5 rounded-2xl border border-white/20">
                <span className="text-[11px] text-rose-100 block font-semibold">🥑 Béo</span>
                <span className="text-base font-black text-white tabular-nums">
                  {calculatedProfile.fatTargetGrams}g
                </span>
                <span className="text-[10px] text-rose-200 block mt-0.5">
                  ({calculatedProfile.fatTargetGrams * 9} kcal)
                </span>
              </div>

              <div className="bg-white/15 backdrop-blur-xs p-2.5 rounded-2xl border border-white/20">
                <span className="text-[11px] text-rose-100 block font-semibold">💧 Nước</span>
                <span className="text-base font-black text-white tabular-nums">
                  {calculatedProfile.waterTargetMl}ml
                </span>
                <span className="text-[10px] text-rose-200 block mt-0.5">
                  (~{Math.round(calculatedProfile.waterTargetMl / 250)} ly)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-rose-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-rose-50 rounded-xl"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-xs shadow-rose-200 flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Áp dụng mục tiêu này</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
