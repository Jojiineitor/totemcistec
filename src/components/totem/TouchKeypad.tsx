import React, { useState, useEffect } from 'react';
import { Delete, Space, CornerDownLeft, Hash, Type } from 'lucide-react';
import { playTapSound } from '../../utils/soundEffects';

interface TouchKeypadProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onClear: () => void;
  onSubmit?: () => void;
  activeInputType?: 'text' | 'number';
}

const TouchKeypadComponent: React.FC<TouchKeypadProps> = ({
  onKeyPress,
  onBackspace,
  onSpace,
  onClear,
  onSubmit,
  activeInputType = 'text',
}) => {
  const [layout, setLayout] = useState<'alpha' | 'numeric'>(
    activeInputType === 'number' ? 'numeric' : 'alpha'
  );

  useEffect(() => {
    setLayout(activeInputType === 'number' ? 'numeric' : 'alpha');
  }, [activeInputType]);

  const handleKey = (char: string) => {
    playTapSound(layout === 'numeric' ? 820 : 920, 0.03, 0.05);
    onKeyPress(char);
  };

  const handleBack = () => {
    playTapSound(520, 0.04, 0.06);
    onBackspace();
  };

  const handleSpacePress = () => {
    playTapSound(760, 0.03, 0.05);
    onSpace();
  };

  const handleClearPress = () => {
    playTapSound(480, 0.04, 0.05);
    onClear();
  };

  const handleSubmitPress = () => {
    playTapSound(1200, 0.04, 0.08);
    onSubmit?.();
  };

  const alphaRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  const numberPad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '-'],
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#07132a]/95 border border-white/[0.08] rounded-3xl p-3 sm:p-4 shadow-2xl transition-all">
      {/* Top utility bar */}
      <div className="flex justify-between items-center mb-2.5 px-1">
        <button
          type="button"
          onClick={() => setLayout(layout === 'alpha' ? 'numeric' : 'alpha')}
          className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.18] border border-white/[0.08] text-xs font-medium text-blue-400 flex items-center gap-1.5 transition-all active:scale-95"
        >
          {layout === 'alpha' ? (
            <>
              <Hash className="w-3.5 h-3.5" />
              <span>Teclado Numérico (123)</span>
            </>
          ) : (
            <>
              <Type className="w-3.5 h-3.5" />
              <span>Teclado Letras (ABC)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleClearPress}
          className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-rose-500/20 active:bg-rose-500/30 text-zinc-400 hover:text-rose-300 text-xs font-medium transition-all active:scale-95"
        >
          Borrar todo
        </button>
      </div>

      {layout === 'alpha' ? (
        /* QWERTY Alphabetical Layout */
        <div className="space-y-2">
          {/* Row 1 */}
          <div className="flex justify-center gap-1.5 sm:gap-2">
            {alphaRows[0].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => handleKey(k)}
                className="flex-1 h-12 sm:h-13 rounded-xl sm:rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] active:bg-blue-600 border border-white/[0.06] text-white font-medium text-base sm:text-lg transition-all active:scale-95 flex items-center justify-center shadow-md"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex justify-center gap-1.5 sm:gap-2 px-2 sm:px-4">
            {alphaRows[1].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => handleKey(k)}
                className="flex-1 h-12 sm:h-13 rounded-xl sm:rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] active:bg-blue-600 border border-white/[0.06] text-white font-medium text-base sm:text-lg transition-all active:scale-95 flex items-center justify-center shadow-md"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Row 3 with Backspace */}
          <div className="flex justify-center gap-1.5 sm:gap-2">
            <div className="w-6 sm:w-10" />
            {alphaRows[2].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => handleKey(k)}
                className="flex-1 h-12 sm:h-13 rounded-xl sm:rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] active:bg-blue-600 border border-white/[0.06] text-white font-medium text-base sm:text-lg transition-all active:scale-95 flex items-center justify-center shadow-md"
              >
                {k}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 max-w-[72px] sm:max-w-[84px] h-12 sm:h-13 rounded-xl sm:rounded-2xl bg-white/[0.06] hover:bg-rose-500/20 active:bg-rose-500/40 border border-white/[0.06] text-zinc-300 hover:text-rose-300 font-medium text-sm transition-all active:scale-95 flex items-center justify-center"
              title="Borrar carácter"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Space & Enter Row */}
          <div className="flex justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSpacePress}
              className="flex-1 h-12 rounded-xl sm:rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.18] border border-white/[0.08] text-zinc-300 font-medium text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Space className="w-4 h-4" />
              <span>Espacio</span>
            </button>

            {onSubmit && (
              <button
                type="button"
                onClick={handleSubmitPress}
                className="px-6 sm:px-8 h-12 rounded-xl sm:rounded-2xl bg-apple-blue hover:bg-apple-blue-hover active:bg-apple-blue-active text-white font-semibold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
              >
                <CornerDownLeft className="w-4 h-4" />
                <span>Listo</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Numeric Keypad Layout */
        <div className="max-w-xs mx-auto space-y-2">
          {numberPad.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {row.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKey(num)}
                  className="h-12 sm:h-13 rounded-xl sm:rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] active:bg-blue-600 border border-white/[0.06] text-white font-medium text-xl transition-all active:scale-95 flex items-center justify-center shadow"
                >
                  {num}
                </button>
              ))}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleBack}
              className="py-3 rounded-xl sm:rounded-2xl bg-white/[0.06] hover:bg-rose-500/20 active:bg-rose-500/40 border border-white/[0.06] text-zinc-300 hover:text-rose-300 font-medium transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Delete className="w-5 h-5" />
              <span className="text-xs">Borrar</span>
            </button>

            {onSubmit && (
              <button
                type="button"
                onClick={handleSubmitPress}
                className="py-3 rounded-xl sm:rounded-2xl bg-apple-blue hover:bg-apple-blue-hover active:bg-apple-blue-active text-white font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
              >
                <CornerDownLeft className="w-4 h-4" />
                <span className="text-xs">Listo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const TouchKeypad = React.memo(TouchKeypadComponent);

