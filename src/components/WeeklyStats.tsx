import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { DailyLog, UserProfile } from '../types/nutrition';
import { loadAllDailyLogs, formatDateToVietnamese, getTodayDateString } from '../utils/storage';

interface WeeklyStatsProps {
  profile: UserProfile;
  onSelectDate: (date: string) => void;
}

export const WeeklyStats: React.FC<WeeklyStatsProps> = ({ profile, onSelectDate }) => {
  const allLogs = loadAllDailyLogs();
  const todayStr = getTodayDateString();

  const past7Days = useMemo(() => {
    const list: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      list.push(str);
    }
    return list;
  }, []);

  const weekData = useMemo(() => {
    return past7Days.map((dateStr) => {
      const log = allLogs[dateStr];
      if (!log) {
        return {
          dateStr,
          hasData: false,
          intake: 0,
          burned: 0,
          net: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          water: 0,
        };
      }

      const allItems = [
        ...log.meals.breakfast,
        ...log.meals.lunch,
        ...log.meals.dinner,
        ...log.meals.snack,
      ];

      const intake = allItems.reduce((sum, item) => sum + item.calories, 0);
      const protein = allItems.reduce((sum, item) => sum + item.protein, 0);
      const carbs = allItems.reduce((sum, item) => sum + item.carbs, 0);
      const fat = allItems.reduce((sum, item) => sum + item.fat, 0);
      const burned = log.exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);
      const net = intake - burned;

      return {
        dateStr,
        hasData: intake > 0 || log.exercises.length > 0 || log.waterIntakeMl > 0,
        intake,
        burned,
        net,
        protein,
        carbs,
        fat,
        water: log.waterIntakeMl,
      };
    });
  }, [past7Days, allLogs]);

  const activeDays = weekData.filter((d) => d.hasData);
  const totalIntake = activeDays.reduce((sum, d) => sum + d.intake, 0);
  const avgIntake = activeDays.length > 0 ? Math.round(totalIntake / activeDays.length) : 0;
  const avgBurned = activeDays.length > 0 ? Math.round(activeDays.reduce((sum, d) => sum + d.burned, 0) / activeDays.length) : 0;
  const avgProtein = activeDays.length > 0 ? Math.round(activeDays.reduce((sum, d) => sum + d.protein, 0) / activeDays.length) : 0;

  const maxBarValue = Math.max(profile.calorieTarget * 1.25, ...weekData.map((d) => d.intake));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-xs shadow-rose-100/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
            📊
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Thống Kê Xu Hướng 7 Ngày Qua
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Đánh giá mức độ tuân thủ mục tiêu calo và duy trì năng lượng ổn định
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-rose-50/50 px-4 py-2.5 rounded-2xl border border-rose-100 text-xs">
          <div>
            <span className="text-rose-400 block font-semibold">Calo trung bình / ngày</span>
            <span className="text-base font-extrabold text-slate-900 tabular-nums">
              {avgIntake} <span className="text-xs font-normal text-slate-400">kcal</span>
            </span>
          </div>
          <div className="h-8 w-px bg-rose-200/70" />
          <div>
            <span className="text-rose-400 block font-semibold">Đạm trung bình</span>
            <span className="text-base font-extrabold text-rose-600 tabular-nums">
              {avgProtein}g
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-2xs shadow-rose-100/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Biểu đồ nạp Calo theo ngày</h3>
            <span className="text-xs text-slate-400">
              Đường nét đứt màu hồng thể hiện mức mục tiêu ({profile.calorieTarget} kcal)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500" />
              <span className="text-slate-600 font-semibold">Đạt chuẩn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400" />
              <span className="text-slate-600 font-semibold">Vượt mục tiêu</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Area */}
        <div className="relative pt-6 pb-2">
          {/* Target Reference Line */}
          <div
            className="absolute left-0 right-0 border-b-2 border-dashed border-rose-300/80 z-10 pointer-events-none flex justify-end pr-2"
            style={{
              bottom: `${Math.min(92, Math.max(10, (profile.calorieTarget / maxBarValue) * 100))}%`,
            }}
          >
            <span className="text-[10px] font-bold text-rose-500 bg-white/90 px-1.5 py-0.5 rounded-full border border-rose-200 -translate-y-3 shadow-2xs">
              Mục tiêu: {profile.calorieTarget} kcal
            </span>
          </div>

          {/* Bars */}
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6">
            {weekData.map((day) => {
              const heightPercent = maxBarValue > 0 ? Math.min(100, Math.round((day.intake / maxBarValue) * 100)) : 0;
              const isOver = day.intake > profile.calorieTarget;
              const isToday = day.dateStr === todayStr;

              const [, m, d] = day.dateStr.split('-');

              return (
                <div
                  key={day.dateStr}
                  onClick={() => onSelectDate(day.dateStr)}
                  className="flex-1 flex flex-col items-center cursor-pointer group"
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg shadow-2xs mb-1 whitespace-nowrap tabular-nums pointer-events-none">
                    {day.intake > 0 ? `${day.intake} kcal` : 'Chưa ghi'}
                  </div>

                  {/* The Bar */}
                  <div className="w-full max-w-[48px] bg-rose-50/70 rounded-t-2xl overflow-hidden flex flex-col justify-end h-44">
                    {day.intake > 0 ? (
                      <div
                        className={`w-full rounded-t-2xl transition-all duration-500 ${
                          isOver ? 'bg-amber-400' : 'bg-linear-to-t from-rose-500 to-pink-400'
                        }`}
                        style={{ height: `${Math.max(8, heightPercent)}%` }}
                      />
                    ) : (
                      <div className="w-full h-1 bg-rose-200/60 rounded-t" />
                    )}
                  </div>

                  {/* Day Label */}
                  <div className="mt-2 text-center">
                    <span className={`text-xs font-bold block ${
                      isToday ? 'text-rose-600 font-black' : 'text-slate-600'
                    }`}>
                      {d}/{m}
                    </span>
                    <span className="text-[10px] text-rose-400 font-semibold block">
                      {isToday ? 'Hôm nay' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Days Table */}
      <div className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-2xs shadow-rose-100/30">
        <div className="p-4 sm:p-5 border-b border-rose-100">
          <h3 className="text-sm font-bold text-slate-900">Chi tiết nhật ký 7 ngày gần nhất</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-rose-50/50 text-slate-500 uppercase tracking-wider font-semibold border-b border-rose-100">
              <tr>
                <th className="py-3 px-4">Ngày</th>
                <th className="py-3 px-4">Calo Nạp vào</th>
                <th className="py-3 px-4">Tiêu hao tập</th>
                <th className="py-3 px-4">Calo thuần (Net)</th>
                <th className="py-3 px-4">Đạm (Protein)</th>
                <th className="py-3 px-4">Nước</th>
                <th className="py-3 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {weekData.slice().reverse().map((day) => {
                const isOver = day.intake > profile.calorieTarget;
                const netRemaining = profile.calorieTarget - day.intake + day.burned;

                return (
                  <tr key={day.dateStr} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {formatDateToVietnamese(day.dateStr)}
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      {day.intake > 0 ? (
                        <span className={`font-bold ${isOver ? 'text-amber-600' : 'text-slate-800'}`}>
                          {day.intake} kcal
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-pink-600 font-bold">
                      {day.burned > 0 ? `-${day.burned} kcal` : '-'}
                    </td>
                    <td className="py-3 px-4 tabular-nums font-bold">
                      {day.intake > 0 ? (
                        <span className={netRemaining >= 0 ? 'text-rose-600' : 'text-amber-600'}>
                          {netRemaining >= 0 ? `Dư ${netRemaining}` : `Vượt ${Math.abs(netRemaining)}`} kcal
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-600 font-semibold">
                      {day.protein > 0 ? `${Math.round(day.protein)}g` : '-'}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-sky-600 font-semibold">
                      {day.water > 0 ? `${day.water} ml` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectDate(day.dateStr)}
                        className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 font-bold transition-colors"
                      >
                        <span>Xem</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
