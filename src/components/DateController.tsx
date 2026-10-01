import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import {
  formatKoreanDate,
  formatDateToDash,
  getYesterdayDash,
} from '../utils/dateUtils';

interface DateControllerProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  isLoading: boolean;
}

export const DateController: React.FC<DateControllerProps> = ({
  selectedDate,
  onSelectDate,
  isLoading,
}) => {
  const yesterdayDash = getYesterdayDash();

  // Shift by days
  const handleShiftDay = (delta: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + delta);
    const newDateStr = formatDateToDash(current);
    if (newDateStr <= yesterdayDash) {
      onSelectDate(newDateStr);
    }
  };

  const isNextDisabled = selectedDate >= yesterdayDash || isLoading;

  // Shortcuts
  const setRelativeDaysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    onSelectDate(formatDateToDash(d));
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Date Display and Stepper */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => handleShiftDay(-1)}
              disabled={isLoading}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors disabled:opacity-40"
              title="이전 날짜 (하루 전)"
              aria-label="이전 날짜"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="px-3 py-1 text-center min-w-[170px]">
              <div className="text-base font-semibold text-white tracking-tight">
                {formatKoreanDate(selectedDate)}
              </div>
            </div>

            <button
              onClick={() => handleShiftDay(1)}
              disabled={isNextDisabled}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title={
                isNextDisabled
                  ? '오늘 이후 날짜는 조회할 수 없습니다'
                  : '다음 날짜 (하루 후)'
              }
              aria-label="다음 날짜"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* HTML5 Date Picker Input */}
          <div className="relative inline-flex items-center">
            <label
              htmlFor="boxoffice-date-input"
              className="sr-only"
            >
              조회 날짜 선택
            </label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-2 rounded-lg text-xs text-slate-200 transition-colors cursor-pointer">
              <CalendarIcon className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                id="boxoffice-date-input"
                type="date"
                value={selectedDate}
                max={yesterdayDash}
                disabled={isLoading}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && val <= yesterdayDash) {
                    onSelectDate(val);
                  }
                }}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer scheme-dark"
              />
            </div>
          </div>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">빠른 선택:</span>
          <button
            onClick={() => setRelativeDaysAgo(1)}
            disabled={isLoading}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedDate === yesterdayDash
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            어제
          </button>
          <button
            onClick={() => setRelativeDaysAgo(3)}
            disabled={isLoading}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors whitespace-nowrap"
          >
            3일 전
          </button>
          <button
            onClick={() => setRelativeDaysAgo(7)}
            disabled={isLoading}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors whitespace-nowrap"
          >
            1주일 전
          </button>
          <button
            onClick={() => onSelectDate('2026-09-30')}
            disabled={isLoading}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedDate === '2026-09-30'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            2026-09-30 (요청 예시)
          </button>
        </div>
      </div>

      {/* Notice about date constraint */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
        <span>
          영진위(KOBIS) 박스오피스는 일일 상영 마감 후 집계되므로,{' '}
          <strong className="text-slate-300 font-medium">오늘 이전 날짜(어제까지)</strong>만
          조회 가능하도록 제한되어 있습니다.
        </span>
      </div>
    </div>
  );
};
