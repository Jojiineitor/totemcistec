import React from 'react';
import { useTotem } from '../../context/TotemContext';
import { RotateCcw, Globe } from 'lucide-react';

export const TotemHeader: React.FC = () => {
  const { currentStep, language, t, resetSession, openLanguageModal } = useTotem();

  // Completely hidden on idle and language selection
  if (currentStep === 'idle' || currentStep === 'language_selection') {
    return null;
  }

  const langNames = {
    es: 'Español',
    pt: 'Português',
    en: 'English'
  };

  return (
    <header className="w-full bg-[#030305]/90 backdrop-blur-2xl border-b border-white/[0.06] px-6 py-3 flex items-center justify-between z-30 transition-all duration-300">
      {/* Brand: clean, subtle cistec logo */}
      <div className="flex items-center space-x-3">
        <img 
          src="/logos/logo_exact.png" 
          alt="CISTEC" 
          className="h-7 w-auto object-contain opacity-95 shrink-0"
        />
      </div>

      {/* Discrete Controls: Language & Reset */}
      <div className="flex items-center space-x-3">
        <button
          onClick={openLanguageModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all active:scale-95"
          title="Cambiar idioma / Change language"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span className="uppercase tracking-wider font-semibold">{language}</span>
          <span className="text-zinc-400 hidden sm:inline">({langNames[language]})</span>
        </button>

        <button
          onClick={resetSession}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-white/[0.06] hover:border-rose-500/30 text-xs font-medium transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.header.reset}</span>
        </button>
      </div>
    </header>
  );
};

