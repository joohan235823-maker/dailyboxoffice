/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Film,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Filter,
  Sparkles,
  Info,
} from 'lucide-react';
import { DailyBoxOfficeItem, NationFilter, ViewMode } from './types/kobis';
import { fetchDailyBoxOffice } from './services/kobisApi';
import {
  getYesterdayDash,
  dashToKobisDt,
  formatKoreanDate,
} from './utils/dateUtils';
import { Header } from './components/Header';
import { DateController } from './components/DateController';
import { SummaryStats } from './components/SummaryStats';
import { BoxOfficeTable } from './components/BoxOfficeTable';
import { BoxOfficeCards } from './components/BoxOfficeCards';
import { MovieDetailModal } from './components/MovieDetailModal';

export default function App() {
  // Default to yesterday's date (or 2026-09-30 as provided in user brief)
  const initialDate = useMemo(() => {
    const yest = getYesterdayDash();
    return yest || '2026-09-30';
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [items, setItems] = useState<DailyBoxOfficeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('live');

  // Filters & display
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [nationFilter, setNationFilter] = useState<NationFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedMovieCd, setSelectedMovieCd] = useState<string | null>(null);

  // Load box office data whenever date or nation filter changes
  const loadBoxOfficeData = useCallback(async (dateDash: string, nation: NationFilter) => {
    setIsLoading(true);
    const targetDt = dashToKobisDt(dateDash);

    try {
      const result = await fetchDailyBoxOffice(targetDt, {
        repNationCd: nation !== 'ALL' ? nation : undefined,
      });
      setItems(result.list || []);
      setDataSource(result.source);
    } catch (error) {
      console.error('Failed to load box office data:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBoxOfficeData(selectedDate, nationFilter);
  }, [selectedDate, nationFilter, loadBoxOfficeData]);

  // Client-side search filter
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) =>
      item.movieNm.toLowerCase().includes(q) || item.movieCd.includes(q)
    );
  }, [items, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar Contract Navigation */}
      <Header
        onRefresh={() => loadBoxOfficeData(selectedDate, nationFilter)}
        isLoading={isLoading}
        dataSource={dataSource}
      />

      {/* Hero Atmosphere Section */}
      <div className="relative border-b border-slate-800 bg-slate-900/40 overflow-hidden">
        {/* Ambient theater glow background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/cinema_theater_hall_1790843745318.jpg"
            alt="영화관 상영관 분위기"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>영화진흥위원회 KOBIS 공식 OpenAPI 연동</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              일일 박스오피스 실시간 랭킹
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              어제까지 집계된 전국 영화관 통합전산망의 공식 관객수, 매출액, 스크린 점유율을 실시간으로 확인하고 영화별 상세 정보와 출연진을 조회할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Date Controller & Constraint */}
        <DateController
          selectedDate={selectedDate}
          onSelectDate={(newDate) => setSelectedDate(newDate)}
          isLoading={isLoading}
        />

        {/* High-level Statistics */}
        <SummaryStats
          items={items}
          onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
        />

        {/* View & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Nation Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start">
            <button
              onClick={() => setNationFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                nationFilter === 'ALL'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              전체 영화
            </button>
            <button
              onClick={() => setNationFilter('K')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                nationFilter === 'K'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              한국영화
            </button>
            <button
              onClick={() => setNationFilter('F')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                nationFilter === 'F'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              외국영화
            </button>
          </div>

          {/* Search and Layout Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="상영작 검색..."
                className="w-44 sm:w-56 bg-slate-900 border border-slate-800 focus:border-amber-400/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="표 형식으로 보기"
                aria-label="테이블 뷰"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="카드 형식으로 보기"
                aria-label="카드 뷰"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Box Office Data Content */}
        {viewMode === 'table' ? (
          <BoxOfficeTable
            items={filteredItems}
            onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
            isLoading={isLoading}
          />
        ) : (
          <BoxOfficeCards
            items={filteredItems}
            onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
            isLoading={isLoading}
          />
        )}

        {/* Footer Note */}
        <div className="pt-6 pb-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            데이터 출처: 영화진흥위원회 영화관입장권통합전산망 (KOBIS) OpenAPI
          </div>
          <div className="flex items-center gap-3">
            <span>기준 일자: {formatKoreanDate(selectedDate)}</span>
            <span aria-hidden="true">·</span>
            <span>조회 대상: 일일 박스오피스 Top 10</span>
          </div>
        </div>
      </main>

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movieCd={selectedMovieCd}
        onClose={() => setSelectedMovieCd(null)}
      />
    </div>
  );
}
