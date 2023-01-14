export interface IEventOOT {
  id: string;
  emitter: {
    id: string;
  };
  transaction: ITransactionOOT;
}

export interface ITransactionOOT {
  id: string;
  blockNumber: string;
  timestamp: string;
}
