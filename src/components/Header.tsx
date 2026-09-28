import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, PlusCircle, Sparkles, Heart } from 'lucide-react';
import { formatDateToVietnamese, getTodayDateString } from '../utils/storage';

interface HeaderProps {
  currentTab: 'daily' | 'library' | 'exercise' | 'weekly' | 'tdee';
  setCurrentTab: (tab: 'daily' | 'library' | 'exercise' | 'weekly' | 'tdee') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenQuickAdd: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  selectedDate,
  setSelectedDate,
  onOpenQuickAdd,
}) => {
  const todayStr = getTodayDateString();

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const prevStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setSelectedDate(prevStr);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const nextStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setSelectedDate(nextStr);
  };

  const handleTodayClick = () => {
    setSelectedDate(todayStr);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/80 shadow-xs shadow-rose-100/20">
      {/* 3-Zone Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark in Pink & White */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-rose-300/40">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <button
              onClick={() => setCurrentTab('daily')}
              className="text-xl font-extrabold tracking-tight bg-linear-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
            >
              CaloTrack
            </button>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
              Pink & Fit
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-rose-50/50 p-1 rounded-2xl border border-rose-100">
            <button
              onClick={() => setCurrentTab('daily')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentTab === 'daily'
                  ? 'bg-white text-rose-600 shadow-xs shadow-rose-200/50 font-bold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
              }`}
            >
              🌸 Nhật ký ngày
            </button>
            <button
              onClick={() => setCurrentTab('library')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentTab === 'library'
                  ? 'bg-white text-rose-600 shadow-xs shadow-rose-200/50 font-bold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
              }`}
            >
              🥗 Thư viện món ăn
            </button>
            <button
              onClick={() => setCurrentTab('exercise')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentTab === 'exercise'
                  ? 'bg-white text-rose-600 shadow-xs shadow-rose-200/50 font-bold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
              }`}
            >
              🏃‍♀️ Vận động
            </button>
            <button
              onClick={() => setCurrentTab('weekly')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentTab === 'weekly'
                  ? 'bg-white text-rose-600 shadow-xs shadow-rose-200/50 font-bold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
              }`}
            >
              📊 Thống kê tuần
            </button>
            <button
              onClick={() => setCurrentTab('tdee')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentTab === 'tdee'
                  ? 'bg-white text-rose-600 shadow-xs shadow-rose-200/50 font-bold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
              }`}
            >
              🎯 Tính TDEE
            </button>
          </nav>

          {/* Zone 3: Primary Action Button in Soft Vibrant Pink */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenQuickAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-[0.98] rounded-xl shadow-xs shadow-rose-200 transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ghi món ăn</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Switcher Ribbon in gentle pink tint */}
      {currentTab === 'daily' && (
        <div className="bg-rose-50/40 border-t border-rose-100/70 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevDay}
                aria-label="Ngày trước đó"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-rose-200/70 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2 bg-white border border-rose-200/70 px-3.5 py-1.5 rounded-xl shadow-2xs">
                <CalendarIcon className="w-4 h-4 text-rose-500" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                  {formatDateToVietnamese(selectedDate)}
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                  className="w-5 h-5 opacity-0 absolute cursor-pointer"
                  title="Chọn ngày trên lịch"
                />
              </div>

              <button
                onClick={handleNextDay}
                aria-label="Ngày tiếp theo"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-rose-200/70 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {selectedDate !== todayStr && (
                <button
                  onClick={handleTodayClick}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-100/60 hover:bg-rose-100 px-3 py-1 rounded-lg transition-colors border border-rose-200/50"
                >
                  Về hôm nay
                </button>
              )}
            </div>

            {/* Micro Indicators */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-rose-400 font-medium">
              <span>Đơn vị: kcal & gram</span>
              <span aria-hidden="true">·</span>
              <span>Chuẩn y khoa Mifflin-St Jeor</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Tab Bar Header for quick switching on phone */}
      <div className="flex md:hidden border-t border-rose-100 bg-white px-2 py-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => setCurrentTab('daily')}
          className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
            currentTab === 'daily' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-rose-50'
          }`}
        >
          Nhật ký
        </button>
        <button
          onClick={() => setCurrentTab('library')}
          className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
            currentTab === 'library' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-rose-50'
          }`}
        >
          Thư viện món
        </button>
        <button
          onClick={() => setCurrentTab('exercise')}
          className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
            currentTab === 'exercise' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-rose-50'
          }`}
        >
          Vận động
        </button>
        <button
          onClick={() => setCurrentTab('weekly')}
          className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
            currentTab === 'weekly' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-rose-50'
          }`}
        >
          Thống kê
        </button>
        <button
          onClick={() => setCurrentTab('tdee')}
          className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
            currentTab === 'tdee' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-rose-50'
          }`}
        >
          TDEE
        </button>
      </div>
    </header>
  );
};
