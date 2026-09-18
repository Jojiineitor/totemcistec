import { Ticket, QueueTicket, QueueStatus } from '../types/totem';
import { db } from '../services/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  writeBatch, 
  getDocs 
} from 'firebase/firestore';

const STORAGE_KEY = 'cistec_queue_tickets_v1';
const CHANNEL_NAME = 'cistec_queue_bus';

export type QueueActionType = 'ADD' | 'CALL' | 'COMPLETE' | 'DELETE' | 'RESET';

type QueueChangeListener = (
  tickets: QueueTicket[],
  event?: { type: QueueActionType; ticket?: QueueTicket; station?: string }
) => void;

class QueueSyncManager {
  private channel: BroadcastChannel | null = null;
  private sseSource: EventSource | null = null;
  private listeners: Set<QueueChangeListener> = new Set();
  private localTickets: QueueTicket[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.localTickets = this.loadFromStorage();

      // 1. Setup local BroadcastChannel (instant for same machine)
      try {
        if ('BroadcastChannel' in window) {
          this.channel = new BroadcastChannel(CHANNEL_NAME);
          this.channel.onmessage = (event) => {
            const { type, ticket, station } = event.data || {};
            const currentTickets = this.loadFromStorage();
            this.localTickets = currentTickets;
            this.notifyListeners(currentTickets, { type, ticket, station });
          };
        }
      } catch {
        this.channel = null;
      }

      // 2. Storage event listener as fallback
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          const tickets = this.loadFromStorage();
          this.localTickets = tickets;
          this.notifyListeners(tickets);
        }
      });

      // 3. Connect to Server-Sent Events (SSE) for cross-MacBook Wi-Fi synchronization
      this.initSSE();

      // 4. Connect to Google Cloud Firestore for global cloud real-time sync
      this.initFirestore();
    }
  }

  private initFirestore(): void {
    if (typeof window === 'undefined') return;

    try {
      const ticketsCol = collection(db, 'queue_tickets');
      onSnapshot(
        ticketsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudTickets = snapshot.docs.map((d) => d.data() as QueueTicket);
            // Sort by timestamp descending
            cloudTickets.sort((a, b) => b.timestamp - a.timestamp);
            this.localTickets = cloudTickets;
            this.saveToStorage(cloudTickets);
            this.notifyListeners(cloudTickets);
          }
        },
        (error) => {
          // Firestore not yet enabled in console or offline mode; fallback to local bus seamlessly
          console.warn('Firestore sync note:', error.message);
        }
      );
    } catch {
      // Ignored
    }
  }

  private initSSE(): void {
    if (typeof window === 'undefined') return;

    try {
      this.sseSource = new EventSource('/api/queue/stream');

      this.sseSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (Array.isArray(data.tickets)) {
            this.localTickets = data.tickets;
            this.saveToStorage(data.tickets);
            this.notifyListeners(data.tickets, data.event);
          }
        } catch {
          // Parse error
        }
      };

      this.sseSource.onerror = () => {
        // SSE error, will auto-reconnect or fall back to BroadcastChannel
      };
    } catch {
      // EventSource not supported
    }
  }

  private loadFromStorage(): QueueTicket[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as QueueTicket[];
    } catch {
      return [];
    }
  }

  private saveToStorage(tickets: QueueTicket[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {
      // Storage quota or private mode fallback
    }
  }

  public getTickets(): QueueTicket[] {
    if (this.localTickets.length > 0) return this.localTickets;
    return this.loadFromStorage();
  }

  private notify(
    tickets: QueueTicket[],
    event?: { type: QueueActionType; ticket?: QueueTicket; station?: string }
  ): void {
    this.localTickets = tickets;
    this.saveToStorage(tickets);
    this.notifyListeners(tickets, event);

    // Broadcast locally
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: event?.type,
          ticket: event?.ticket,
          station: event?.station,
          timestamp: Date.now(),
        });
      } catch {
        // Ignored
      }
    }

    // Sync across local Wi-Fi to other MacBooks / TV
    if (typeof window !== 'undefined') {
      fetch('/api/queue/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tickets,
          type: event?.type,
          event,
        }),
      }).catch(() => {
        // Server might be in static mode; local broadcast remains active
      });

      // Sync to Google Cloud Firestore in real-time
      try {
        if (event?.ticket && (event.type === 'ADD' || event.type === 'CALL' || event.type === 'COMPLETE')) {
          setDoc(doc(db, 'queue_tickets', event.ticket.id), event.ticket, { merge: true }).catch(() => {});
        } else if (event?.type === 'RESET') {
          getDocs(collection(db, 'queue_tickets')).then((snap) => {
            const batch = writeBatch(db);
            snap.docs.forEach((d) => batch.delete(d.ref));
            tickets.forEach((t) => batch.set(doc(db, 'queue_tickets', t.id), t));
            batch.commit().catch(() => {});
          }).catch(() => {});
        }
      } catch {
        // Firestore offline / not yet configured
      }
    }
  }

  private notifyListeners(
    tickets: QueueTicket[],
    event?: { type: QueueActionType; ticket?: QueueTicket; station?: string }
  ): void {
    this.listeners.forEach((listener) => {
      try {
        listener(tickets, event);
      } catch {
        // Safe boundary
      }
    });
  }

  public subscribe(listener: QueueChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.getTickets());
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Adds a newly registered customer ticket from the Totem into 'waiting' status.
   */
  public addTicket(ticket: Ticket): QueueTicket {
    const queueItem: QueueTicket = {
      ...ticket,
      queueStatus: 'waiting',
    };

    const tickets = this.getTickets();
    const updated = [queueItem, ...tickets.filter((t) => t.id !== ticket.id)];
    this.notify(updated, { type: 'ADD', ticket: queueItem });
    return queueItem;
  }

  /**
   * Calls a specific ticket to a specific station (e.g. "Puesto 1", "Puesto 2", "Puesto 3").
   */
  public callTicket(ticketId: string, stationName = 'Puesto 1'): QueueTicket | null {
    const tickets = this.getTickets();
    let targetTicket: QueueTicket | null = null;

    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        targetTicket = {
          ...t,
          queueStatus: 'calling' as QueueStatus,
          station: stationName,
          calledAt: Date.now(),
        };
        return targetTicket;
      }
      return t;
    });

    if (targetTicket) {
      this.notify(updated, { type: 'CALL', ticket: targetTicket, station: stationName });
    }
    return targetTicket;
  }

  /**
   * Calls the next customer in line specifically for a station ("Puesto 1", "Puesto 2", "Puesto 3").
   * Automatically completes or frees up any previous ticket at this station if needed.
   */
  public callNextForStation(stationName: string): QueueTicket | null {
    const tickets = this.getTickets();
    // Waiting tickets ordered oldest first
    const waiting = tickets
      .filter((t) => t.queueStatus === 'waiting')
      .sort((a, b) => a.timestamp - b.timestamp);

    if (waiting.length === 0) return null;

    const nextTicket = waiting[0];
    return this.callTicket(nextTicket.id, stationName);
  }

  /**
   * Gets the ticket currently being attended at a specific station.
   */
  public getActiveTicketForStation(stationName: string): QueueTicket | null {
    const tickets = this.getTickets();
    return (
      tickets.find(
        (t) => t.queueStatus === 'calling' && (t.station || '').toLowerCase() === stationName.toLowerCase()
      ) || null
    );
  }

  /**
   * Re-calls a ticket (plays sound again on the TV and flashes the station).
   */
  public recallTicket(ticketId: string): QueueTicket | null {
    const tickets = this.getTickets();
    const target = tickets.find((t) => t.id === ticketId);
    if (!target) return null;

    const updatedTicket: QueueTicket = {
      ...target,
      calledAt: Date.now(),
    };

    const updated = tickets.map((t) => (t.id === ticketId ? updatedTicket : t));
    this.notify(updated, { type: 'CALL', ticket: updatedTicket, station: updatedTicket.station });
    return updatedTicket;
  }

  /**
   * Marks a ticket as completed (recepcionado).
   */
  public completeTicket(ticketId: string): QueueTicket | null {
    const tickets = this.getTickets();
    const target = tickets.find((t) => t.id === ticketId);
    if (!target) return null;

    const updatedTicket: QueueTicket = {
      ...target,
      queueStatus: 'completed' as QueueStatus,
      completedAt: Date.now(),
    };

    const updated = tickets.map((t) => (t.id === ticketId ? updatedTicket : t));
    this.notify(updated, { type: 'COMPLETE', ticket: updatedTicket, station: updatedTicket.station });
    return updatedTicket;
  }

  /**
   * Clears the entire queue (reset day).
   */
  public clearQueue(): void {
    this.notify([], { type: 'RESET' });
  }

  /**
   * Seeds demo tickets with 3 distinct stations active for immediate testing.
   */
  public seedDemoTickets(): void {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const demoTickets: QueueTicket[] = [
      {
        id: 'TKT-100001',
        ticketCode: 'RC-518',
        sequentialNumber: 12,
        customer: {
          fullName: 'Rodrigo Coronel',
          documentType: 'ci',
          documentNumber: '6542518',
          generatedCode: 'RC-518',
        },
        brand: 'apple',
        brandName: 'Apple',
        createdAt: timeStr,
        timestamp: Date.now() - 360000,
        language: 'es',
        queueStatus: 'calling',
        station: 'Puesto 1',
        calledAt: Date.now() - 40000,
      },
      {
        id: 'TKT-100002',
        ticketCode: 'MS-315',
        sequentialNumber: 13,
        customer: {
          fullName: 'Marcos Silva',
          documentType: 'cpf',
          documentNumber: '894315201',
          generatedCode: 'MS-315',
        },
        brand: 'joog',
        brandName: 'JOOG',
        createdAt: timeStr,
        timestamp: Date.now() - 250000,
        language: 'pt',
        queueStatus: 'calling',
        station: 'Puesto 2',
        calledAt: Date.now() - 20000,
      },
      {
        id: 'TKT-100003',
        ticketCode: 'AR-708',
        sequentialNumber: 14,
        customer: {
          fullName: 'Ana Ramirez',
          documentType: 'ci',
          documentNumber: '5123708',
          generatedCode: 'AR-708',
        },
        brand: 'samsung',
        brandName: 'Samsung',
        createdAt: timeStr,
        timestamp: Date.now() - 120000,
        language: 'es',
        queueStatus: 'waiting',
      },
      {
        id: 'TKT-100004',
        ticketCode: 'JD-942',
        sequentialNumber: 15,
        customer: {
          fullName: 'Juan Delgado',
          documentType: 'ci',
          documentNumber: '4851942',
          generatedCode: 'JD-942',
        },
        brand: 'dji',
        brandName: 'DJI',
        createdAt: timeStr,
        timestamp: Date.now() - 60000,
        language: 'es',
        queueStatus: 'waiting',
      },
      {
        id: 'TKT-100000',
        ticketCode: 'CB-154',
        sequentialNumber: 11,
        customer: {
          fullName: 'Carlos Benitez',
          documentType: 'ci',
          documentNumber: '3948154',
          generatedCode: 'CB-154',
        },
        brand: 'xiaomi',
        brandName: 'Xiaomi',
        createdAt: timeStr,
        timestamp: Date.now() - 900000,
        language: 'es',
        queueStatus: 'completed',
        station: 'Puesto 3',
        completedAt: Date.now() - 180000,
      },
    ];

    this.notify(demoTickets, { type: 'RESET' });
  }
}

export const queueSync = new QueueSyncManager();
