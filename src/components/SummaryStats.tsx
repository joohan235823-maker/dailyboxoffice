import React from 'react';
import { Users, DollarSign, Trophy, Clapperboard } from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber, formatKoreanCurrency } from '../utils/dateUtils';

interface SummaryStatsProps {
  items: DailyBoxOfficeItem[];
  onSelectMovie: (movieCd: string) => void;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ items, onSelectMovie }) => {
  if (!items || items.length === 0) return null;

  const totalAudience = items.reduce((sum, item) => sum + parseInt(item.audiCnt || '0', 10), 0);
  const totalSales = items.reduce((sum, item) => sum + parseInt(item.salesAmt || '0', 10), 0);
  const top1Movie = items[0];

  const totalScreens = items.reduce((sum, item) => sum + parseInt(item.scrnCnt || '0', 10), 0);
  const totalShows = items.reduce((sum, item) => sum + parseInt(item.showCnt || '0', 10), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1st Place Highlight */}
      <div
        onClick={() => top1Movie && onSelectMovie(top1Movie.movieCd)}
        className="cursor-pointer group relative bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/30 hover:border-amber-500/60 rounded-xl p-4 transition-all"
      >
        <div className="flex items-center justify-between text-xs text-amber-400 mb-2">
          <span className="font-semibold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            일일 박스오피스 1위
          </span>
          <span className="text-[11px] text-amber-300/80">
            점유율 {top1Movie?.salesShare || '0'}%
          </span>
        </div>
        <div className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors truncate">
          {top1Movie?.movieNm || '-'}
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
          <span>
            관객 <strong className="font-mono tabular-nums text-slate-200">{formatNumber(top1Movie?.audiCnt || 0)}</strong>명
          </span>
          <span aria-hidden="true">·</span>
          <span>
            누적 <strong className="font-mono tabular-nums text-slate-200">{formatNumber(top1Movie?.audiAcc || 0)}</strong>명
          </span>
        </div>
      </div>

      {/* Total Daily Audience */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            일일 총 관객수 (Top 10)
          </span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-white">
          {formatNumber(totalAudience)}
          <span className="text-sm font-normal text-slate-400 ml-1">명</span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          극장 상위 10개 작품 관람객 합계
        </div>
      </div>

      {/* Total Daily Sales */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            일일 총 매출액
          </span>
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-white">
          {formatKoreanCurrency(totalSales)}
        </div>
        <div className="mt-2 text-xs text-slate-400 font-mono tabular-nums">
          {formatNumber(totalSales)}원
        </div>
      </div>

      {/* Total Screens & Screenings */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Clapperboard className="w-3.5 h-3.5 text-purple-400" />
            총 스크린 / 상영 회수
          </span>
        </div>
        <div className="text-xl font-bold font-mono tabular-nums text-white">
          {formatNumber(totalScreens)}
          <span className="text-xs font-normal text-slate-400 mr-2">개관</span>
          <span className="text-slate-600 font-normal">/</span>{' '}
          {formatNumber(totalShows)}
          <span className="text-xs font-normal text-slate-400">회</span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          전국 주요 영화관 상영 규모
        </div>
      </div>
    </div>
  );
};
