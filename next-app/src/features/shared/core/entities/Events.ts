export interface IEvent {
  id: string;
  emitter: string;
  transaction: ITransaction;
}

export interface ITransaction {
  id: string;
  blockNumber: number;
  timestamp: number;
}
