export interface Event {
  id: string;
  emitter: string;
  transaction: Transaction;
}

export interface Transaction {
  id: string;
  blockNumber: number;
  timestamp: number;
}
