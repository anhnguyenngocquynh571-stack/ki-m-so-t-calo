import { ActivityLevel, CalorieGoal, UserProfile } from '../types/nutrition';

export const ACTIVITY_LEVEL_FACTORS: Record<ActivityLevel, { factor: number; label: string; desc: string }> = {
  sedentary: {
    factor: 1.2,
    label: 'Ít vận động',
    desc: 'Làm việc văn phòng, ít hoặc không tập thể dục',
  },
  light: {
    factor: 1.375,
    label: 'Vận động nhẹ',
    desc: 'Tập luyện nhẹ 1 - 3 buổi / tuần',
  },
  moderate: {
    factor: 1.55,
    label: 'Vận động vừa phải',
    desc: 'Tập thể dục chăm chỉ 3 - 5 buổi / tuần',
  },
  active: {
    factor: 1.725,
    label: 'Năng động cao',
    desc: 'Tập luyện cường độ cao 6 - 7 buổi / tuần',
  },
  very_active: {
    factor: 1.9,
    label: 'Rất năng động',
    desc: 'Vận động viên hoặc công việc lao động thể chất nặng',
  },
};

export const CALORIE_GOAL_CONFIG: Record<CalorieGoal, { calorieDelta: number; label: string; desc: string }> = {
  lose_fast: {
    calorieDelta: -500,
    label: 'Giảm cân nhanh',
    desc: 'Thâm hụt 500 kcal/ngày (~ giảm 0.5kg mỡ/tuần)',
  },
  lose_slow: {
    calorieDelta: -300,
    label: 'Giảm cân chậm & bền vững',
    desc: 'Thâm hụt nhẹ 300 kcal/ngày, dễ duy trì lâu dài',
  },
  maintain: {
    calorieDelta: 0,
    label: 'Duy trì cân nặng & vóc dáng',
    desc: 'Cung cấp năng lượng cân bằng ngang TDEE',
  },
  gain_muscle: {
    calorieDelta: 350,
    label: 'Tăng cân & Tăng cơ nạc',
    desc: 'Dư thừa nhẹ 350 kcal/ngày kết hợp tập tạ kháng lực',
  },
};

/**
 * Tính BMR (Tỷ lệ trao đổi chất cơ bản) theo công thức Mifflin-St Jeor
 */
export function calculateBMR(gender: 'male' | 'female', weightKg: number, heightCm: number, age: number): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 1500;
  
  // Công thức: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + s
  // s = +5 cho nam, -161 cho nữ
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const s = gender === 'male' ? 5 : -161;
  return Math.round(base + s);
}

/**
 * Tính TDEE (Tổng năng lượng tiêu hao hàng ngày)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_LEVEL_FACTORS[activityLevel]?.factor || 1.375;
  return Math.round(bmr * multiplier);
}

/**
 * Tính toán toàn bộ chỉ số dinh dưỡng cá nhân
 */
export function calculateProfileNutrition(params: {
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  targetWeight?: number;
  activityLevel: ActivityLevel;
  goal: CalorieGoal;
}): UserProfile {
  const bmr = calculateBMR(params.gender, params.weight, params.height, params.age);
  const tdee = calculateTDEE(bmr, params.activityLevel);
  const delta = CALORIE_GOAL_CONFIG[params.goal]?.calorieDelta || 0;
  
  // Đảm bảo mức tối thiểu an toàn y tế (nữ >= 1200 kcal, nam >= 1500 kcal)
  const minSafe = params.gender === 'male' ? 1500 : 1200;
  const calorieTarget = Math.max(minSafe, Math.round(tdee + delta));

  // Phân bổ Macronutrients (Đạm 25%, Tinh bột 45%, Chất béo 30%)
  // 1g Protein = 4 kcal, 1g Carb = 4 kcal, 1g Fat = 9 kcal
  let proteinRatio = 0.25;
  let carbRatio = 0.45;
  let fatRatio = 0.30;

  if (params.goal === 'gain_muscle') {
    proteinRatio = 0.30;
    carbRatio = 0.45;
    fatRatio = 0.25;
  } else if (params.goal === 'lose_fast') {
    proteinRatio = 0.30;
    carbRatio = 0.40;
    fatRatio = 0.30;
  }

  const proteinTargetGrams = Math.round((calorieTarget * proteinRatio) / 4);
  const carbTargetGrams = Math.round((calorieTarget * carbRatio) / 4);
  const fatTargetGrams = Math.round((calorieTarget * fatRatio) / 9);

  // Nước: khoảng 35ml trên mỗi kg trọng lượng cơ thể
  const waterTargetMl = Math.max(1500, Math.round(params.weight * 35));

  return {
    ...params,
    bmr,
    tdee,
    calorieTarget,
    carbTargetGrams,
    proteinTargetGrams,
    fatTargetGrams,
    waterTargetMl,
  };
}

export const DEFAULT_USER_PROFILE: UserProfile = calculateProfileNutrition({
  gender: 'female',
  age: 26,
  height: 160,
  weight: 54,
  targetWeight: 50,
  activityLevel: 'light',
  goal: 'lose_slow',
});
