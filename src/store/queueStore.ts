import { create } from 'zustand';
import type { QueueEntry } from '../types/queue';

interface QueueState {
  queueEntries: QueueEntry[];
  nowServing: QueueEntry | null;
  setQueue: (entries: QueueEntry[]) => void;
  updateEntry: (entry: QueueEntry) => void;
  addEntry: (entry: QueueEntry) => void;
  setNowServing: (entry: QueueEntry | null) => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  queueEntries: [],
  nowServing: null,
  setQueue: (entries) => set({ queueEntries: entries }),
  updateEntry: (updatedEntry) =>
    set((state) => ({
      queueEntries: state.queueEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      ),
    })),
  addEntry: (entry) => set((state) => ({ queueEntries: [...state.queueEntries, entry] })),
  setNowServing: (entry) => set({ nowServing: entry }),
}));
