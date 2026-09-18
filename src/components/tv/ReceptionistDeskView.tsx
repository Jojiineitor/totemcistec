import React, { useState, useEffect } from 'react';
import { QueueTicket } from '../../types/totem';
import { queueSync } from '../../utils/queueSync';
import { playTapSound } from '../../utils/soundEffects';
import { 
  Radio, 
  Volume2, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  CreditCard, 
  Clock, 
  Sparkles, 
  Tv
} from 'lucide-react';

interface ReceptionistDeskViewProps {
  initialStation?: string;
}

export const ReceptionistDeskView: React.FC<ReceptionistDeskViewProps> = ({ 
  initialStation = 'Puesto 1' 
}) => {
  // Store station in localStorage or query param
  const [station, setStation] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramStation = params.get('puesto');
      if (paramStation) return `Puesto ${paramStation}`;
      const saved = localStorage.getItem('cistec_operator_station');
      if (saved) return saved;
    }
    return initialStation;
  });

  const [tickets, setTickets] = useState<QueueTicket[]>([]);
  const [justRecalled, setJustRecalled] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('cistec_operator_station', station);
  }, [station]);

  useEffect(() => {
    const unsubscribe = queueSync.subscribe((newTickets) => {
      setTickets(newTickets);
    });
    return () => unsubscribe();
  }, []);

  // Filter waiting tickets (oldest first)
  const waitingTickets = tickets
    .filter((t) => t.queueStatus === 'waiting')
    .sort((a, b) => a.timestamp - b.timestamp);

  const nextWaiting = waitingTickets[0] || null;

  // Active ticket for this station
  const activeTicket = tickets.find(
    (t) => t.queueStatus === 'calling' && (t.station || '').toLowerCase() === station.toLowerCase()
  ) || null;

  // Completed tickets today
  const completedCount = tickets.filter((t) => t.queueStatus === 'completed').length;

  const handleCallNext = () => {
    if (!nextWaiting) return;
    playTapSound(1150, 0.04, 0.08);
    queueSync.callTicket(nextWaiting.id, station);
  };

  const handleRecall = () => {
    if (!activeTicket) return;
    playTapSound(1250, 0.045, 0.08);
    setJustRecalled(true);
    queueSync.recallTicket(activeTicket.id);
    setTimeout(() => setJustRecalled(false), 2000);
  };

  const handleComplete = () => {
    if (!activeTicket) return;
    playTapSound(950, 0.04, 0.08);
    queueSync.completeTicket(activeTicket.id);
  };

  const getStationColor = () => {
    return 'bg-white/[0.08] text-white border border-white/15';
  };

  return (
    <div className="min-h-screen w-full bg-[#030305] text-zinc-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <img 
            src="/logos/logo_exact.png" 
            alt="CISTEC" 
            className="h-8 w-auto shrink-0 object-contain drop-shadow-sm"
          />
          <div className="border-l border-white/15 pl-3">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold block">
              Terminal Mostrador
            </span>
            <span className="text-base font-bold text-white">
              CISTEC • Recepción
            </span>
          </div>
        </div>

        {/* Station Selector Pills */}
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/[0.08]">
          <span className="text-xs text-zinc-400 px-2 font-medium">
            Mostrador:
          </span>
          {['Puesto 1', 'Puesto 2', 'Puesto 3'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                playTapSound(800, 0.02, 0.04);
                setStation(st);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                station === st
                  ? 'bg-white/[0.12] text-white border border-white/20 shadow-md scale-105'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>En línea con la TV</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* LEFT / CENTER: Active Station Action Box (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col justify-between">
          <div className="apple-card rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl flex-1 flex flex-col justify-between">
            {/* Station Status Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-xl text-white font-bold text-sm shadow-md ${getStationColor()}`}>
                  {station.toUpperCase()}
                </div>
                {activeTicket ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Atendiendo Cliente
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-zinc-600" />
                    Puesto Libre
                  </span>
                )}
              </div>

              <div className="text-right text-xs text-zinc-400 font-mono">
                {waitingTickets.length} en espera • {completedCount} recepcionados
              </div>
            </div>

            {/* Main State Card */}
            <div className="my-6 flex-1 flex flex-col justify-center">
              {activeTicket ? (
                /* Customer Being Attended with Glowing Perimeter Border */
                <div className="relative p-[1.5px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500">
                  {/* Animated Rotating Color Glow Ring */}
                  <div 
                    className={`absolute -inset-[150%] ${
                      justRecalled 
                        ? 'animate-spin-fast bg-[conic-gradient(from_0deg,transparent_0_180deg,#0071e3_220deg,#38bdf8_270deg,#a855f7_330deg,#0071e3_360deg)] opacity-100' 
                        : 'animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_220deg,#0071e3_270deg,#38bdf8_315deg,#818cf8_350deg,#0071e3_360deg)] opacity-70'
                    } blur-[2px]`}
                  />

                  {/* Inner Obsidian Glass Container */}
                  <div className="relative rounded-[calc(1.5rem-1.5px)] bg-[#07070a]/95 backdrop-blur-2xl p-6 border border-white/[0.08] space-y-6">
                    {/* Big Monospace Turn Code */}
                    <div className="text-center py-6 px-4 rounded-2xl bg-black/50 border border-white/[0.08] relative overflow-hidden">
                      <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-bold block mb-1">
                        CÓDIGO EN MOSTRADOR
                      </span>
                      <div className="text-6xl sm:text-7xl font-black font-mono tracking-widest text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.2)]">
                        {activeTicket.ticketCode}
                      </div>
                      <div className="mt-2 text-sm text-zinc-400 font-medium">
                        Especialidad: <strong className="text-white">{activeTicket.brandName}</strong>
                      </div>
                    </div>

                    {/* Customer Information Grid */}
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left">
                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                            Cliente
                          </span>
                          <span className="text-base font-bold text-white">
                            {activeTicket.customer.fullName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CreditCard className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                            Documento
                          </span>
                          <span className="text-base font-bold font-mono text-zinc-300">
                            {activeTicket.customer.documentType.toUpperCase()}: {activeTicket.customer.documentNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for Active Ticket */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleRecall}
                        className="py-4 px-5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 text-white font-bold text-sm border border-white/10 flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Volume2 className={`w-5 h-5 text-amber-400 ${justRecalled ? 'animate-bounce' : ''}`} />
                        <span>{justRecalled ? '¡Aviso Enviado a TV!' : 'Re-llamar a la TV'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleComplete}
                        className="py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Finalizar y Recepcionar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Desk is Free: Hero Call Next Button */
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                    <Radio className="w-10 h-10 animate-pulse" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Tu mostrador está listo
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Presiona el botón para llamar automáticamente al siguiente cliente en espera.
                    </p>
                  </div>

                  {/* Next in line preview card */}
                  {nextWaiting ? (
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-md mx-auto text-left flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 block">
                          Siguiente en fila
                        </span>
                        <span className="font-mono font-black text-xl text-white">
                          {nextWaiting.ticketCode}
                        </span>
                        <span className="text-xs text-zinc-300 block">
                          {nextWaiting.customer.fullName} • {nextWaiting.brandName}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400 font-mono">
                        {nextWaiting.createdAt}
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] max-w-md mx-auto text-xs text-zinc-500">
                      No hay clientes en espera en la sala en este momento.
                    </div>
                  )}

                  {/* Big Call Next Action */}
                  <button
                    type="button"
                    onClick={handleCallNext}
                    disabled={!nextWaiting}
                    className={`w-full max-w-md py-5 rounded-2xl font-extrabold text-base transition-all shadow-xl flex items-center justify-center gap-2.5 mx-auto active:scale-95 ${
                      nextWaiting
                        ? 'apple-button-primary cursor-pointer'
                        : 'bg-white/[0.04] text-zinc-600 border border-white/[0.05] cursor-not-allowed'
                    }`}
                  >
                    <Radio className="w-5 h-5" />
                    <span>Llamar Siguiente a {station}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Keyboard hint */}
            <div className="pt-3 border-t border-white/[0.06] text-center text-xs text-zinc-500">
              Presiona <strong>Espacio</strong> o el botón para avanzar tu puesto
            </div>
          </div>
        </section>

        {/* RIGHT: Live Queue Waiting Room List (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col bg-[#07070a]/90 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-6 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-base font-extrabold text-white">
                Fila de Espera en Vivo
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono font-bold">
              {waitingTickets.length} clientes
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[500px]">
            {waitingTickets.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-zinc-600 space-y-2">
                <Clock className="w-8 h-8 opacity-20 text-zinc-500" />
                <span className="text-xs font-medium">La sala de espera está libre</span>
              </div>
            ) : (
              waitingTickets.map((t, idx) => (
                <div 
                  key={t.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-zinc-500 w-4">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="font-mono font-black text-lg text-white block">
                        {t.ticketCode}
                      </span>
                      <span className="text-xs text-zinc-300 block line-clamp-1 font-medium">
                        {t.customer.fullName}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {t.customer.documentType.toUpperCase()}: {t.customer.documentNumber}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-zinc-400 block mb-0.5">
                      {t.brandName}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {t.createdAt}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Demo Seed Trigger */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
            <button
              type="button"
              onClick={() => queueSync.seedDemoTickets()}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cargar 4 turnos demo</span>
            </button>
            <span className="text-[10px] font-mono text-zinc-600">
              CISTEC Sync
            </span>
          </div>
        </section>
      </main>

      {/* Footer with clean space */}
      <footer className="w-full max-w-6xl mx-auto pt-3 pl-28 sm:pl-0 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
        <span>CISTEC • Sistema de Atención Inteligente</span>
        <div className="flex items-center gap-4">
          <span>{station}</span>
          <span>•</span>
          <a href="/?view=tv" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white flex items-center gap-1">
            <Tv className="w-3.5 h-3.5" />
            <span>Ver Pantalla TV</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
