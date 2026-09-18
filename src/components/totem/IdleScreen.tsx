import React from 'react';
import { useTotem } from '../../context/TotemContext';

export const IdleScreen: React.FC = () => {
  const { goToLanguageSelection } = useTotem();

  return (
    <div 
      onClick={goToLanguageSelection}
      className="relative w-full h-full min-h-screen flex flex-col justify-between items-center px-6 py-12 sm:py-20 select-none cursor-pointer overflow-hidden bg-[#030305] transition-all"
    >
      {/* Subtle radial ambient highlight behind center logo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[85vw] max-w-[800px] h-[85vw] max-h-[800px] rounded-full bg-blue-600/[0.03] blur-[140px]" />
      </div>

      {/* Top spacing balance for 27" vertical display */}
      <div className="w-full h-8 sm:h-16" />

      {/* Main Center Stage: Pure, Clean CISTEC Logo with breathing glow */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl w-full my-auto px-4">
        <div className="relative w-full flex justify-center transform transition-transform duration-700 hover:scale-[1.02] active:scale-[0.99]">
          {/* Soft breathing aura behind the logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-blue-600/[0.1] blur-[80px] rounded-full animate-pulse-subtle pointer-events-none" />
          
          <img 
            src="/logos/logo_princi.png" 
            alt="CISTEC - Servicio Técnico Especializado"
            className="relative z-10 w-full max-w-[340px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[640px] h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)] pointer-events-none"
          />
        </div>
      </div>

      {/* Bottom Luxury Touch Call to Action with Animated Glowing Border */}
      <div className="relative z-10 flex flex-col items-center gap-5 mb-4 sm:mb-8 text-center">
        <div className="relative p-[1.5px] rounded-full overflow-hidden group shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer">
          {/* Animated Rotating Color Glow Ring */}
          <div className="absolute -inset-[150%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_220deg,#0071e3_270deg,#38bdf8_315deg,#818cf8_350deg,#0071e3_360deg)] opacity-70 blur-[2px]" />

          {/* Inner Obsidian Glass Container */}
          <div className="relative px-8 py-4 sm:px-14 sm:py-5 rounded-full bg-[#08080c]/95 hover:bg-[#101018] border border-white/[0.1] text-white text-lg sm:text-2xl font-semibold tracking-wide flex items-center gap-3.5 backdrop-blur-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
            <span>Toca la pantalla para comenzar</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-400 font-medium tracking-wide">
          <span>Toque na tela para começar</span>
          <span className="text-zinc-600">•</span>
          <span>Tap to begin</span>
        </div>
      </div>
    </div>
  );
};

