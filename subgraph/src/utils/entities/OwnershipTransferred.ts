import { Address, ethereum } from '@graphprotocol/graph-ts';
import { OwnershipTransferred } from 'subgraph/src/generated/types/schema';
import { ensureTransaction } from 'subgraph/src/utils/entities/Transaction';
import { ensureAccount } from 'subgraph/src/utils/entities/Account';
import { eventId } from 'subgraph/src/utils/helpers';

export function ensureOwnershipTransferred(
  event: ethereum.Event,
  previousOwnerAddress: Address,
  newOwnerAddress: Address
): OwnershipTransferred {
  let id = eventId(event.transaction.hash, event.logIndex, null);
  let transfer = new OwnershipTransferred(id);
  let emitterAccount = ensureAccount(event.address);
  let previousOwnerAccount = ensureAccount(previousOwnerAddress);
  let newOwnerAccount = ensureAccount(newOwnerAddress);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  transfer.emitter = emitterAccount.id;
  transfer.owner = newOwnerAccount.id;
  transfer.previousOwner = previousOwnerAccount.id;
  transfer.timestamp = event.block.timestamp;
  transfer.transaction = transaction.id;
  transfer.save();
  return transfer;
}
