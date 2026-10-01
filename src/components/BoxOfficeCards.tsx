import React from 'react';
import { ArrowUp, ArrowDown, Minus, Sparkles, Film, ChevronRight } from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber, formatKoreanCurrency } from '../utils/dateUtils';

interface BoxOfficeCardsProps {
  items: DailyBoxOfficeItem[];
  onSelectMovie: (movieCd: string) => void;
  isLoading: boolean;
}

export const BoxOfficeCards: React.FC<BoxOfficeCardsProps> = ({
  items,
  onSelectMovie,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 animate-pulse h-48"
          />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const rankNum = parseInt(item.rank, 10);
        const rankInten = parseInt(item.rankInten, 10);
        const audiChange = parseFloat(item.audiChange);
        const share = parseFloat(item.salesShare || '0');

        return (
          <div
            key={item.movieCd || item.rank}
            onClick={() => onSelectMovie(item.movieCd)}
            className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header with Rank & Change */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold font-mono ${
                      rankNum === 1
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : rankNum === 2
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40'
                        : rankNum === 3
                        ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.rank}
                  </span>

                  {item.rankOldAndNew === 'NEW' ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                      <Sparkles className="w-3 h-3" />
                      NEW
                    </span>
                  ) : rankInten > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-xs text-rose-400 font-mono font-semibold">
                      <ArrowUp className="w-3.5 h-3.5" />
                      {rankInten}
                    </span>
                  ) : rankInten < 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-xs text-blue-400 font-mono font-semibold">
                      <ArrowDown className="w-3.5 h-3.5" />
                      {Math.abs(rankInten)}
                    </span>
                  ) : (
                    <span className="text-slate-600 inline-flex items-center">
                      <Minus className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400">
                  점유율 <strong className="font-mono text-slate-200">{item.salesShare}%</strong>
                </div>
              </div>

              {/* Title & Metadata */}
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                {item.movieNm}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>개봉 {item.openDt}</span>
                <span aria-hidden="true">·</span>
                <span>{item.scrnCnt}개 스크린</span>
              </div>

              {/* Share Progress Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(3, share))}%` }}
                />
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-end justify-between">
              <div>
                <div className="text-[11px] text-slate-400">당일 관객수</div>
                <div className="text-base font-bold font-mono tabular-nums text-white flex items-baseline gap-1">
                  {formatNumber(item.audiCnt)}
                  <span className="text-xs text-slate-400 font-normal">명</span>
                  {item.audiChange && (
                    <span
                      className={`text-[10px] font-mono ml-1 ${
                        audiChange > 0
                          ? 'text-rose-400'
                          : audiChange < 0
                          ? 'text-blue-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {audiChange > 0 ? `+${audiChange}%` : `${audiChange}%`}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  누적 {formatNumber(item.audiAcc)}명 · {formatKoreanCurrency(item.salesAcc)}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
                <span>상세</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
