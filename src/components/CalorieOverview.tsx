import React, { useState } from 'react';
import { Droplet, Flame, Utensils, Target, Plus, Minus, Scale, Check, AlertCircle, Sparkles } from 'lucide-react';
import { DailyLog, UserProfile } from '../types/nutrition';

interface CalorieOverviewProps {
  log: DailyLog;
  profile: UserProfile;
  onUpdateWater: (newAmount: number) => void;
  onUpdateWeight: (newWeight: number) => void;
  onOpenTdeeModal: () => void;
}

export const CalorieOverview: React.FC<CalorieOverviewProps> = ({
  log,
  profile,
  onUpdateWater,
  onUpdateWeight,
  onOpenTdeeModal,
}) => {
  const [editingWeight, setEditingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState(log.weightRecord?.toString() || profile.weight.toString());

  // Tính tổng calo và macro từ 4 bữa ăn
  const allMeals = [
    ...log.meals.breakfast,
    ...log.meals.lunch,
    ...log.meals.dinner,
    ...log.meals.snack,
  ];

  const totalCaloriesIntake = allMeals.reduce((sum, item) => sum + item.calories, 0);
  const totalProteinIntake = allMeals.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbsIntake = allMeals.reduce((sum, item) => sum + item.carbs, 0);
  const totalFatIntake = allMeals.reduce((sum, item) => sum + item.fat, 0);

  // Tính calo tiêu hao từ vận động
  const totalBurned = log.exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);

  // Calo còn lại = Mục tiêu - Nạp vào + Vận động
  const remainingCalories = profile.calorieTarget - totalCaloriesIntake + totalBurned;
  const isSurplus = remainingCalories < 0;

  // Tỷ lệ phần trăm
  const caloriePercent = Math.min(100, Math.round((totalCaloriesIntake / profile.calorieTarget) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProteinIntake / (profile.proteinTargetGrams || 1)) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbsIntake / (profile.carbTargetGrams || 1)) * 100));
  const fatPercent = Math.min(100, Math.round((totalFatIntake / (profile.fatTargetGrams || 1)) * 100));

  // Tỷ lệ % Calo thực tế từ 3 chất đa lượng
  const totalMacroCal = (totalProteinIntake * 4) + (totalCarbsIntake * 4) + (totalFatIntake * 9);
  const pCalPercent = totalMacroCal > 0 ? Math.round(((totalProteinIntake * 4) / totalMacroCal) * 100) : 0;
  const cCalPercent = totalMacroCal > 0 ? Math.round(((totalCarbsIntake * 4) / totalMacroCal) * 100) : 0;
  const fCalPercent = totalMacroCal > 0 ? Math.round(((totalFatIntake * 9) / totalMacroCal) * 100) : 0;

  // Lượng nước
  const waterTarget = profile.waterTargetMl || 2000;
  const waterPercent = Math.min(100, Math.round((log.waterIntakeMl / waterTarget) * 100));

  const handleWaterAdd = (delta: number) => {
    const nextVal = Math.max(0, log.waterIntakeMl + delta);
    onUpdateWater(nextVal);
  };

  const handleSaveWeight = () => {
    const num = parseFloat(weightInput);
    if (!isNaN(num) && num > 20 && num < 300) {
      onUpdateWeight(num);
      setEditingWeight(false);
    }
  };

  // SVG circular gauge geometry
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, caloriePercent) / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Primary Calorie Dial & Budget Card */}
      <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-7 shadow-xs shadow-rose-100/50">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Circular Visual Dial in Rosy Pink */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-44 h-44 sm:w-48 sm:h-48 transform -rotate-90" viewBox="0 0 160 160">
              {/* Background soft pink track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-rose-100/70 stroke-current"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`stroke-current transition-all duration-700 ease-out ${
                  isSurplus ? 'text-amber-500' : 'text-rose-500'
                }`}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Ring Stats */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                {isSurplus ? 'Vượt ngân sách' : '🌸 Calo Còn lại'}
              </span>
              <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
                isSurplus ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {Math.abs(remainingCalories).toLocaleString()}
              </span>
              <span className="text-xs text-rose-500 font-semibold">kcal</span>
            </div>
          </div>

          {/* Equation Breakdown Grid */}
          <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 divide-x divide-rose-100/80 bg-rose-50/40 rounded-2xl p-3.5 sm:p-4 border border-rose-100/60">
            {/* Target */}
            <div className="text-center px-1">
              <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                <Target className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-xs font-semibold">Mục tiêu</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-slate-800 tabular-nums">
                {profile.calorieTarget.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">kcal/ngày</span>
            </div>

            {/* Food Intake */}
            <div className="text-center px-1">
              <div className="flex items-center justify-center gap-1 text-rose-600 mb-1">
                <Utensils className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Nạp vào</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-rose-600 tabular-nums">
                {totalCaloriesIntake.toLocaleString()}
              </div>
              <span className="text-[11px] text-rose-400 font-semibold">
                {caloriePercent}% chỉ tiêu
              </span>
            </div>

            {/* Exercise Burned */}
            <div className="text-center px-1">
              <div className="flex items-center justify-center gap-1 text-pink-600 mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Đốt cháy</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-pink-600 tabular-nums">
                {totalBurned.toLocaleString()}
              </div>
              <span className="text-[11px] text-pink-400 font-medium">
                {log.exercises.length} bài tập
              </span>
            </div>
          </div>

          {/* Contextual Status Banner */}
          <div className="w-full lg:w-72 flex flex-col justify-between self-stretch bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>Trạng thái hôm nay</span>
                </span>
                <button
                  onClick={onOpenTdeeModal}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
                >
                  Đổi mục tiêu
                </button>
              </div>

              {isSurplus ? (
                <div className="flex items-start gap-2 text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 text-xs leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    Đã vượt mức dự kiến <strong>{Math.abs(remainingCalories)} kcal</strong>. Bạn có thể đi bộ thêm 30 phút để cân bằng năng lượng nhé!
                  </div>
                </div>
              ) : remainingCalories > 600 ? (
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bạn còn <strong className="text-rose-600">{remainingCalories} kcal</strong> cho các bữa ăn tiếp theo. Hãy ưu tiên bổ sung đạm nạc và hoa quả tươi mát.
                </p>
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rất tuyệt vời! Bạn đang duy trì mức calo cực kỳ chuẩn xác cho mục tiêu vóc dáng thon gọn, khỏe mạnh.
                </p>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-rose-200/50 flex items-center justify-between text-xs text-slate-500">
              <span>Chế độ:</span>
              <span className="font-bold text-rose-600">
                {profile.goal === 'lose_fast' && 'Giảm cân nhanh (-500 kcal)'}
                {profile.goal === 'lose_slow' && 'Giảm cân từ từ (-300 kcal)'}
                {profile.goal === 'maintain' && 'Duy trì vóc dáng'}
                {profile.goal === 'gain_muscle' && 'Tăng cơ nạc (+350 kcal)'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Macronutrient Targets Grid in Soft Pink Tones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Protein (Chất đạm) */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4.5 shadow-2xs shadow-rose-100/30">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <span>🥩 Đạm (Protein)</span>
              </span>
              <p className="text-[11px] text-slate-400">Giữ cơ săn chắc, no lâu</p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/50">
              {pCalPercent}% calo
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-3 mb-1.5">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {Math.round(totalProteinIntake)}
              <span className="text-sm font-semibold text-slate-400 ml-1">/ {profile.proteinTargetGrams}g</span>
            </span>
            <span className="text-xs font-bold text-rose-600 tabular-nums">
              {proteinPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-rose-50 rounded-full overflow-hidden border border-rose-100/60">
            <div
              className="h-full bg-linear-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Đã nạp: {Math.round(totalProteinIntake * 4)} kcal</span>
            <span>Còn thiếu: {Math.max(0, profile.proteinTargetGrams - Math.round(totalProteinIntake))}g</span>
          </div>
        </div>

        {/* Carbohydrates (Tinh bột) */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4.5 shadow-2xs shadow-rose-100/30">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <span>🌾 Tinh bột (Carbs)</span>
              </span>
              <p className="text-[11px] text-slate-400">Năng lượng làm việc cả ngày</p>
            </div>
            <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200/50">
              {cCalPercent}% calo
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-3 mb-1.5">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {Math.round(totalCarbsIntake)}
              <span className="text-sm font-semibold text-slate-400 ml-1">/ {profile.carbTargetGrams}g</span>
            </span>
            <span className="text-xs font-bold text-pink-600 tabular-nums">
              {carbsPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-pink-50 rounded-full overflow-hidden border border-pink-100/60">
            <div
              className="h-full bg-linear-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Đã nạp: {Math.round(totalCarbsIntake * 4)} kcal</span>
            <span>Còn lại: {Math.max(0, profile.carbTargetGrams - Math.round(totalCarbsIntake))}g</span>
          </div>
        </div>

        {/* Fat (Chất béo) */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4.5 shadow-2xs shadow-rose-100/30">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <span>🥑 Chất béo (Fat)</span>
              </span>
              <p className="text-[11px] text-slate-400">Hormone & làn da khỏe đẹp</p>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/50">
              {fCalPercent}% calo
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-3 mb-1.5">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {Math.round(totalFatIntake)}
              <span className="text-sm font-semibold text-slate-400 ml-1">/ {profile.fatTargetGrams}g</span>
            </span>
            <span className="text-xs font-bold text-purple-600 tabular-nums">
              {fatPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-purple-50 rounded-full overflow-hidden border border-purple-100/60">
            <div
              className="h-full bg-linear-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Đã nạp: {Math.round(totalFatIntake * 9)} kcal</span>
            <span>Còn lại: {Math.max(0, profile.fatTargetGrams - Math.round(totalFatIntake))}g</span>
          </div>
        </div>

      </div>

      {/* Water & Weight Check-in */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Water Intake Tracker */}
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-2xs shadow-rose-100/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-100">
                <Droplet className="w-5 h-5 fill-sky-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Uống nước hôm nay 💧</h3>
                <p className="text-xs text-slate-400">Mục tiêu: {waterTarget} ml (~{Math.round(waterTarget / 250)} ly)</p>
              </div>
            </div>
            <span className="text-lg font-bold text-sky-600 tabular-nums">
              {log.waterIntakeMl} <span className="text-xs font-normal text-slate-400">ml</span>
            </span>
          </div>

          {/* Water level gauge */}
          <div className="mt-4 mb-4">
            <div className="w-full h-3 bg-sky-50/80 rounded-full overflow-hidden border border-sky-100">
              <div
                className="h-full bg-linear-to-r from-sky-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
              <span>0 ml</span>
              <span className="font-bold text-sky-600">{waterPercent}%</span>
              <span>{waterTarget} ml</span>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleWaterAdd(250)}
              className="flex-1 py-2 px-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 border border-sky-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+250 ml (1 ly)</span>
            </button>
            <button
              onClick={() => handleWaterAdd(500)}
              className="flex-1 py-2 px-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 border border-sky-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+500 ml (1 chai)</span>
            </button>
            <button
              onClick={() => handleWaterAdd(-250)}
              disabled={log.waterIntakeMl <= 0}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 text-xs font-bold rounded-xl transition-colors"
              title="Bớt 250ml"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Daily Weight Check-in */}
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-2xs shadow-rose-100/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cân nặng hôm nay ⚖️</h3>
                <p className="text-xs text-slate-400">
                  Mục tiêu vóc dáng: {profile.targetWeight ? `${profile.targetWeight} kg` : 'Chưa đặt'}
                </p>
              </div>
            </div>
            
            {log.weightRecord ? (
              <span className="text-lg font-extrabold text-rose-600 tabular-nums">
                {log.weightRecord} <span className="text-xs font-normal text-slate-400">kg</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full">Chưa ghi nhận</span>
            )}
          </div>

          <div className="my-4">
            {editingWeight ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  placeholder="Nhập số kg (vd 52.5)"
                  autoFocus
                />
                <button
                  onClick={handleSaveWeight}
                  className="px-3.5 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-colors flex items-center gap-1 shadow-2xs shadow-rose-200"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu</span>
                </button>
                <button
                  onClick={() => setEditingWeight(false)}
                  className="px-2.5 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs hover:bg-slate-200"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/70">
                <span className="text-xs text-slate-600">
                  {log.weightRecord
                    ? `Cân nặng mốc hồ sơ: ${profile.weight} kg`
                    : `Ghi lại cân nặng lúc sáng sớm để theo dõi tiến trình giảm mỡ`}
                </span>
                <button
                  onClick={() => {
                    setWeightInput(log.weightRecord?.toString() || profile.weight.toString());
                    setEditingWeight(true);
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 ml-2 shrink-0 underline"
                >
                  {log.weightRecord ? 'Sửa' : 'Cập nhật'}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>BMR trao đổi chất: <strong className="text-slate-700">{profile.bmr} kcal</strong></span>
            <span>TDEE tiêu thụ: <strong className="text-slate-700">{profile.tdee} kcal</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};
