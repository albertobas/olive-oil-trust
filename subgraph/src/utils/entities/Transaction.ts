import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Transaction } from '../../generated/types/schema';

export function ensureTransaction(transactionHash: Bytes, timestamp: BigInt, blockNumber: BigInt): Transaction {
  let transaction = new Transaction(transactionHash.toHex());
  transaction.blockNumber = blockNumber;
  transaction.timestamp = timestamp;
  transaction.save();
  return transaction;
}
