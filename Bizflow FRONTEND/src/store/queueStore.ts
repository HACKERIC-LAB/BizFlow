import { create } from 'zustand';
import { queueApi } from '../services/queueApi';

export interface QueueEntry {
  id: string;
  customerName?: string;
  customerPhone: string;
  serviceName: string;
  status: 'WAITING' | 'SERVING' | 'COMPLETED' | 'SKIPPED';
  position: number;
  checkInTime: string;
  startTime?: string;
}

interface QueueState {
  queueEntries: QueueEntry[];
  nowServing: QueueEntry | null;
  isLoading: boolean;
  fetchQueue: () => Promise<void>;
  checkIn: (data: any) => Promise<void>;
  startServing: (id: string) => Promise<void>;
  complete: (id: string) => Promise<void>;
  skip: (id: string) => Promise<void>;
  setQueue: (entries: QueueEntry[]) => void;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  queueEntries: [],
  nowServing: null,
  isLoading: false,
  setQueue: (entries) => {
    const nowServing = entries.find(e => e.status === 'SERVING') || null;
    const waiting = entries.filter(e => e.status === 'WAITING').sort((a, b) => a.position - b.position);
    set({ queueEntries: waiting, nowServing });
  },
  fetchQueue: async () => {
    set({ isLoading: true });
    try {
      const response = await queueApi.getActive();
      get().setQueue(response.data);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  checkIn: async (data) => {
    await queueApi.checkIn(data);
    await get().fetchQueue();
  },
  startServing: async (id) => {
    await queueApi.startServing(id);
    await get().fetchQueue();
  },
  complete: async (id) => {
    await queueApi.complete(id);
    await get().fetchQueue();
  },
  skip: async (id) => {
    await queueApi.skip(id);
    await get().fetchQueue();
  }
}));
