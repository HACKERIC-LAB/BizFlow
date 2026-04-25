export type PaymentMethod = 'CASH' | 'MPESA' | 'SPLIT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  method: PaymentMethod;
  status: TransactionStatus;
  mpesaReceipt?: string;
  createdAt: string;
}
