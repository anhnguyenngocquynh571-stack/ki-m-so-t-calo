import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CalorieOverview } from './components/CalorieOverview';
import { MealSection } from './components/MealSection';
import { AddFoodModal } from './components/AddFoodModal';
import { ExerciseTracker } from './components/ExerciseTracker';
import { TdeeCalculatorModal } from './components/TdeeCalculatorModal';
import { FoodLibraryView } from './components/FoodLibraryView';
import { WeeklyStats } from './components/WeeklyStats';
import { DailyLog, FoodItem, LoggedExercise, LoggedMealItem, MealType, UserProfile } from './types/nutrition';
import {
  getTodayDateString,
  getOrCreateDailyLog,
  saveDailyLog,
  loadUserProfile,
  saveUserProfile,
  loadCustomFoods,
  saveCustomFoods,
  loadAllDailyLogs,
} from './utils/storage';
import { Copy, RotateCcw, Sparkles, CheckCircle2, ChevronRight, Apple, Heart } from 'lucide-react';
import pinkBannerImage from './assets/images/pink_healthy_meal_1790561806938.jpg';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [currentTab, setCurrentTab] = useState<'daily' | 'library' | 'exercise' | 'weekly' | 'tdee'>('daily');
  
  // App state
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [dailyLog, setDailyLog] = useState<DailyLog>(() => getOrCreateDailyLog(getTodayDateString()));
  const [customFoods, setCustomFoods] = useState<FoodItem[]>(() => loadCustomFoods());

  // Modals state
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [targetMealForAdd, setTargetMealForAdd] = useState<MealType>('breakfast');
  const [isTdeeModalOpen, setIsTdeeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load log whenever selectedDate changes
  useEffect(() => {
    const log = getOrCreateDailyLog(selectedDate);
    setDailyLog(log);
  }, [selectedDate]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Helper to update log state & sync to localStorage
  const updateLog = (newLog: DailyLog) => {
    setDailyLog(newLog);
    saveDailyLog(newLog);
  };

  // Meal management
  const handleAddFoodToMeal = (mealType: MealType, food: FoodItem, servingAmount: number) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const totalCals = Math.round(food.calories * servingAmount);
    const totalP = parseFloat((food.protein * servingAmount).toFixed(1));
    const totalC = parseFloat((food.carbs * servingAmount).toFixed(1));
    const totalF = parseFloat((food.fat * servingAmount).toFixed(1));

    const newItem: LoggedMealItem = {
      id: `meal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      foodId: food.id,
      name: food.name,
      servingAmount,
      servingUnit: food.servingUnit,
      baseCalories: food.calories,
      calories: totalCals,
      protein: totalP,
      carbs: totalC,
      fat: totalF,
      mealType,
      loggedAt: timeStr,
      emoji: food.emoji || '🍽️',
    };

    const updatedMeals = {
      ...dailyLog.meals,
      [mealType]: [...dailyLog.meals[mealType], newItem],
    };

    const newLog = {
      ...dailyLog,
      meals: updatedMeals,
    };

    updateLog(newLog);
    showToast(`Đã thêm ${food.emoji || '✨'} ${food.name} (${totalCals} kcal)`);
  };

  const handleUpdateItemAmount = (mealType: MealType, itemId: string, newAmount: number) => {
    const targetList = dailyLog.meals[mealType];
    const updatedList = targetList.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          servingAmount: newAmount,
          calories: Math.round(item.baseCalories * newAmount),
          protein: parseFloat(((item.protein / item.servingAmount) * newAmount).toFixed(1)),
          carbs: parseFloat(((item.carbs / item.servingAmount) * newAmount).toFixed(1)),
          fat: parseFloat(((item.fat / item.servingAmount) * newAmount).toFixed(1)),
        };
      }
      return item;
    });

    const newLog = {
      ...dailyLog,
      meals: {
        ...dailyLog.meals,
        [mealType]: updatedList,
      },
    };
    updateLog(newLog);
  };

  const handleDeleteItem = (mealType: MealType, itemId: string) => {
    const updatedList = dailyLog.meals[mealType].filter((item) => item.id !== itemId);
    const newLog = {
      ...dailyLog,
      meals: {
        ...dailyLog.meals,
        [mealType]: updatedList,
      },
    };
    updateLog(newLog);
    showToast('Đã xóa món khỏi bữa ăn');
  };

  // Water & Weight
  const handleUpdateWater = (newAmount: number) => {
    const newLog = {
      ...dailyLog,
      waterIntakeMl: newAmount,
    };
    updateLog(newLog);
  };

  const handleUpdateWeight = (newWeight: number) => {
    const newLog = {
      ...dailyLog,
      weightRecord: newWeight,
    };
    updateLog(newLog);

    const updatedProfile = {
      ...profile,
      weight: newWeight,
    };
    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    showToast(`Đã cập nhật cân nặng: ${newWeight} kg`);
  };

  // Exercise
  const handleAddExercise = (exercise: LoggedExercise) => {
    const newLog = {
      ...dailyLog,
      exercises: [...dailyLog.exercises, exercise],
    };
    updateLog(newLog);
    showToast(`Đã ghi nhận bài tập: +${exercise.caloriesBurned} kcal`);
  };

  const handleDeleteExercise = (id: string) => {
    const newLog = {
      ...dailyLog,
      exercises: dailyLog.exercises.filter((ex) => ex.id !== id),
    };
    updateLog(newLog);
    showToast('Đã xóa bài tập');
  };

  // Save custom food
  const handleSaveCustomFood = (food: FoodItem) => {
    const nextCustoms = [food, ...customFoods];
    setCustomFoods(nextCustoms);
    saveCustomFoods(nextCustoms);
    showToast(`Đã lưu "${food.name}" vào thư viện`);
  };

  // Save profile
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveUserProfile(newProfile);
    showToast('Đã áp dụng mục tiêu calo & TDEE mới');
  };

  // Copy yesterday's meals
  const handleCopyYesterday = () => {
    const allLogs = loadAllDailyLogs();
    const [y, m, d] = selectedDate.split('-').map(Number);
    const yesterday = new Date(y, m - 1, d);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const yesterdayLog = allLogs[yesterdayStr];
    if (!yesterdayLog) {
      showToast('Không có dữ liệu bữa ăn của ngày hôm trước để sao chép.');
      return;
    }

    const copyWithNewIds = (list: LoggedMealItem[]) =>
      list.map((item) => ({
        ...item,
        id: `copied_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      }));

    const newLog: DailyLog = {
      ...dailyLog,
      meals: {
        breakfast: [...dailyLog.meals.breakfast, ...copyWithNewIds(yesterdayLog.meals.breakfast)],
        lunch: [...dailyLog.meals.lunch, ...copyWithNewIds(yesterdayLog.meals.lunch)],
        dinner: [...dailyLog.meals.dinner, ...copyWithNewIds(yesterdayLog.meals.dinner)],
        snack: [...dailyLog.meals.snack, ...copyWithNewIds(yesterdayLog.meals.snack)],
      },
    };

    updateLog(newLog);
    showToast('Đã sao chép thực đơn hôm qua thành công! 🌸');
  };

  // Reset current day's log
  const handleResetDay = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại toàn bộ nhật ký của ngày này không?')) {
      const emptyLog: DailyLog = {
        date: selectedDate,
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
        exercises: [],
        waterIntakeMl: 0,
      };
      updateLog(emptyLog);
      showToast('Đã đặt lại dữ liệu ngày.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7f9] flex flex-col font-sans">
      {/* Toast Notification in Rose Style */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-600 text-white px-4 py-2.5 rounded-2xl shadow-lg shadow-rose-300/50 border border-rose-400 text-xs font-bold flex items-center gap-2 animate-bounce">
          <Heart className="w-4 h-4 fill-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onOpenQuickAdd={() => {
          setTargetMealForAdd('breakfast');
          setIsAddFoodOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Tab 1: Daily Calorie Control (Default) */}
        {currentTab === 'daily' && (
          <div className="space-y-6">
            
            {/* Visual Pink & White Food Banner */}
            <div className="relative rounded-3xl overflow-hidden shadow-xs border border-rose-100 bg-white min-h-[150px] sm:min-h-[190px] flex items-center">
              <img
                src={pinkBannerImage}
                alt="Thực đơn dinh dưỡng đẹp mắt và lành mạnh"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-linear-to-r from-rose-950/80 via-rose-900/60 to-transparent" />

              <div className="relative z-10 p-5 sm:p-8 max-w-2xl text-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                  <Apple className="w-4 h-4 text-pink-300" />
                  <span>Dinh dưỡng cân bằng · Kiểm soát calo khoa học</span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                  Kiểm Soát Calo & Giữ Dáng Thon Gọn
                </h1>
                <p className="text-xs sm:text-sm text-rose-100 leading-relaxed hidden sm:block">
                  Nguyên lý thâm hụt calo chuẩn khoa học: Ăn đủ chất, bổ sung đạm nạc, hoa quả tươi và vận động đều đặn để tự tin với vóc dáng mỗi ngày! 🌸
                </p>
              </div>
            </div>

            {/* Dial & Macronutrients Overview */}
            <CalorieOverview
              log={dailyLog}
              profile={profile}
              onUpdateWater={handleUpdateWater}
              onUpdateWeight={handleUpdateWeight}
              onOpenTdeeModal={() => setIsTdeeModalOpen(true)}
            />

            {/* 4 Daily Meals Sections */}
            <MealSection
              log={dailyLog}
              calorieTarget={profile.calorieTarget}
              onOpenAddFoodModal={(mealType) => {
                setTargetMealForAdd(mealType);
                setIsAddFoodOpen(true);
              }}
              onUpdateItemAmount={handleUpdateItemAmount}
              onDeleteItem={handleDeleteItem}
            />

            {/* Quick Actions Footer Ribbon */}
            <div className="bg-white rounded-3xl border border-rose-100 p-4 sm:p-5 shadow-2xs shadow-rose-100/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyYesterday}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100/80 text-rose-600 text-xs font-bold rounded-xl transition-colors border border-rose-200/60"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép thực đơn hôm qua</span>
                </button>
                <button
                  onClick={handleResetDay}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold rounded-xl transition-colors border border-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại ngày này</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-rose-400">
                <span>Dữ liệu lưu tự động trên trình duyệt</span>
                <span aria-hidden="true">·</span>
                <button
                  onClick={() => setIsTdeeModalOpen(true)}
                  className="text-rose-600 hover:text-rose-700 font-bold underline"
                >
                  Cài đặt lại mục tiêu TDEE
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Food Library */}
        {currentTab === 'library' && (
          <FoodLibraryView
            customFoods={customFoods}
            onQuickAdd={(food, mealType) => {
              handleAddFoodToMeal(mealType, food, 1);
            }}
            onOpenCreateCustom={() => {
              setIsAddFoodOpen(true);
            }}
          />
        )}

        {/* Tab 3: Exercise Tracker */}
        {currentTab === 'exercise' && (
          <ExerciseTracker
            exercises={dailyLog.exercises}
            userWeight={profile.weight}
            onAddExercise={handleAddExercise}
            onDeleteExercise={handleDeleteExercise}
          />
        )}

        {/* Tab 4: Weekly Stats */}
        {currentTab === 'weekly' && (
          <WeeklyStats
            profile={profile}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setCurrentTab('daily');
            }}
          />
        )}

        {/* Tab 5: TDEE Goal Setup View */}
        {currentTab === 'tdee' && (
          <div className="max-w-2xl mx-auto">
            <TdeeCalculatorModal
              isOpen={true}
              onClose={() => setCurrentTab('daily')}
              currentProfile={profile}
              onSaveProfile={(newProf) => {
                handleSaveProfile(newProf);
                setCurrentTab('daily');
              }}
            />
          </div>
        )}

      </main>

      {/* Global Add Food Modal */}
      <AddFoodModal
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        targetMeal={targetMealForAdd}
        customFoods={customFoods}
        onAddFoodToMeal={handleAddFoodToMeal}
        onSaveCustomFood={handleSaveCustomFood}
      />

      {/* Global TDEE Calculator Modal */}
      <TdeeCalculatorModal
        isOpen={isTdeeModalOpen}
        onClose={() => setIsTdeeModalOpen(false)}
        currentProfile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-rose-100 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-rose-500/80 space-y-1">
          <p className="font-bold text-slate-700">
            🌸 CaloTrack — Ứng dụng kiểm soát calo & dinh dưỡng một ngày dành cho người Việt
          </p>
          <p className="text-slate-400">
            Dựa trên hệ số năng lượng chuẩn Viện Dinh Dưỡng Quốc Gia và công thức y khoa Mifflin-St Jeor.
          </p>
        </div>
      </footer>
    </div>
  );
}
