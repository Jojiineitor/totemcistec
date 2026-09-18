import React, { useState, useEffect } from 'react';
import { TotemProvider, useTotem } from './context/TotemContext';
import { TotemHeader } from './components/layout/TotemHeader';
import { IdleScreen } from './components/totem/IdleScreen';
import { LanguageSelectionStep } from './components/totem/LanguageSelectionStep';
import { IdentificationStep } from './components/totem/IdentificationStep';
import { ServiceSelectionStep } from './components/totem/ServiceSelectionStep';
import { TicketSummaryStep } from './components/totem/TicketSummaryStep';
import { QueueTVDisplay } from './components/tv/QueueTVDisplay';
import { ReceptionistDeskView } from './components/tv/ReceptionistDeskView';

import { AuroraBackground } from './components/effects/AuroraBackground';
import { TouchRippleEffect } from './components/effects/TouchRippleEffect';
import { Tv, Smartphone, Laptop, Layers, X } from 'lucide-react';

const TotemFlow: React.FC = () => {
  const { currentStep } = useTotem();

  return (
    <div 
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full h-full min-h-screen flex flex-col bg-[#030305] text-zinc-100 overflow-hidden select-none"
    >
      {/* Living Ambient Aurora Background */}
      <AuroraBackground />

      {/* Interactive Touch Wave Ripple with Apple Taptic Audio */}
      <TouchRippleEffect />

      {/* Top Header Bar (active only on inner steps, discrete) */}
      <TotemHeader />

      {/* Main Flow Container */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center w-full h-full overflow-hidden">
        {currentStep === 'idle' && <IdleScreen />}
        {currentStep === 'language_selection' && <LanguageSelectionStep />}
        {currentStep === 'identification' && <IdentificationStep />}
        {currentStep === 'service_selection' && <ServiceSelectionStep />}
        {currentStep === 'ticket_summary' && <TicketSummaryStep />}
      </main>
    </div>
  );
};

type ScreenView = 'totem' | 'tv' | 'operator';

export default function App() {
  const [viewMode, setViewMode] = useState<ScreenView>(() => {
    if (typeof window === 'undefined') return 'totem';
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view') || '';
    if (v === 'tv' || window.location.hash === '#tv') return 'tv';
    if (v.startsWith('operator') || v.startsWith('puesto')) return 'operator';
    return 'totem';
  });

  const [activeStation, setActiveStation] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Puesto 1';
    const params = new URLSearchParams(window.location.search);
    const p = params.get('puesto');
    if (p) return `Puesto ${p}`;
    const v = params.get('view') || '';
    if (v === 'puesto1') return 'Puesto 1';
    if (v === 'puesto2') return 'Puesto 2';
    if (v === 'puesto3') return 'Puesto 3';
    return 'Puesto 1';
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view') || '';
      if (v === 'tv' || window.location.hash === '#tv') {
        setViewMode('tv');
      } else if (v.startsWith('operator') || v.startsWith('puesto')) {
        setViewMode('operator');
        const p = params.get('puesto');
        if (p) setActiveStation(`Puesto ${p}`);
        else if (v === 'puesto1') setActiveStation('Puesto 1');
        else if (v === 'puesto2') setActiveStation('Puesto 2');
        else if (v === 'puesto3') setActiveStation('Puesto 3');
      } else {
        setViewMode('totem');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (view: ScreenView, station?: string) => {
    setViewMode(view);
    setIsMenuOpen(false);

    const url = new URL(window.location.href);
    if (view === 'tv') {
      url.searchParams.set('view', 'tv');
      url.searchParams.delete('puesto');
    } else if (view === 'operator') {
      const stNumber = (station || activeStation).replace(/\D/g, '') || '1';
      url.searchParams.set('view', 'operator');
      url.searchParams.set('puesto', stNumber);
      if (station) setActiveStation(station);
    } else {
      url.searchParams.delete('view');
      url.searchParams.delete('puesto');
    }
    window.history.pushState({}, '', url.toString());
  };

  const openInNewTab = (view: ScreenView, station?: string) => {
    const url = new URL(window.location.href);
    if (view === 'tv') {
      url.searchParams.set('view', 'tv');
      url.searchParams.delete('puesto');
    } else if (view === 'operator') {
      const stNumber = (station || activeStation).replace(/\D/g, '') || '1';
      url.searchParams.set('view', 'operator');
      url.searchParams.set('puesto', stNumber);
    } else {
      url.searchParams.delete('view');
      url.searchParams.delete('puesto');
    }
    window.open(url.toString(), '_blank');
  };

  return (
    <>
      {/* Screen Render */}
      {viewMode === 'tv' && <QueueTVDisplay />}
      {viewMode === 'operator' && <ReceptionistDeskView initialStation={activeStation} />}
      {viewMode === 'totem' && (
        <TotemProvider>
          <TotemFlow />
        </TotemProvider>
      )}

      {/* Discrete Multi-Screen Floating Pill (Positioned cleanly at bottom-left to prevent overlap) */}
      <aside aria-label="Selector de pantalla" className="fixed bottom-3 left-3 z-50 select-none">
        {!isMenuOpen ? (
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white border border-white/15 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all active:scale-95 opacity-60 hover:opacity-100"
            title="Cambiar entre Tótem, TV y Puestos de MacBook"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {viewMode === 'totem' && 'Vista: Tótem'}
              {viewMode === 'tv' && 'Vista: TV Recepción'}
              {viewMode === 'operator' && `Vista: ${activeStation}`}
            </span>
          </button>
        ) : (
          <div className="bg-[#07070a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 shadow-2xl space-y-2 min-w-[260px] animate-scale-spring text-left">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
              <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider">
                Vistas del Sistema CISTEC
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {/* Tótem */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] transition-colors">
                <button
                  type="button"
                  onClick={() => navigateTo('totem')}
                  className="flex items-center gap-2.5 text-xs font-semibold text-zinc-200"
                >
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>Tótem Entrada (Vertical 27")</span>
                </button>
                <button
                  type="button"
                  onClick={() => openInNewTab('totem')}
                  className="text-[10px] text-zinc-500 hover:text-blue-400 px-1.5 py-0.5 rounded bg-white/[0.05]"
                  title="Abrir en nueva pestaña"
                >
                  ↗
                </button>
              </div>

              {/* TV Recepción */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] transition-colors">
                <button
                  type="button"
                  onClick={() => navigateTo('tv')}
                  className="flex items-center gap-2.5 text-xs font-semibold text-zinc-200"
                >
                  <Tv className="w-4 h-4 text-emerald-400" />
                  <span>Pantalla TV Recepción (16:9)</span>
                </button>
                <button
                  type="button"
                  onClick={() => openInNewTab('tv')}
                  className="text-[10px] text-zinc-500 hover:text-emerald-400 px-1.5 py-0.5 rounded bg-white/[0.05]"
                  title="Abrir en nueva pestaña"
                >
                  ↗
                </button>
              </div>

              {/* MacBooks: Puesto 1, 2, 3 */}
              <div className="pt-1 border-t border-white/10">
                <span className="text-[10px] uppercase font-bold text-zinc-500 px-2 block mb-1">
                  MacBooks de Recepción:
                </span>
                {[
                  { st: 'Puesto 1', color: 'text-blue-400' },
                  { st: 'Puesto 2', color: 'text-emerald-400' },
                  { st: 'Puesto 3', color: 'text-purple-400' },
                ].map(({ st, color }) => (
                  <div key={st} className="flex items-center justify-between p-1.5 px-2 rounded-xl hover:bg-white/[0.06] transition-colors">
                    <button
                      type="button"
                      onClick={() => navigateTo('operator', st)}
                      className="flex items-center gap-2 text-xs font-medium text-zinc-300"
                    >
                      <Laptop className={`w-3.5 h-3.5 ${color}`} />
                      <span>{st} (MacBook)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openInNewTab('operator', st)}
                      className="text-[10px] text-zinc-500 hover:text-white px-1.5 py-0.5 rounded bg-white/[0.05]"
                      title={`Abrir ${st} en nueva pestaña`}
                    >
                      ↗
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
