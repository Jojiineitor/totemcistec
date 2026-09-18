import React, { useEffect } from 'react';
import { useTotem } from '../../context/TotemContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Tv, 
  ShieldCheck, 
  User, 
  CreditCard, 
  Tag, 
  Clock 
} from 'lucide-react';
import { playSuccessSound, playTapSound } from '../../utils/soundEffects';

export const TicketSummaryStep: React.FC = () => {
  const { ticket, resetSession, resetCountdown, t } = useTotem();

  // Trigger confetti and Apple chime on entrance
  useEffect(() => {
    playSuccessSound();

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#0071e3', '#3b82f6', '#10b981', '#ffffff'],
    });
  }, []);

  if (!ticket) return null;

  const handleDone = () => {
    playTapSound(1150, 0.04, 0.07);
    resetSession();
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between items-center px-4 sm:px-8 py-6 sm:py-10 select-none bg-[#030305] animate-fade-in overflow-y-auto">
      {/* Top Banner */}
      <div className="text-center mb-6 space-y-1 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-4 h-4" />
          {t.ticket.badge}
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.ticket.title}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-normal">
          {t.ticket.subtitle}
        </p>
      </div>

      {/* Main Digital Ticket Display with Animated Color Glow Perimeter */}
      <div className="relative max-w-xl mx-auto w-full p-[1.5px] rounded-[34px] overflow-hidden shadow-2xl mb-6 animate-scale-spring">
        {/* Animated Rotating Color Glow Ring */}
        <div className="absolute -inset-[150%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_220deg,#0071e3_270deg,#38bdf8_315deg,#818cf8_350deg,#0071e3_360deg)] opacity-70 blur-[2px]" />

        {/* Inner Obsidian Glass Card */}
        <div className="relative rounded-[calc(2.125rem-1.5px)] bg-[#07070a]/95 backdrop-blur-2xl border border-white/[0.08] overflow-hidden">
          {/* Header Ribbon */}
          <div className="bg-black/60 border-b border-white/[0.08] p-4 px-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm tracking-wider">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>CISTEC • ASISTENCIA TÉCNICA</span>
            </div>
            <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-white/10 font-semibold text-zinc-300">
              {ticket.id}
            </span>
          </div>

          {/* Ticket Content */}
          <div className="p-6 sm:p-8">
            {/* Main Giant Turn Code with Subtle Shimmer */}
            <div className="text-center py-6 px-4 rounded-2xl bg-black/50 border border-white/[0.08] mb-6 shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 w-3/4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />

              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-bold block mb-1">
                {t.ticket.codeLabel}
              </span>
              <div className="text-5xl sm:text-7xl font-black font-mono tracking-widest text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.2)]">
                {ticket.ticketCode}
              </div>
              <div className="mt-2 text-xs text-zinc-400 font-medium">
                Especialidad: <strong className="text-white">{ticket.brandName}</strong>
              </div>
            </div>

            {/* TV Screen Waiting Notice */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-5 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                <Tv className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Atención en Pantalla de Recepción</span>
                <p className="text-zinc-400 mt-0.5 leading-relaxed">
                  Toma asiento en la sala. Tu código <strong>{ticket.ticketCode}</strong> será llamado en el televisor de recepción.
                </p>
              </div>
            </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border-y border-white/[0.08] py-5 my-5">
            {/* Customer Name */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                  {t.ticket.clientLabel}
                </span>
                <span className="text-sm font-bold text-white">
                  {ticket.customer.fullName}
                </span>
              </div>
            </div>

            {/* Document CI / CPF */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                  {t.ticket.documentLabel} ({ticket.customer.documentType.toUpperCase()})
                </span>
                <span className="text-sm font-bold font-mono text-white">
                  {ticket.customer.documentNumber}
                </span>
              </div>
            </div>

            {/* Service */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                  {t.ticket.serviceLabel}
                </span>
                <span className="text-sm font-bold text-blue-300">
                  {ticket.brandName}
                </span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                  {t.ticket.timeLabel}
                </span>
                <span className="text-sm font-bold font-mono text-white">
                  {ticket.createdAt}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket bottom footer */}
        <div className="border-t border-dashed border-white/[0.12] py-3 px-6 bg-black/40 flex justify-between items-center text-xs text-zinc-400 font-mono">
          <span>TURNO #{ticket.sequentialNumber}</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            REGISTRADO EN RECEPCIÓN
          </span>
        </div>
      </div>
    </div>

      {/* Auto Reset Countdown & Action Button */}
      <div className="space-y-4 w-full max-w-xl">
        {resetCountdown !== null && (
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>
              {t.ticket.autoResetHint.replace('{seconds}', resetCountdown.toString())}
            </span>
          </div>
        )}

        {/* Single Primary Apple-style Action Button */}
        <button
          type="button"
          onClick={handleDone}
          className="w-full py-4 px-8 rounded-2xl apple-button-primary font-bold text-base shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{t.ticket.btnDone}</span>
        </button>
      </div>
    </div>
  );
};
