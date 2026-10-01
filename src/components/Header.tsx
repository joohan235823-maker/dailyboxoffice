import React from 'react';
import { KeyRound, RefreshCw, Film } from 'lucide-react';

interface HeaderProps {
  onOpenApiKeyModal: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  dataSource: 'live' | 'fallback';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApiKeyModal,
  onRefresh,
  isLoading,
  dataSource,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Film className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-white">
              KOBIS 박스오피스
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 font-normal">
              영화관입장권통합전산망
            </span>
          </div>
        </div>

        {/* Zone 2: Status info & Clean Links */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                dataSource === 'live' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span>
              {dataSource === 'live' ? 'KOBIS OpenAPI 연결됨' : '데이터 캐시/대체 모드'}
            </span>
          </div>
          <span className="text-slate-700" aria-hidden="true">·</span>
          <span>일일 박스오피스 집계 (어제까지 제공)</span>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="데이터 새로고침"
            className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
            aria-label="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">API 키 설정</span>
            <span className="sm:hidden">키</span>
          </button>
        </div>
      </div>
    </header>
  );
};
