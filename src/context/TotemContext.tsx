import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TotemStep, CustomerData, BrandId, Ticket } from '../types/totem';
import { translations } from '../i18n/translations';
import { generateTicketCode } from '../utils/codeGenerator';
import { queueSync } from '../utils/queueSync';

interface TotemContextType {
  // Navigation & Step
  currentStep: TotemStep;
  setStep: (step: TotemStep) => void;
  goToLanguageSelection: () => void;
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['es'];
  
  // Customer
  customer: CustomerData;
  updateCustomerName: (name: string) => void;
  updateCustomerDocument: (doc: string) => void;
  updateDocumentType: (type: 'ci' | 'cpf') => void;
  
  // Service & Ticket
  selectedBrand: BrandId | null;
  setSelectedBrand: (brand: BrandId | null) => void;
  selectedIssue: string | null;
  setSelectedIssue: (issue: string | null) => void;
  ticket: Ticket | null;
  
  // Flow actions
  startSession: (chosenLang: Language) => void;
  confirmIdentification: () => boolean;
  createTicket: (brand: BrandId, issue?: string) => Ticket;
  resetSession: () => void;
  
  // Auto-reset countdown
  resetCountdown: number | null;
}

const initialCustomer: CustomerData = {
  fullName: '',
  documentType: 'ci',
  documentNumber: '',
  generatedCode: '--',
};

const TotemContext = createContext<TotemContextType | undefined>(undefined);

export const TotemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<TotemStep>('idle');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [language, setLanguageState] = useState<Language>('es');
  const [customer, setCustomer] = useState<CustomerData>(initialCustomer);
  const [selectedBrand, setSelectedBrand] = useState<BrandId | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [resetCountdown, setResetCountdown] = useState<number | null>(null);

  // Translation accessor based on selected language
  const t = translations[language] || translations.es;

  // Language setter
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  // Update customer name & auto-recalc generated code
  const updateCustomerName = useCallback((name: string) => {
    setCustomer(prev => {
      const code = generateTicketCode(name, prev.documentNumber);
      return { ...prev, fullName: name, generatedCode: code };
    });
  }, []);

  // Update customer document number & auto-recalc generated code
  const updateCustomerDocument = useCallback((doc: string) => {
    setCustomer(prev => {
      const code = generateTicketCode(prev.fullName, doc);
      return { ...prev, documentNumber: doc, generatedCode: code };
    });
  }, []);

  const updateDocumentType = useCallback((type: 'ci' | 'cpf') => {
    setCustomer(prev => ({ ...prev, documentType: type }));
  }, []);

  // Reset entire session
  const resetSession = useCallback(() => {
    setCurrentStep('idle');
    setIsLanguageModalOpen(false);
    setCustomer(initialCustomer);
    setSelectedBrand(null);
    setSelectedIssue(null);
    setTicket(null);
    setResetCountdown(null);
  }, []);

  const goToLanguageSelection = useCallback(() => {
    setCurrentStep('language_selection');
  }, []);

  // Start session after language is clicked
  const startSession = useCallback((chosenLang: Language) => {
    setLanguageState(chosenLang);
    setIsLanguageModalOpen(false);
    setCurrentStep('identification');
  }, []);

  const openLanguageModal = useCallback(() => {
    setCurrentStep('language_selection');
  }, []);

  const closeLanguageModal = useCallback(() => {
    setIsLanguageModalOpen(false);
  }, []);

  // Proceed from Identification to Services
  const confirmIdentification = useCallback((): boolean => {
    if (!customer.fullName.trim() || !customer.documentNumber.trim()) {
      return false;
    }
    setCurrentStep('service_selection');
    return true;
  }, [customer]);

  // Create ticket & emit code
  const createTicket = useCallback((brand: BrandId, issue?: string): Ticket => {
    const finalCode = generateTicketCode(customer.fullName, customer.documentNumber);
    const brandName = t.brands[brand]?.name || brand.toUpperCase();
    const now = new Date();
    
    const newTicket: Ticket = {
      id: `TKT-${Date.now().toString().slice(-6)}`,
      ticketCode: finalCode,
      sequentialNumber: Math.floor(Math.random() * 80) + 1,
      customer: {
        ...customer,
        generatedCode: finalCode,
      },
      brand,
      brandName,
      selectedIssue: issue || undefined,
      createdAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      timestamp: Date.now(),
      language,
    };

    setTicket(newTicket);
    setSelectedBrand(brand);
    setSelectedIssue(issue || null);

    // Push in real time to the Reception TV queue bus
    queueSync.addTicket(newTicket);

    setCurrentStep('ticket_summary');
    return newTicket;
  }, [customer, language, t]);

  // Handle countdown when in ticket_summary screen
  useEffect(() => {
    if (currentStep !== 'ticket_summary') {
      setResetCountdown(null);
      return;
    }

    // 15 seconds timer on ticket summary screen
    const initialSeconds = 18;
    setResetCountdown(initialSeconds);

    const interval = setInterval(() => {
      setResetCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          resetSession();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, resetSession]);

  // Global idle timeout (if client walks away during identification or service selection)
  useEffect(() => {
    if (currentStep === 'idle' || currentStep === 'ticket_summary') return;

    let timeout = setTimeout(() => {
      resetSession();
    }, 90000); // 90 seconds timeout

    const handleUserActivity = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        resetSession();
      }, 90000);
    };

    window.addEventListener('pointerdown', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [currentStep, resetSession]);

  return (
    <TotemContext.Provider
      value={{
        currentStep,
        setStep: setCurrentStep,
        goToLanguageSelection,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
        language,
        setLanguage,
        t,
        customer,
        updateCustomerName,
        updateCustomerDocument,
        updateDocumentType,
        selectedBrand,
        setSelectedBrand,
        selectedIssue,
        setSelectedIssue,
        ticket,
        startSession,
        confirmIdentification,
        createTicket,
        resetSession,
        resetCountdown,
      }}
    >
      {children}
    </TotemContext.Provider>
  );
};

export const useTotem = () => {
  const context = useContext(TotemContext);
  if (!context) {
    throw new Error('useTotem must be used within a TotemProvider');
  }
  return context;
};
