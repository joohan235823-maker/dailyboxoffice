import React, { useState } from 'react';
import { X, KeyRound, Check, RotateCcw, ExternalLink, ShieldCheck } from 'lucide-react';
import {
  DEFAULT_KOBIS_KEY,
  DEFAULT_FALLBACK_KEY,
  ENV_KOBIS_KEY,
  isEnvKeyConfigured,
  getStoredApiKey,
  setStoredApiKey,
  resetApiKey,
} from '../services/kobisApi';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [isSaved, setIsSaved] = useState(false);
  const hasEnvKey = isEnvKeyConfigured();

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onKeyUpdated();
      onClose();
    }, 500);
  };

  const handleResetToEnv = () => {
    resetApiKey();
    setApiKey(DEFAULT_KOBIS_KEY);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onKeyUpdated();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">KOBIS OpenAPI 인증키 설정</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Environment Variable Indicator */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">
                환경 변수 (<code className="text-amber-400 font-mono">VITE_KOBIS_API_KEY</code>)
              </div>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                {hasEnvKey ? (
                  <>
                    환경 변수가 정상 감지되었습니다. (
                    <span className="font-mono text-slate-300">
                      {ENV_KOBIS_KEY.slice(0, 6)}...{ENV_KOBIS_KEY.slice(-4)}
                    </span>
                    )
                  </>
                ) : (
                  <>
                    <code className="text-slate-300">.env</code> 파일에{' '}
                    <code className="text-amber-300">VITE_KOBIS_API_KEY</code>를 지정하면
                    자동으로 로드됩니다.
                  </>
                )}
              </p>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              현재 활성 API KEY
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API 키 입력 (VITE_KOBIS_API_KEY)"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>자신만의 키가 필요하신가요?</span>
            <a
              href="https://www.kobis.or.kr/kobisopenapi/homepg/main/main.do"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              <span>KOBIS 키 발급</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleResetToEnv}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            title="환경 변수 값으로 재설정"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            환경 변수 값으로 복원
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              닫기
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-semibold"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  저장됨
                </>
              ) : (
                '저장'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
