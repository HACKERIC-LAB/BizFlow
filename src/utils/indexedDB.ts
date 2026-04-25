import Dexie, { type Table } from 'dexie';
import type { QueueEntry } from '../types/queue';
import type { Transaction } from '../types/transaction';

export interface OfflineQueueEntry extends Omit<QueueEntry, 'id'> {
  tempId?: number;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
}

export interface OfflineTransaction extends Omit<Transaction, 'id'> {
  tempId?: number;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
}

export class BizFlowDB extends Dexie {
  offlineQueue!: Table<OfflineQueueEntry>;
  offlineTransactions!: Table<OfflineTransaction>;
  customersCache!: Table<any>;
  servicesCache!: Table<any>;

  constructor() {
    super('BizFlowDB');
    this.version(1).stores({
      offlineQueue: '++tempId, syncStatus',
      offlineTransactions: '++tempId, syncStatus',
      customersCache: 'id, name, phone',
      servicesCache: 'id, name',
    });
  }
}

export const db = new BizFlowDB();
