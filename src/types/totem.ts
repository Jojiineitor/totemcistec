export type Language = 'es' | 'pt' | 'en';

export type TotemStep = 
  | 'idle' 
  | 'language_selection'
  | 'identification' 
  | 'service_selection' 
  | 'ticket_summary';

export type BrandId = 'apple' | 'samsung' | 'dji' | 'xiaomi' | 'joog' | 'general';

export type DocumentType = 'ci' | 'cpf';

export interface CustomerData {
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  generatedCode: string; // e.g. "RC-518" or "RO-518"
}

export interface ServiceIssue {
  id: string;
  label: Record<Language, string>;
}

export interface BrandService {
  id: BrandId;
  name: string;
  tagline: Record<Language, string>;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  iconType: string;
  issues: ServiceIssue[];
}

export interface Ticket {
  id: string;
  ticketCode: string; // e.g. "RC-518"
  sequentialNumber: number;
  customer: CustomerData;
  brand: BrandId;
  brandName: string;
  selectedIssue?: string;
  createdAt: string;
  timestamp: number;
  language: Language;
}

export type QueueStatus = 'waiting' | 'calling' | 'completed';

export interface QueueTicket extends Ticket {
  queueStatus: QueueStatus;
  station?: string; // e.g. "Mostrador 1", "Box 2"
  calledAt?: number;
  completedAt?: number;
}

