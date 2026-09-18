import React, { useState, useEffect } from 'react';
import { QueueTicket } from '../../types/totem';
import { queueSync } from '../../utils/queueSync';
import { playCallingChime } from '../../utils/soundEffects';
import { ReceptionConsoleModal } from './ReceptionConsoleModal';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Settings2, 
  Radio
} from 'lucide-react';

export const QueueTVDisplay: React.FC = () => {
  const [tickets, setTickets] = useState<QueueTicket[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);
  const [justCalledId, setJustCalledId] = useState<string | null>(null);

  // Subscribe to real-time queue synchronization bus
  useEffect(() => {
    const unsubscribe = queueSync.subscribe((newTickets, event) => {
      setTickets(newTickets);

      if (event?.type === 'CALL' && event.ticket) {
        setJustCalledId(event.ticket.id);
        playCallingChime();

        setTimeout(() => {
          setJustCalledId(null);
        }, 8000);
      }
    });

    return () => unsubscribe();
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Group tickets into 3 columns
  const waitingTickets = tickets.filter((t) => t.queueStatus === 'waiting');
  // Order waiting: oldest registered first (FIFO)
  const sortedWaiting = [...waitingTickets].sort((a, b) => a.timestamp - b.timestamp);

  const callingTickets = tickets.filter((t) => t.queueStatus === 'calling');

  // Match tickets to the 3 distinct receptionist desks
  const station1Ticket = callingTickets.find((t) => (t.station || '').toLowerCase() === 'puesto 1') || null;
  const station2Ticket = callingTickets.find((t) => (t.station || '').toLowerCase() === 'puesto 2') || null;
  const station3Ticket = callingTickets.find((t) => (t.station || '').toLowerCase() === 'puesto 3') || null;

  const completedTickets = tickets.filter((t) => t.queueStatus === 'completed');
  // Completed: most recently completed first
  const sortedCompleted = [...completedTickets]
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
    .slice(0, 8);

  // Format date
  const formattedDate = currentTime.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const stationsList = [
    { name: 'PUESTO 1', ticket: station1Ticket },
    { name: 'PUESTO 2', ticket: station2Ticket },
    { name: 'PUESTO 3', ticket: station3Ticket },
  ];

  return (
    <div className="relative w-screen h-screen min-h-screen bg-[#030305] text-zinc-100 flex flex-col justify-between overflow-hidden select-none p-4 sm:p-5 md:p-6">
      {/* Background High-Performance Deep Minimalist Luminescence */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[50vh] rounded-full opacity-15 pointer-events-none blur-3xl" 
        style={{ background: 'radial-gradient(ellipse at center, rgba(0, 113, 227, 0.25) 0%, rgba(3, 3, 5, 0) 70%)' }}
      />

      {/* Top Header: Pure Minimalist Date & Time */}
      <header className="relative z-10 w-full flex items-center justify-between pb-3 border-b border-white/[0.06]">
        {/* Left side empty to maintain clean spacious balance */}
        <div className="w-10 sm:w-24" />

        {/* Center: Prominent Date and Elegant Digital Clock */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
          {/* Formatted Date */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 font-medium tracking-wide">
            <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="capitalize">{formattedDate}</span>
          </div>

          <span className="hidden sm:inline text-zinc-600">•</span>

          {/* Clock */}
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-inner font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-widest">
            <Clock className="w-5 h-5 text-blue-400 shrink-0" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Right side: Discrete Operator Console trigger */}
        <div className="w-10 sm:w-24 flex justify-end">
          <button
            type="button"
            onClick={() => setIsConsoleOpen(true)}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-500 hover:text-white border border-white/[0.06] text-xs font-medium transition-all active:scale-95 opacity-40 hover:opacity-100"
            title="Abrir consola de operadores"
          >
            <Settings2 className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </header>

      {/* 3 Columns Main Stage */}
      <main className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 py-3 overflow-hidden">
        {/* COLUMN 1: PRÓXIMOS EN FILA - 3 Cols */}
        <section className="md:col-span-3 flex flex-col rounded-3xl bg-[#07070a]/80 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl overflow-hidden border border-white/[0.06]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-white">
                Próximos en Fila
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-zinc-400 text-xs font-mono font-medium">
              {sortedWaiting.length} en espera
            </span>
          </div>

          {/* List of Waiting Tickets */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {sortedWaiting.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-600 space-y-2">
                <Clock className="w-8 h-8 opacity-20 text-zinc-500" />
                <span className="text-xs font-medium">No hay clientes en espera</span>
              </div>
            ) : (
              sortedWaiting.map((t, idx) => (
                <div 
                  key={t.id}
                  className="rounded-2xl p-3.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-zinc-500 w-5">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-mono font-black text-xl sm:text-2xl text-white tracking-wider">
                        {t.ticketCode}
                      </div>
                      <div className="text-xs font-medium text-zinc-300 line-clamp-1">
                        {t.customer.fullName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-zinc-400 block">
                      {t.createdAt}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* COLUMN 2: ACTUALMENTE EN MOSTRADOR (CENTERED, CLEAN, ANIMATED GLOW) - 6 Cols */}
        <section className="md:col-span-6 flex flex-col rounded-3xl bg-[#050508]/80 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl overflow-hidden border border-white/[0.06] justify-between">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Actualmente en Mostrador
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-semibold flex items-center gap-1.5">
              <Radio className="w-3 h-3 animate-pulse" />
              3 PUESTOS
            </span>
          </div>

          {/* 3 Centered Desk Cards with animated color glow perimeter */}
          <div className="flex-1 grid grid-rows-3 gap-3 py-1">
            {stationsList.map((desk) => {
              const hasTicket = !!desk.ticket;
              const isJustCalled = hasTicket && justCalledId === desk.ticket?.id;

              if (hasTicket && desk.ticket) {
                return (
                  <div 
                    key={desk.name}
                    className="relative p-[1.5px] rounded-3xl overflow-hidden group shadow-2xl transition-all duration-500"
                  >
                    {/* Animated Rotating Color Glow Ring */}
                    <div 
                      className={`absolute -inset-[150%] ${
                        isJustCalled 
                          ? 'animate-spin-fast bg-[conic-gradient(from_0deg,transparent_0_180deg,#0071e3_220deg,#38bdf8_270deg,#a855f7_330deg,#0071e3_360deg)] opacity-100' 
                          : 'animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_220deg,#0071e3_270deg,#38bdf8_315deg,#818cf8_350deg,#0071e3_360deg)] opacity-70'
                      } blur-[2px]`}
                    />

                    {/* Inner Minimalist Dark Glassmorphic Container */}
                    <div className={`relative h-full w-full rounded-[calc(1.5rem-1.5px)] bg-[#08080c]/95 backdrop-blur-2xl p-3 sm:p-4 flex flex-col justify-between items-center text-center border border-white/[0.08] ${
                      isJustCalled ? 'shadow-[inset_0_0_35px_rgba(0,113,227,0.3)]' : 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]'
                    }`}>
                      {/* Top: Puesto Badge & En Atención Status (Centered) */}
                      <div className="w-full flex items-center justify-center gap-3">
                        <span className="px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-xs font-bold tracking-widest text-white uppercase shadow-sm">
                          {desk.name}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          isJustCalled 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40 animate-pulse' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isJustCalled ? 'bg-blue-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                          {isJustCalled ? '¡Llamando ahora!' : 'En Atención'}
                        </span>
                      </div>

                      {/* Middle: Generous Space for Customer & Ticket (Centered) */}
                      <div className="flex-1 flex flex-col items-center justify-center my-1 text-center">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-400 mb-0.5">
                          TURNO
                        </div>
                        <div className="font-mono font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.25)] leading-tight">
                          {desk.ticket.ticketCode}
                        </div>
                        <div className="mt-1 text-lg sm:text-xl font-bold text-zinc-100 tracking-tight line-clamp-1">
                          {desk.ticket.customer.fullName}
                        </div>
                        <div className="text-xs sm:text-sm font-mono text-zinc-400 tracking-wider">
                          {desk.ticket.customer.documentType.toUpperCase()}: •••{desk.ticket.customer.documentNumber.slice(-3)}
                        </div>
                      </div>

                      {/* Bottom: Subtle Time */}
                      <div className="text-[10px] font-mono text-zinc-400">
                        Hora: {desk.ticket.createdAt}
                      </div>
                    </div>
                  </div>
                );
              }

              // Idle / Free Desk
              return (
                <div 
                  key={desk.name}
                  className="rounded-3xl bg-white/[0.02] border border-white/[0.05] p-3 sm:p-4 flex flex-col justify-between items-center text-center transition-all duration-300 backdrop-blur-xl"
                >
                  {/* Top: Puesto Badge + Disponible (Centered) */}
                  <div className="w-full flex items-center justify-center gap-3">
                    <span className="px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      {desk.name}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] text-zinc-400 text-xs font-medium border border-white/[0.04]">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      Disponible
                    </span>
                  </div>

                  {/* Middle: Clean Centered Placeholder */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-2">
                    <span className="text-zinc-400 text-xs sm:text-sm font-medium tracking-wide">
                      Mostrador libre para atención
                    </span>
                  </div>

                  <div className="h-3" />
                </div>
              );
            })}
          </div>
        </section>

        {/* COLUMN 3: RECEPCIONADOS (ATENDIDOS) - 3 Cols */}
        <section className="md:col-span-3 flex flex-col rounded-3xl bg-[#07070a]/80 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl overflow-hidden border border-white/[0.06]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-white">
                Recepcionados
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-zinc-400 text-xs font-mono font-medium">
              Historial
            </span>
          </div>

          {/* List of Completed Tickets */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {sortedCompleted.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-600 space-y-2">
                <CheckCircle2 className="w-8 h-8 opacity-20 text-emerald-500" />
                <span className="text-xs font-medium">Aún no hay turnos recepcionados</span>
              </div>
            ) : (
              sortedCompleted.map((t) => (
                <div 
                  key={t.id}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-mono font-bold text-sm text-zinc-200 block">
                        {t.ticketCode}
                      </span>
                      <span className="text-xs text-zinc-400 line-clamp-1">
                        {t.customer.fullName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-400/90 font-medium">
                      ✓ Recepcionado
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Clean Minimalist Footer (Left side 100% clear so dock switcher never collides) */}
      <footer className="relative z-10 w-full pt-2 border-t border-white/[0.06] flex items-center justify-end text-xs text-zinc-400">
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sincronización en tiempo real</span>
          <span>•</span>
          <span>3 Mostradores Activos</span>
        </div>
      </footer>

      {/* Quick Receptionist Console Modal */}
      <ReceptionConsoleModal 
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        waitingTickets={sortedWaiting}
        callingTickets={callingTickets}
      />
    </div>
  );
};
