import React from 'react';
import { useTotem } from '../../context/TotemContext';
import { BrandId } from '../../types/totem';
import { 
  Wrench, 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight 
} from 'lucide-react';
import { playTapSound } from '../../utils/soundEffects';

interface BrandCardConfig {
  id: BrandId;
  name: string;
  badge: string;
  taglineKey: 'apple' | 'samsung' | 'dji' | 'xiaomi' | 'joog' | 'general';
  theme: {
    bg: string;
    border: string;
    hoverBorder: string;
    glow: string;
    accent: string;
    textColor: string;
  };
  symbol: string;
  icon: React.ReactNode;
}

export const ServiceSelectionStep: React.FC = () => {
  const { setStep, createTicket, t } = useTotem();

  const brandConfigs: BrandCardConfig[] = [
    {
      id: 'apple',
      name: 'Apple',
      badge: 'iOS & macOS',
      taglineKey: 'apple',
      theme: {
        bg: 'from-white/[0.08] to-white/[0.02]',
        border: 'border-white/15',
        hoverBorder: 'hover:border-white/40',
        glow: 'hover:shadow-[0_12px_40px_rgba(255,255,255,0.16)]',
        accent: 'text-white',
        textColor: 'text-zinc-200',
      },
      symbol: '',
      icon: (
        <img 
          src="/logos/apple-logo-svgrepo-com.svg" 
          alt="Apple" 
          className="w-8 h-8 object-contain filter invert drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]" 
        />
      ),
    },
    {
      id: 'samsung',
      name: 'Samsung',
      badge: 'Galaxy Certified',
      taglineKey: 'samsung',
      theme: {
        bg: 'from-blue-600/[0.14] to-blue-950/[0.04]',
        border: 'border-blue-500/30',
        hoverBorder: 'hover:border-blue-400/70',
        glow: 'hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)]',
        accent: 'text-blue-400',
        textColor: 'text-blue-200',
      },
      symbol: 'S',
      icon: (
        <img 
          src="/logos/samsung-svgrepo-com.svg" 
          alt="Samsung" 
          className="w-10 h-auto object-contain filter brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,113,227,0.4)]" 
        />
      ),
    },
    {
      id: 'dji',
      name: 'DJI',
      badge: 'Drone & Gimbal Lab',
      taglineKey: 'dji',
      theme: {
        bg: 'from-cyan-600/[0.12] to-cyan-950/[0.04]',
        border: 'border-cyan-500/25',
        hoverBorder: 'hover:border-cyan-400/60',
        glow: 'hover:shadow-[0_12px_40px_rgba(6,182,212,0.32)]',
        accent: 'text-cyan-300',
        textColor: 'text-cyan-200',
      },
      symbol: 'DJI',
      icon: (
        <img 
          src="/logos/brand-dji-svgrepo-com.svg" 
          alt="DJI" 
          className="w-9 h-auto object-contain filter brightness-0 invert drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]" 
        />
      ),
    },
    {
      id: 'xiaomi',
      name: 'Xiaomi',
      badge: 'Mi Ecosystem Lab',
      taglineKey: 'xiaomi',
      theme: {
        bg: 'from-orange-600/[0.14] to-orange-950/[0.04]',
        border: 'border-orange-500/30',
        hoverBorder: 'hover:border-orange-400/70',
        glow: 'hover:shadow-[0_12px_40px_rgba(249,115,22,0.35)]',
        accent: 'text-orange-400',
        textColor: 'text-orange-200',
      },
      symbol: 'MI',
      icon: (
        <img 
          src="/logos/xiaomi-svgrepo-com.svg" 
          alt="Xiaomi" 
          className="w-8 h-8 object-contain filter brightness-0 invert drop-shadow-[0_2px_8px_rgba(249,115,22,0.4)]" 
        />
      ),
    },
    {
      id: 'joog',
      name: 'JOOG',
      badge: 'Lifestyle & Audio',
      taglineKey: 'joog',
      theme: {
        bg: 'from-white/[0.04] to-white/[0.01]',
        border: 'border-white/10',
        hoverBorder: 'hover:border-teal-400/40',
        glow: 'hover:shadow-[0_12px_40px_rgba(20,184,166,0.15)]',
        accent: 'text-teal-300',
        textColor: 'text-zinc-200',
      },
      symbol: 'JOOG',
      icon: (
        <span className="font-jost font-black tracking-normal text-sm sm:text-base text-teal-300 select-none">
          JOOG
        </span>
      ),
    },
    {
      id: 'general',
      name: 'Asistencia General',
      badge: 'Multimarca & PC',
      taglineKey: 'general',
      theme: {
        bg: 'from-white/[0.04] to-white/[0.01]',
        border: 'border-white/10',
        hoverBorder: 'hover:border-white/30',
        glow: 'hover:shadow-[0_12px_40px_rgba(255,255,255,0.1)]',
        accent: 'text-zinc-200',
        textColor: 'text-zinc-300',
      },
      symbol: '+',
      icon: <Wrench className="w-7 h-7 text-zinc-300 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" />,
    },
  ];

  const handleCardClick = (brandId: BrandId) => {
    playTapSound(1200, 0.045, 0.08);
    createTicket(brandId);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between items-center px-4 sm:px-8 py-6 sm:py-10 select-none bg-[#030305] animate-fade-in overflow-y-auto">
      {/* Top Bar Navigation */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => {
            playTapSound(750, 0.03, 0.05);
            setStep('identification');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] text-zinc-300 text-xs sm:text-sm font-medium transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.services.btnBack}</span>
        </button>

        <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Paso 2 de 2
        </span>
      </div>

      {/* Main Content Stage */}
      <div className="w-full max-w-5xl my-auto py-2 sm:py-4">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12 space-y-2">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.services.title}
          </h2>
          <p className="text-xs sm:text-base text-zinc-400 max-w-xl mx-auto font-normal">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services High-End Touch Grid with 6 Brands */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8">
          {brandConfigs.map((brand, idx) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => handleCardClick(brand.id)}
              style={{ animationDelay: `${(idx + 1) * 70}ms` }}
              className="apple-card apple-card-interactive group relative text-left p-6 sm:p-7 rounded-[28px] border border-white/[0.08] hover:border-white/30 shadow-2xl flex flex-col justify-between min-h-[190px] cursor-pointer animate-fade-in-up"
            >
              {/* Top row: Brand Icon & Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 min-w-[3rem] px-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  {brand.icon}
                </div>

                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-zinc-400">
                  {brand.badge}
                </span>
              </div>

              {/* Content info */}
              <div>
                <div className="flex items-center justify-between">
                  {brand.id === 'joog' ? (
                    <h3 className="text-2xl font-bold font-jost tracking-wider text-white group-hover:text-teal-300 transition-colors">
                      JOOG
                    </h3>
                  ) : (
                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                      {t.brands[brand.taglineKey]?.name || brand.name}
                    </h3>
                  )}
                  <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {t.brands[brand.taglineKey]?.tagline}
                </p>
              </div>

              {/* Bottom action trigger bar */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">
                <span>Seleccionar y emitir turno</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Subtle bottom note */}
      <div className="text-center text-xs text-zinc-500 font-medium">
        Toca tu categoría para generar tu turno al instante
      </div>
    </div>
  );
};
