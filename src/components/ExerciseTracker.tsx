import React, { useState } from 'react';
import { Flame, Plus, Trash2, Clock, Activity, Info, Sparkles } from 'lucide-react';
import { ExerciseItem, LoggedExercise } from '../types/nutrition';
import { DEFAULT_EXERCISES, EXERCISE_CATEGORIES, calculateBurnedCalories } from '../data/exerciseData';

interface ExerciseTrackerProps {
  exercises: LoggedExercise[];
  userWeight: number;
  onAddExercise: (exercise: LoggedExercise) => void;
  onDeleteExercise: (id: string) => void;
}

const EXERCISE_EMOJIS: Record<string, string> = {
  chay_bo_trung_binh: '🏃‍♀️',
  chay_bo_nhanh: '⚡',
  di_bo_nhanh: '🚶‍♀️',
  di_bo_thu_gian: '🌸',
  dap_xe_ngoai_troi: '🚴‍♀️',
  nhay_day_nhanh: '🪢',
  boi_loi_tu_do: '🏊‍♀️',
  gym_nang_ta: '🏋️‍♀️',
  calisthenics_hit_dat: '🤸‍♀️',
  yoga_vinyasa: '🧘‍♀️',
  pilates_tham: '🩰',
  cau_long: '🏸',
  bong_da: '⚽',
  bong_ro: '🏀',
  pickleball: '🎾',
  leo_cau_thang: '🪜',
  don_dep_nha_cua: '🧹',
};

export const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({
  exercises,
  userWeight,
  onAddExercise,
  onDeleteExercise,
}) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(DEFAULT_EXERCISES[0].id);
  const [duration, setDuration] = useState<string>('30');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [customCalorieOverride, setCustomCalorieOverride] = useState<string>('');
  const [isManualCalories, setIsManualCalories] = useState<boolean>(false);

  const selectedExercise = DEFAULT_EXERCISES.find((e) => e.id === selectedExerciseId) || DEFAULT_EXERCISES[0];
  const minutesNum = parseInt(duration) || 0;

  const autoBurned = calculateBurnedCalories(selectedExercise.met, userWeight, minutesNum);
  const displayedBurned = isManualCalories && customCalorieOverride !== '' 
    ? parseInt(customCalorieOverride) || 0 
    : autoBurned;

  const totalCaloriesBurned = exercises.reduce((sum, item) => sum + item.caloriesBurned, 0);
  const totalMinutes = exercises.reduce((sum, item) => sum + item.durationMinutes, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (minutesNum <= 0) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLogged: LoggedExercise = {
      id: `ex_${Date.now()}`,
      exerciseId: selectedExercise.id,
      name: selectedExercise.name,
      durationMinutes: minutesNum,
      caloriesBurned: displayedBurned,
      loggedAt: timeStr,
    };

    onAddExercise(newLogged);
    setDuration('30');
    setCustomCalorieOverride('');
    setIsManualCalories(false);
  };

  const filteredCatalog = DEFAULT_EXERCISES.filter((ex) => {
    if (categoryFilter === 'all') return true;
    return ex.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-xs shadow-rose-100/30 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
            🏃‍♀️
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Nhật Ký Vận Động & Đốt Cháy Calo
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Giải phóng năng lượng, tăng tốc trao đổi chất và làm săn chắc vóc dáng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 divide-x divide-rose-100 bg-rose-50/50 px-5 py-3 rounded-2xl border border-rose-100/70">
          <div className="text-center pr-3">
            <span className="text-xs text-rose-500 font-bold">Tổng tiêu hao</span>
            <div className="text-2xl font-black text-rose-600 tabular-nums">
              {totalCaloriesBurned} <span className="text-xs font-semibold text-slate-400">kcal</span>
            </div>
          </div>
          <div className="text-center pl-3">
            <span className="text-xs text-slate-400 font-semibold">Thời gian tập</span>
            <div className="text-2xl font-black text-slate-800 tabular-nums">
              {totalMinutes} <span className="text-xs font-semibold text-slate-400">phút</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Add New Exercise */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-rose-100 p-5 shadow-2xs shadow-rose-100/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-rose-500">✨</span>
              <span>Ghi nhận buổi tập</span>
            </h3>
            <span className="text-xs text-slate-400">
              Trọng lượng: <strong className="text-rose-600">{userWeight} kg</strong>
            </span>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nhóm vận động
              </label>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                {EXERCISE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      categoryFilter === cat.id
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : 'bg-rose-50/70 text-slate-600 hover:bg-rose-100/70 hover:text-rose-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chọn bài tập thể thao
              </label>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
              >
                {filteredCatalog.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {EXERCISE_EMOJIS[ex.id] || '🤸‍♀️'} {ex.name} (MET: {ex.met})
                  </option>
                ))}
              </select>
              {selectedExercise.description && (
                <p className="text-xs text-slate-400 mt-1">
                  {selectedExercise.description}
                </p>
              )}
            </div>

            {/* Duration Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Thời gian tập (phút)
                </label>
                <div className="flex gap-1">
                  {[15, 30, 45, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDuration(m.toString())}
                      className={`text-[11px] px-2.5 py-0.5 rounded-lg transition-all ${
                        duration === m.toString()
                          ? 'bg-rose-500 text-white font-bold shadow-2xs'
                          : 'bg-rose-50 text-slate-600 hover:bg-rose-100'
                      }`}
                    >
                      {m}p
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" />
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  className="w-full pl-9 pr-4 py-2 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            {/* Estimated Burn Box */}
            <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-800">
                  Ước tính tiêu hao chuẩn MET:
                </span>
                <p className="text-[11px] text-rose-600/80">
                  ({userWeight}kg x {duration} phút)
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-rose-600 tabular-nums">
                  {displayedBurned}
                </span>
                <span className="text-xs font-bold text-rose-500 ml-1">kcal</span>
              </div>
            </div>

            {/* Optional Manual Calorie Override */}
            <div className="text-xs">
              <button
                type="button"
                onClick={() => setIsManualCalories(!isManualCalories)}
                className="text-rose-500 hover:text-rose-700 underline inline-flex items-center gap-1 font-semibold"
              >
                {isManualCalories ? 'Dùng tính toán tự động' : 'Tự nhập số calo từ Apple Watch / Garmin'}
              </button>

              {isManualCalories && (
                <div className="mt-2">
                  <input
                    type="number"
                    value={customCalorieOverride}
                    onChange={(e) => setCustomCalorieOverride(e.target.value)}
                    placeholder="Nhập số kcal hiển thị trên đồng hồ"
                    className="w-full px-3 py-1.5 text-sm border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={minutesNum <= 0}
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-bold rounded-2xl transition-all shadow-xs shadow-rose-200 flex items-center justify-center gap-2 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm vào nhật ký vận động</span>
            </button>
          </form>
        </div>

        {/* Right List: Logged Exercises Today */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-rose-100 p-5 shadow-2xs shadow-rose-100/30 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Các bài tập hôm nay ({exercises.length})
            </h3>
            <span className="text-xs text-rose-500 font-semibold">
              Tự động cộng vào ngân sách calo
            </span>
          </div>

          {exercises.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <div className="text-4xl mb-2">🧘‍♀️</div>
              <p className="text-sm font-bold text-slate-700">Chưa có bài tập nào hôm nay</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Hãy dành 20 - 30 phút đi dạo hoặc tập thể dục nhẹ nhàng để cơ thể dẻo dai và sảng khoái hơn nhé!
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-rose-50">
              {exercises.map((item) => (
                <div
                  key={item.id}
                  className="py-3 px-2 flex items-center justify-between hover:bg-rose-50/30 rounded-xl transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center text-xl shrink-0">
                      {EXERCISE_EMOJIS[item.exerciseId] || '🏃‍♀️'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{item.durationMinutes} phút</span>
                        <span>·</span>
                        <span>Lúc {item.loggedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-rose-600 tabular-nums">
                      +{item.caloriesBurned} kcal
                    </span>
                    <button
                      onClick={() => onDeleteExercise(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Xóa bài tập"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scientific Note Box */}
          <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100 flex items-start gap-2.5 text-xs text-slate-500">
            <Info className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <p>
              Hệ số MET (Đương lượng chuyển hóa) chuẩn khoa học giúp tính toán chính xác mức calo tiêu thụ dựa trên cân nặng thực tế của bạn.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
