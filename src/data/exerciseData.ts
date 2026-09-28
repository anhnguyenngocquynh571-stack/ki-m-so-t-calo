import { ExerciseItem } from '../types/nutrition';

export const EXERCISE_CATEGORIES = [
  { id: 'all', label: 'Tất cả bài tập' },
  { id: 'cardio', label: 'Cardio & Chạy bộ' },
  { id: 'sports', label: 'Thể thao đối kháng' },
  { id: 'strength', label: 'Gym & Kháng lực' },
  { id: 'daily_activity', label: 'Hoạt động thường nhật' },
] as const;

export const DEFAULT_EXERCISES: ExerciseItem[] = [
  {
    id: 'chay_bo_trung_binh',
    name: 'Chạy bộ (tốc độ vừa ~ 8 km/h)',
    category: 'cardio',
    met: 8.3,
    description: 'Chạy bộ ngoài trời hoặc máy chạy bộ tốc độ ổn định',
  },
  {
    id: 'chay_bo_nhanh',
    name: 'Chạy bộ nhanh (~ 10-11 km/h)',
    category: 'cardio',
    met: 11.0,
    description: 'Chạy cường độ cao đốt mỡ mạnh mẽ',
  },
  {
    id: 'di_bo_nhanh',
    name: 'Đi bộ nhanh (~ 5-6 km/h)',
    category: 'cardio',
    met: 4.3,
    description: 'Đi bộ nhanh đánh tay, nâng nhịp tim nhẹ nhàng',
  },
  {
    id: 'di_bo_thu_gian',
    name: 'Đi bộ thong thả / dạo mát',
    category: 'daily_activity',
    met: 2.8,
    description: 'Đi dạo nhẹ nhàng sau bữa ăn',
  },
  {
    id: 'dap_xe_ngoai_troi',
    name: 'Đạp xe đạp (tốc độ vừa 15-18 km/h)',
    category: 'cardio',
    met: 6.8,
    description: 'Đạp xe đường phố hoặc công viên',
  },
  {
    id: 'nhay_day_nhanh',
    name: 'Nhảy dây cường độ vừa - nhanh',
    category: 'cardio',
    met: 10.0,
    description: 'Nhảy dây liên tục, đốt calo tối ưu',
  },
  {
    id: 'boi_loi_tu_do',
    name: 'Bơi lội (bơi sải / bơi ếch)',
    category: 'cardio',
    met: 7.0,
    description: 'Bơi lội toàn thân phát triển cơ bắp',
  },
  {
    id: 'gym_nang_ta',
    name: 'Tập Gym tạ / Thể hình (kháng lực)',
    category: 'strength',
    met: 5.5,
    description: 'Nâng tạ tự do, máy tập thể hình, nghỉ giữa hiệp vừa phải',
  },
  {
    id: 'calisthenics_hit_dat',
    name: 'Calisthenics (Hít đất, kéo xà, squat bodyweight)',
    category: 'strength',
    met: 6.0,
    description: 'Tập luyện với trọng lượng cơ thể',
  },
  {
    id: 'yoga_vinyasa',
    name: 'Tập Yoga (Vinyasa / Hatha Yoga)',
    category: 'daily_activity',
    met: 3.2,
    description: 'Kéo giãn cơ, giữ thăng bằng và hít thở sâu',
  },
  {
    id: 'pilates_tham',
    name: 'Tập Pilates (thảm hoặc máy)',
    category: 'strength',
    met: 4.0,
    description: 'Siết cơ bụng, ổn định cột sống và thon gọn vóc dáng',
  },
  {
    id: 'cau_long',
    name: 'Đánh cầu lông (giao lưu / thi đấu)',
    category: 'sports',
    met: 6.5,
    description: 'Di chuyển bước chân linh hoạt và đập cầu',
  },
  {
    id: 'bong_da',
    name: 'Đá bóng (sân cỏ nhân tạo 5-7 người)',
    category: 'sports',
    met: 8.0,
    description: 'Tranh chấp bóng, bứt tốc và vận động liên tục',
  },
  {
    id: 'bong_ro',
    name: 'Chơi bóng rổ',
    category: 'sports',
    met: 7.5,
    description: 'Ném bóng, tranh bóng và di chuyển sân',
  },
  {
    id: 'pickleball',
    name: 'Chơi Pickleball / Tennis giao lưu',
    category: 'sports',
    met: 6.0,
    description: 'Di chuyển phản xạ nhanh trên sân đấu',
  },
  {
    id: 'leo_cau_thang',
    name: 'Leo cầu thang bộ',
    category: 'cardio',
    met: 8.5,
    description: 'Leo thang dốc, săn chắc cơ đùi và mông',
  },
  {
    id: 'don_dep_nha_cua',
    name: 'Dọn dẹp nhà cửa, lau sàn, quét nhà',
    category: 'daily_activity',
    met: 3.3,
    description: 'Làm việc nhà liên tục giúp đốt cháy năng lượng tích cực',
  },
];

/**
 * Tính số calo tiêu hao dựa trên MET, cân nặng (kg) và thời gian (phút)
 * Công thức y khoa: Calories = MET * Cân nặng(kg) * (Thời gian / 60)
 */
export function calculateBurnedCalories(met: number, weightKg: number, durationMinutes: number): number {
  if (weightKg <= 0 || durationMinutes <= 0) return 0;
  const burned = met * weightKg * (durationMinutes / 60);
  return Math.round(burned);
}
