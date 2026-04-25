export type QueueStatus = 'WAITING' | 'SERVING' | 'COMPLETED' | 'SKIPPED';

export interface QueueEntry {
  id: string;
  position: number;
  customerName: string;
  service: string;
  status: QueueStatus;
  estimatedWait: number; // in minutes
}
