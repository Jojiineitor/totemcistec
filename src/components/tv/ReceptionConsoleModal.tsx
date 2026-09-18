import React, { useState } from 'react';
import { QueueTicket } from '../../types/totem';
import { queueSync } from '../../utils/queueSync';
import { 
  X, 
  Volume2, 
  CheckCircle2, 
  ArrowRight, 
  Trash2, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  Users,
  Radio
} from 'lucide-react';
import { playTapSound } from '../../utils/soundEffects';

interface ReceptionConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  waitingTickets: QueueTicket[];
  callingTickets: QueueTicket[];
}

export const ReceptionConsoleModal: React.FC<ReceptionConsoleModalProps> = ({
  isOpen,
  onClose,
  waitingTickets,
  callingTickets,
}) => {
  const [station, setStation] = useState<string>('Puesto 1');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCallNext = () => {
    if (waitingTickets.length === 0) return;
    playTapSound(1100, 0.04, 0.08);
    const next = waitingTickets[waitingTickets.length - 1]; // oldest in waiting
    queueSync.callTicket(next.id, station);
  };

  const handleRecall = (ticketId: string) => {
    playTapSound(1200, 0.04, 0.08);
    queueSync.recallTicket(ticketId);
  };

  const handleComplete = (ticketId: string) => {
    playTapSound(950, 0.04, 0.08);
    queueSync.completeTicket(ticketId);
  };

  const handleSeedDemo = () => {
    playTapSound(800, 0.03, 0.05);
    queueSync.seedDemoTickets();
  };

  const handleClearAll = () => {
    if (confirm('¿Deseas vaciar la cola de turnos?')) {
      playTapSound(450, 0.05, 0.08);
      queueSync.clearQueue();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const stations = ['Puesto 1', 'Puesto 2', 'Box 3', 'Laboratorio'];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#061226] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left animate-scale-spring"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Consola de Control de Recepción
              </h3>
              <p className="text-xs text-zinc-400">
                Llamado y derivación de clientes en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-colors"
              title="Pantalla Completa"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Station Selection */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Tu Puesto / Mostrador Asignado:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stations.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  playTapSound(800, 0.02, 0.04);
                  setStation(st);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                  station === st
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Call Next Button */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-indigo-900/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-blue-400 block">
              Próximo en Fila
            </span>
            <span className="text-lg font-bold text-white">
              {waitingTickets.length > 0 
                ? `${waitingTickets[waitingTickets.length - 1].ticketCode} • ${waitingTickets[waitingTickets.length - 1].customer.fullName}`
                : 'No hay clientes en espera'
              }
            </span>
            <span className="text-xs text-zinc-400 block mt-0.5">
              {waitingTickets.length} cliente(s) esperando en sala
            </span>
          </div>

          <button
            type="button"
            onClick={handleCallNext}
            disabled={waitingTickets.length === 0}
            className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              waitingTickets.length > 0
                ? 'apple-button-primary cursor-pointer'
                : 'bg-white/[0.06] text-zinc-500 cursor-not-allowed border border-white/[0.06]'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Llamar a {station}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Currently Called Tickets Management */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Turnos Actualmente en Mostrador ({callingTickets.length})
          </label>

          {callingTickets.length === 0 ? (
            <div className="text-center py-5 text-xs text-zinc-500 bg-white/[0.02] rounded-2xl border border-white/[0.06]">
              No hay turnos activos siendo llamados en este momento.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {callingTickets.map((t) => (
                <div 
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-lg text-emerald-400">
                      {t.ticketCode}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {t.customer.fullName}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {t.station || 'Mostrador'} • {t.brandName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRecall(t.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Volver a emitir sonido de llamado"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Re-llamar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleComplete(t.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Recepcionar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Utility Tools */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/10 text-xs text-zinc-400 gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSeedDemo}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cargar datos de prueba</span>
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar cola</span>
            </button>
          </div>

          <span className="text-[11px] text-zinc-500">
            Sincronizado vía BroadcastChannel 0ms
          </span>
        </div>
      </div>
    </div>
  );
};
