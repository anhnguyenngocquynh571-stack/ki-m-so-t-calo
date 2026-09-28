import { DailyLog, FoodItem, LoggedMealItem, UserProfile } from '../types/nutrition';
import { DEFAULT_VIETNAMESE_FOODS } from '../data/vietnameseFoodData';
import { DEFAULT_USER_PROFILE } from './tdeeCalculator';

const PROFILE_KEY = 'calotrack_user_profile_v1';
const LOGS_KEY = 'calotrack_daily_logs_v1';
const CUSTOM_FOODS_KEY = 'calotrack_custom_foods_v1';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateToVietnamese(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const todayStr = getTodayDateString();
    
    // Check if yesterday or tomorrow
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayOfWeekName = daysOfWeek[date.getDay()];

    if (dateString === todayStr) {
      return `Hôm nay, ${day} tháng ${month}`;
    } else if (dateString === yesterdayStr) {
      return `Hôm qua, ${day} tháng ${month}`;
    } else if (dateString === tomorrowStr) {
      return `Ngày mai, ${day} tháng ${month}`;
    }

    return `${dayOfWeekName}, ${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load user profile from storage', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function loadCustomFoods(): FoodItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_FOODS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load custom foods', e);
  }
  return [];
}

export function saveCustomFoods(foods: FoodItem[]): void {
  try {
    localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(foods));
  } catch (e) {
    console.error('Failed to save custom foods', e);
  }
}

export function loadAllDailyLogs(): Record<string, DailyLog> {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load daily logs', e);
  }
  return {};
}

export function saveDailyLog(log: DailyLog): void {
  try {
    const all = loadAllDailyLogs();
    all[log.date] = log;
    localStorage.setItem(LOGS_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save daily log', e);
  }
}

/**
 * Tạo dữ liệu mẫu ban đầu cho ngày hôm nay để ứng dụng có dữ liệu trực quan sinh động
 */
export function getOrCreateDailyLog(date: string): DailyLog {
  const all = loadAllDailyLogs();
  if (all[date]) {
    return all[date];
  }

  // Nếu là ngày hôm nay và chưa có dữ liệu, tạo một mẫu thực đơn Việt Nam hợp lý
  const today = getTodayDateString();
  if (date === today) {
    const sampleBreakfast: LoggedMealItem = {
      id: 'sample_bf_1',
      foodId: 'pho_bo_chin',
      name: 'Phở bò chín (tô vừa)',
      servingAmount: 1,
      servingUnit: '1 tô (khoảng 480g)',
      baseCalories: 450,
      calories: 450,
      protein: 26,
      carbs: 62,
      fat: 10,
      mealType: 'breakfast',
      loggedAt: '07:30',
      emoji: '🍜',
    };

    const sampleDrink: LoggedMealItem = {
      id: 'sample_bf_2',
      foodId: 'ca_phe_den_khong_duong',
      name: 'Cà phê đen đá không đường',
      servingAmount: 1,
      servingUnit: '1 ly (200ml)',
      baseCalories: 5,
      calories: 5,
      protein: 0.3,
      carbs: 0.8,
      fat: 0.1,
      mealType: 'breakfast',
      loggedAt: '08:00',
      emoji: '☕',
    };

    const sampleLunch1: LoggedMealItem = {
      id: 'sample_lu_1',
      foodId: 'com_gao_lut',
      name: 'Cơm gạo lứt huyết rồng',
      servingAmount: 1,
      servingUnit: '1 chén (150g)',
      baseCalories: 165,
      calories: 165,
      protein: 3.8,
      carbs: 35,
      fat: 1.3,
      mealType: 'lunch',
      loggedAt: '12:15',
      emoji: '🥣',
    };

    const sampleLunch2: LoggedMealItem = {
      id: 'sample_lu_2',
      foodId: 'uc_ga_ap_chao',
      name: 'Ức gà áp chảo không da',
      servingAmount: 1,
      servingUnit: '150g',
      baseCalories: 195,
      calories: 195,
      protein: 39,
      carbs: 0,
      fat: 3.8,
      mealType: 'lunch',
      loggedAt: '12:15',
      emoji: '🍗',
    };

    const sampleLunch3: LoggedMealItem = {
      id: 'sample_lu_3',
      foodId: 'canh_chua_ca_loc',
      name: 'Canh chua cá lóc',
      servingAmount: 1,
      servingUnit: '1 tô vừa (300ml)',
      baseCalories: 135,
      calories: 135,
      protein: 16,
      carbs: 10,
      fat: 3.5,
      mealType: 'lunch',
      loggedAt: '12:15',
      emoji: '🐟',
    };

    const sampleInitialLog: DailyLog = {
      date: today,
      meals: {
        breakfast: [sampleBreakfast, sampleDrink],
        lunch: [sampleLunch1, sampleLunch2, sampleLunch3],
        dinner: [],
        snack: [],
      },
      exercises: [
        {
          id: 'sample_ex_1',
          exerciseId: 'di_bo_nhanh',
          name: 'Đi bộ nhanh (~ 5-6 km/h)',
          durationMinutes: 30,
          caloriesBurned: 116,
          loggedAt: '06:45',
        },
      ],
      waterIntakeMl: 1250,
      weightRecord: 53.8,
      notes: 'Hôm nay cảm thấy năng lượng dồi dào, uống đủ nước.',
    };

    saveDailyLog(sampleInitialLog);
    return sampleInitialLog;
  }

  // Ngày mới rỗng
  const emptyLog: DailyLog = {
    date,
    meals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    },
    exercises: [],
    waterIntakeMl: 0,
  };
  return emptyLog;
}
