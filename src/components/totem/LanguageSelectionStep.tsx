import React from 'react';
import { useTotem } from '../../context/TotemContext';
import { Language } from '../../types/totem';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FlagSpain: React.FC = () => (
  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-white/[0.04] border border-white/20 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
    <svg viewBox="0 0 36 36" className="w-full h-full rounded-full overflow-hidden shrink-0 shadow-inner">
      <rect width="36" height="36" fill="#AA151B" />
      <rect y="9" width="36" height="18" fill="#F1BF00" />
    </svg>
  </div>
);

const FlagBrazil: React.FC = () => (
  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-white/[0.04] border border-white/20 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
    <svg viewBox="0 0 36 36" className="w-full h-full rounded-full overflow-hidden shrink-0 shadow-inner">
      <rect width="36" height="36" fill="#009739" />
      <polygon points="18,5 33,18 18,31 3,18" fill="#FEDD00" />
      <circle cx="18" cy="18" r="7" fill="#012169" />
      <path d="M 12 19 Q 18 16 24 19" stroke="#ffffff" strokeWidth="1.2" fill="none" />
    </svg>
  </div>
);

const FlagUSA: React.FC = () => (
  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-white/[0.04] border border-white/20 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
    <svg viewBox="0 0 36 36" className="w-full h-full rounded-full overflow-hidden shrink-0 shadow-inner">
      <rect width="36" height="36" fill="#B22234" />
      <path d="M0,5.5 h36 M0,11 h36 M0,16.5 h36 M0,22 h36 M0,27.5 h36 M0,33 h36" stroke="#FFFFFF" strokeWidth="2.7" />
      <rect width="16" height="19" fill="#3C3B6E" />
    </svg>
  </div>
);

import { playTapSound } from '../../utils/soundEffects';

interface LanguageOption {
  id: Language;
  code: string;
  title: string;
  subtitle: string;
  welcome: string;
  actionText: string;
  flag: React.ReactNode;
}

export const LanguageSelectionStep: React.FC = () => {
  const { startSession, resetSession } = useTotem();

  const languages: LanguageOption[] = [
    {
      id: 'es',
      code: 'ES',
      title: 'Español',
      welcome: 'Bienvenido',
      subtitle: 'Atención en español',
      actionText: 'Tocar para seleccionar',
      flag: <FlagSpain />,
    },
    {
      id: 'pt',
      code: 'PT',
      title: 'Português',
      welcome: 'Bem-vindo',
      subtitle: 'Atendimento em português',
      actionText: 'Toque para selecionar',
      flag: <FlagBrazil />,
    },
    {
      id: 'en',
      code: 'EN',
      title: 'English',
      welcome: 'Welcome',
      subtitle: 'Service in English',
      actionText: 'Tap to select',
      flag: <FlagUSA />,
    },
  ];

  const handleSelectLanguage = (langId: Language) => {
    playTapSound(1150, 0.04, 0.08);
    startSession(langId);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between items-center px-6 py-10 sm:py-16 select-none bg-[#030305] animate-fade-in">
      {/* Top Bar: Discreet Back Button Only (Logo removed per user instruction) */}
      <div className="w-full max-w-5xl flex items-center justify-between">
        <button
          onClick={resetSession}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] text-zinc-300 text-xs sm:text-sm font-medium transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>

        <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase">
          Idioma / Language
        </span>
      </div>

      {/* Main Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl my-auto py-6">
        {/* Flagship Header */}
        <div className="text-center mb-10 sm:mb-14 animate-fade-in-up">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-3">
            Selecciona tu idioma
          </h2>
          <p className="text-sm sm:text-lg text-zinc-400 font-normal tracking-wide">
            Selecione seu idioma • Select your language
          </p>
        </div>

        {/* 3 Ultra-Luxury Touch Cards with Staggered Entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl px-2">
          {languages.map((lang, idx) => (
            <button
              key={lang.id}
              onClick={() => handleSelectLanguage(lang.id)}
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              className="apple-card apple-card-interactive p-7 sm:p-9 rounded-[32px] sm:rounded-[38px] flex flex-col items-center justify-between text-center cursor-pointer group shadow-2xl transition-all border border-white/[0.08] hover:border-white/30 animate-fade-in-up min-h-[330px] sm:min-h-[360px]"
            >
              {/* Top Country Code Badge */}
              <div className="w-full flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  {lang.welcome}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-mono font-bold text-zinc-300 group-hover:text-white group-hover:border-white/20 transition-colors">
                  {lang.code}
                </span>
              </div>

              {/* Center: Flag Emblem & Typography */}
              <div className="my-auto py-3 flex flex-col items-center">
                <div className="mb-4">
                  {lang.flag}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 group-hover:text-zinc-100 transition-colors">
                  {lang.title}
                </h3>
                <span className="text-xs sm:text-sm text-zinc-400 font-medium">
                  {lang.subtitle}
                </span>
              </div>

              {/* Bottom Action Hint */}
              <div className="w-full pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                <span>{lang.actionText}</span>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Subtle bottom note */}
      <div className="text-center text-xs text-zinc-500 font-medium">
        CISTEC • Asistencia Técnica Especializada
      </div>
    </div>
  );
};
