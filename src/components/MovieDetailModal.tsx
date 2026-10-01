import React, { useEffect, useState } from 'react';
import {
  X,
  Clock,
  Calendar,
  Globe,
  Film,
  Users,
  Award,
  Building,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { MovieInfo } from '../types/kobis';
import { fetchMovieDetail } from '../services/kobisApi';

interface MovieDetailModalProps {
  movieCd: string | null;
  onClose: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movieCd,
  onClose,
}) => {
  const [movie, setMovie] = useState<MovieInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<'live' | 'fallback'>('live');

  useEffect(() => {
    if (!movieCd) {
      setMovie(null);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    fetchMovieDetail(movieCd)
      .then((res) => {
        if (!isCancelled) {
          setMovie(res.info);
          setSource(res.source);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching movie detail', err);
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [movieCd]);

  if (!movieCd) return null;

  // Grade color helper
  const getWatchGradeStyle = (grade?: string) => {
    if (!grade) return 'bg-slate-800 text-slate-300 border-slate-700';
    if (grade.includes('전체')) return 'bg-emerald-950 text-emerald-300 border-emerald-700/50';
    if (grade.includes('12')) return 'bg-blue-950 text-blue-300 border-blue-700/50';
    if (grade.includes('15')) return 'bg-amber-950 text-amber-300 border-amber-700/50';
    if (grade.includes('청소년') || grade.includes('18')) return 'bg-rose-950 text-rose-300 border-rose-700/50';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const watchGrade = movie?.audits?.[0]?.watchGradeNm;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              KOBIS 영화 상세 정보
            </span>
            {source === 'live' ? (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-700/40 px-1.5 py-0.5 rounded">
                실시간 연동
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                KOBIS 마스터 데이터
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mb-3" />
            <p className="text-sm text-slate-400">영화 상세 정보를 불러오는 중입니다...</p>
          </div>
        ) : movie ? (
          <div className="p-6 space-y-6">
            {/* Title Section */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {watchGrade && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${getWatchGradeStyle(
                      watchGrade
                    )}`}
                  >
                    {watchGrade}
                  </span>
                )}
                {movie.prdtStatNm && (
                  <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {movie.prdtStatNm}
                  </span>
                )}
                {movie.typeNm && (
                  <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {movie.typeNm}
                  </span>
                )}
                <span className="text-xs text-slate-500 font-mono">
                  영화코드: {movie.movieCd}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight">
                {movie.movieNm}
              </h2>
              {movie.movieNmEn && (
                <p className="text-sm text-slate-400 font-sans mt-0.5">
                  {movie.movieNmEn}
                  {movie.movieNmOg ? ` (${movie.movieNmOg})` : ''}
                </p>
              )}
            </div>

            {/* Quick Metadata Bar (Zero-Pill discipline) */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-slate-500 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  개봉일
                </div>
                <div className="font-semibold text-slate-200">
                  {movie.openDt
                    ? `${movie.openDt.slice(0, 4)}-${movie.openDt.slice(
                        4,
                        6
                      )}-${movie.openDt.slice(6, 8)}`
                    : `${movie.prdtYear}년`}
                </div>
              </div>

              <div>
                <div className="text-slate-500 flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  상영시간
                </div>
                <div className="font-semibold text-slate-200">
                  {movie.showTm ? `${movie.showTm}분` : '-'}
                </div>
              </div>

              <div>
                <div className="text-slate-500 flex items-center gap-1 mb-1">
                  <Film className="w-3.5 h-3.5 text-purple-400" />
                  장르
                </div>
                <div className="font-semibold text-slate-200 truncate">
                  {movie.genres?.map((g) => g.genreNm).join(', ') || '-'}
                </div>
              </div>

              <div>
                <div className="text-slate-500 flex items-center gap-1 mb-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  제작국가
                </div>
                <div className="font-semibold text-slate-200 truncate">
                  {movie.nations?.map((n) => n.nationNm).join(', ') || '-'}
                </div>
              </div>
            </div>

            {/* Directors */}
            {movie.directors && movie.directors.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  감독
                </h4>
                <div className="flex flex-wrap gap-2">
                  {movie.directors.map((dir, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs"
                    >
                      <span className="font-medium text-white">{dir.peopleNm}</span>
                      {dir.peopleNmEn && (
                        <span className="text-slate-400 ml-1.5 font-light">
                          ({dir.peopleNmEn})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cast & Actors */}
            {movie.actors && movie.actors.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  출연 배우 및 배역
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {movie.actors.map((actor, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/60 border border-slate-800/80 rounded-lg px-3 py-2 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-medium text-slate-200">
                          {actor.peopleNm}
                        </span>
                        {actor.peopleNmEn && (
                          <span className="text-[11px] text-slate-400 ml-1">
                            {actor.peopleNmEn}
                          </span>
                        )}
                      </div>
                      {actor.cast && (
                        <span className="text-[11px] text-amber-400 font-medium">
                          {actor.cast} 역
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Screening Formats */}
            {movie.showTypes && movie.showTypes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  상영 포맷
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {movie.showTypes.map((st, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-xs text-slate-300"
                    >
                      {st.showTypeGroupNm} {st.showTypeNm !== st.showTypeGroupNm ? `(${st.showTypeNm})` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Companies */}
            {movie.companys && movie.companys.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  참여 영화사
                </h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {movie.companys.map((comp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-950/40 px-3 py-1.5 rounded border border-slate-800/60"
                    >
                      <span>{comp.companyNm}</span>
                      <span className="text-[11px] text-slate-400">
                        {comp.companyPartNm}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Search Link */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                추가 정보가 필요하신가요?
              </span>
              <a
                href={`https://search.naver.com/search.naver?query=영화+${encodeURIComponent(
                  movie.movieNm
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>네이버 영화 검색</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            영화 정보를 불러올 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
