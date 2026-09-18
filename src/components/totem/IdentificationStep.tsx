import React, { useState, useRef, useCallback } from 'react';
import { useTotem } from '../../context/TotemContext';
import { TouchKeypad } from './TouchKeypad';
import { User, CreditCard, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Keyboard } from 'lucide-react';

import { playTapSound } from '../../utils/soundEffects';

export const IdentificationStep: React.FC = () => {
  const { 
    customer, 
    updateCustomerName, 
    updateCustomerDocument, 
    updateDocumentType, 
    confirmIdentification, 
    setStep,
    t 
  } = useTotem();

  const [activeField, setActiveField] = useState<'name' | 'document'>('name');
  const [showKeypad, setShowKeypad] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const activeFieldRef = useRef(activeField);
  activeFieldRef.current = activeField;

  const customerRef = useRef(customer);
  customerRef.current = customer;

  const handleKeyPress = useCallback((char: string) => {
    setErrorMessage(null);
    if (activeFieldRef.current === 'name') {
      updateCustomerName(customerRef.current.fullName + char);
    } else if (activeFieldRef.current === 'document') {
      updateCustomerDocument(customerRef.current.documentNumber + char);
    }
  }, [updateCustomerName, updateCustomerDocument]);

  const handleBackspace = useCallback(() => {
    setErrorMessage(null);
    if (activeFieldRef.current === 'name') {
      updateCustomerName(customerRef.current.fullName.slice(0, -1));
    } else if (activeFieldRef.current === 'document') {
      updateCustomerDocument(customerRef.current.documentNumber.slice(0, -1));
    }
  }, [updateCustomerName, updateCustomerDocument]);

  const handleSpace = useCallback(() => {
    setErrorMessage(null);
    if (activeFieldRef.current === 'name') {
      updateCustomerName(customerRef.current.fullName + ' ');
    }
  }, [updateCustomerName]);

  const handleClear = useCallback(() => {
    setErrorMessage(null);
    if (activeFieldRef.current === 'name') {
      updateCustomerName('');
    } else if (activeFieldRef.current === 'document') {
      updateCustomerDocument('');
    }
  }, [updateCustomerName, updateCustomerDocument]);

  const handleDocTypeChange = (type: 'ci' | 'cpf') => {
    playTapSound(880, 0.03, 0.06);
    updateDocumentType(type);
  };

  const handleContinue = useCallback(() => {
    if (!customerRef.current.fullName.trim() || !customerRef.current.documentNumber.trim()) {
      playTapSound(320, 0.06, 0.08); // Subtle alert sound
      setErrorMessage(t.identification.errorRequired);
      return;
    }
    playTapSound(1150, 0.045, 0.08);
    confirmIdentification();
  }, [confirmIdentification, t.identification.errorRequired]);

  const isFormValid = customer.fullName.trim().length >= 2 && customer.documentNumber.replace(/\D/g, '').length >= 3;

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between items-center px-4 sm:px-8 py-6 sm:py-10 select-none bg-[#030305] animate-fade-in overflow-y-auto">
      {/* Top Bar Navigation */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => {
            playTapSound(750, 0.03, 0.05);
            setStep('language_selection');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] text-zinc-300 text-xs sm:text-sm font-medium transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.identification.btnBack}</span>
        </button>

        <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Paso 1 de 2
        </span>
      </div>

      {/* Main Beautiful Single Center Container with Spring Animation */}
      <div className="w-full max-w-xl my-auto py-2 sm:py-4">
        <div className="apple-card rounded-[32px] p-6 sm:p-10 shadow-2xl space-y-6 animate-scale-spring border border-white/[0.08]">
          {/* Header Title */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.identification.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal">
              {t.identification.subtitle}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  {t.identification.nameLabel}
                </span>
                {customer.fullName.trim().length >= 2 && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-normal">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Listo
                  </span>
                )}
              </label>
              <div 
                onClick={() => {
                  playTapSound(900, 0.02, 0.04);
                  setActiveField('name');
                  nameInputRef.current?.focus();
                }}
                className={`apple-input rounded-2xl transition-all ${
                  activeField === 'name' 
                    ? 'border-white/40 ring-2 ring-white/10 bg-white/[0.06]' 
                    : 'hover:bg-white/[0.05]'
                }`}
              >
                <input
                  ref={nameInputRef}
                  type="text"
                  value={customer.fullName}
                  onChange={(e) => {
                    setErrorMessage(null);
                    updateCustomerName(e.target.value);
                  }}
                  onFocus={() => setActiveField('name')}
                  placeholder={t.identification.namePlaceholder}
                  className="w-full bg-transparent px-5 py-3.5 sm:py-4 text-base sm:text-lg font-medium text-white placeholder:text-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Document Type Selector (iOS Segmented Control) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                {t.identification.docTypeLabel}
              </label>
              <div className="p-1 bg-black/60 rounded-2xl border border-white/[0.06] grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDocTypeChange('ci')}
                  className={`py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    customer.documentType === 'ci'
                      ? 'bg-white/[0.12] text-white shadow-md border border-white/15'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>Cédula de Identidad (CI)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDocTypeChange('cpf')}
                  className={`py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    customer.documentType === 'cpf'
                      ? 'bg-white/[0.12] text-white shadow-md border border-white/15'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>Cadastro Pessoa Física (CPF)</span>
                </button>
              </div>
            </div>

            {/* Document Number Field */}
            <div>
              <label className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  {t.identification.docNumberLabel} ({customer.documentType.toUpperCase()})
                </span>
                {customer.documentNumber.replace(/\D/g, '').length >= 3 && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-normal">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Listo
                  </span>
                )}
              </label>
              <div 
                onClick={() => {
                  setActiveField('document');
                  docInputRef.current?.focus();
                }}
                className={`apple-input rounded-2xl transition-all ${
                  activeField === 'document' 
                    ? 'border-apple-blue ring-2 ring-apple-blue/30 bg-white/[0.08]' 
                    : 'hover:bg-white/[0.07]'
                }`}
              >
                <input
                  ref={docInputRef}
                  type="text"
                  value={customer.documentNumber}
                  onChange={(e) => {
                    setErrorMessage(null);
                    updateCustomerDocument(e.target.value);
                  }}
                  onFocus={() => setActiveField('document')}
                  placeholder={t.identification.docPlaceholder}
                  className="w-full bg-transparent px-5 py-3.5 sm:py-4 text-base sm:text-lg font-medium text-white placeholder:text-zinc-500 focus:outline-none font-mono tracking-wider"
                />
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl active:scale-95 ${
              isFormValid
                ? 'apple-button-primary cursor-pointer'
                : 'bg-white/[0.06] text-zinc-500 border border-white/[0.06] cursor-not-allowed'
            }`}
          >
            <span>{t.identification.btnContinue}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Keypad toggle */}
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => setShowKeypad(!showKeypad)}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{showKeypad ? 'Ocultar teclado' : 'Mostrar teclado táctil'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Touch Keypad Section */}
      {showKeypad && (
        <div className="w-full max-w-2xl mt-3 animate-fade-in">
          <TouchKeypad
            activeInputType={activeField === 'document' ? 'number' : 'text'}
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onSpace={handleSpace}
            onClear={handleClear}
            onSubmit={handleContinue}
          />
        </div>
      )}
    </div>
  );
};

