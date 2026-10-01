import React from 'react';
import { ArrowUp, ArrowDown, Minus, Sparkles, ExternalLink } from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber, formatKoreanCurrency } from '../utils/dateUtils';

interface BoxOfficeTableProps {
  items: DailyBoxOfficeItem[];
  onSelectMovie: (movieCd: string) => void;
  isLoading: boolean;
}

export const BoxOfficeTable: React.FC<BoxOfficeTableProps> = ({
  items,
  onSelectMovie,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mb-3" />
        <p className="text-sm text-slate-400">박스오피스 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center">
        <p className="text-base text-slate-300 font-medium mb-1">
          해당 날짜의 박스오피스 데이터가 없습니다
        </p>
        <p className="text-xs text-slate-500">
          다른 날짜를 선택하거나 API 키 설정을 확인해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 text-center w-16">순위</th>
              <th className="py-3.5 px-4 text-center w-20">변동</th>
              <th className="py-3.5 px-4">영화명</th>
              <th className="py-3.5 px-4 text-center w-24">개봉일</th>
              <th className="py-3.5 px-4 text-right">당일 관객수</th>
              <th className="py-3.5 px-4 text-right">누적 관객수</th>
              <th className="py-3.5 px-4 text-right">매출액 점유율</th>
              <th className="py-3.5 px-4 text-right">당일 매출액</th>
              <th className="py-3.5 px-4 text-right w-28">스크린/상영</th>
              <th className="py-3.5 px-4 text-center w-20">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {items.map((item) => {
              const rankNum = parseInt(item.rank, 10);
              const rankInten = parseInt(item.rankInten, 10);
              const audiChange = parseFloat(item.audiChange);
              const share = parseFloat(item.salesShare || '0');

              return (
                <tr
                  key={item.movieCd || item.rank}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectMovie(item.movieCd)}
                >
                  {/* Rank Badge */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm ${
                        rankNum === 1
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : rankNum === 2
                          ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40'
                          : rankNum === 3
                          ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>

                  {/* Rank Inten Change */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {item.rankOldAndNew === 'NEW' ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                        <Sparkles className="w-3 h-3" />
                        NEW
                      </span>
                    ) : rankInten > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-rose-400 font-mono font-semibold">
                        <ArrowUp className="w-3 h-3" />
                        {rankInten}
                      </span>
                    ) : rankInten < 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-blue-400 font-mono font-semibold">
                        <ArrowDown className="w-3 h-3" />
                        {Math.abs(rankInten)}
                      </span>
                    ) : (
                      <span className="text-slate-600 inline-flex items-center">
                        <Minus className="w-3 h-3" />
                      </span>
                    )}
                  </td>

                  {/* Movie Title & Code */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white group-hover:text-amber-300 transition-colors text-sm">
                      {item.movieNm}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      코드: {item.movieCd}
                    </div>
                  </td>

                  {/* Open Date */}
                  <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-400 whitespace-nowrap">
                    {item.openDt || '-'}
                  </td>

                  {/* Daily Audience */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="font-bold text-slate-100 font-mono tabular-nums text-sm">
                      {formatNumber(item.audiCnt)}
                      <span className="text-slate-500 font-normal text-xs ml-0.5">명</span>
                    </div>
                    {item.audiChange && (
                      <div
                        className={`text-[10px] font-mono tabular-nums ${
                          audiChange > 0
                            ? 'text-rose-400'
                            : audiChange < 0
                            ? 'text-blue-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {audiChange > 0 ? `+${audiChange}%` : `${audiChange}%`}
                      </div>
                    )}
                  </td>

                  {/* Cumulative Audience */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="font-semibold text-slate-300 font-mono tabular-nums">
                      {formatNumber(item.audiAcc)}
                      <span className="text-slate-500 font-normal text-[11px] ml-0.5">명</span>
                    </div>
                  </td>

                  {/* Sales Share */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="font-mono tabular-nums text-slate-200 font-medium">
                      {item.salesShare}%
                    </div>
                    <div className="w-20 ml-auto bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(2, share))}%` }}
                      />
                    </div>
                  </td>

                  {/* Daily Sales Amount */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="font-medium text-slate-200 font-mono tabular-nums">
                      {formatKoreanCurrency(item.salesAmt)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                      누적 {formatKoreanCurrency(item.salesAcc)}
                    </div>
                  </td>

                  {/* Screen & Show Count */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-400 whitespace-nowrap">
                    <div>{formatNumber(item.scrnCnt)}관</div>
                    <div className="text-[10px] text-slate-500">{formatNumber(item.showCnt)}회 상영</div>
                  </td>

                  {/* Action Link */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMovie(item.movieCd);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-md transition-colors"
                      title="영화 상세 정보 보기"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
