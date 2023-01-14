import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { EscrowClosure } from 'subgraph/src/generated/types/schema';
import { eventId } from 'subgraph/src/utils/helpers';
import { ensureTransaction } from 'subgraph/src/utils/entities/Transaction';
import { ensureEscrow } from 'subgraph/src/utils/entities/Escrow';
import { ensureAccount } from 'subgraph/src/utils/entities/Account';
import { escrowState } from 'subgraph/src/utils/constants';

export function registerEscrowClosure(event: ethereum.Event, escrowId: BigInt): void {
  let escrow = ensureEscrow(escrowId, event.address);
  let account = ensureAccount(event.address);
  escrow.state = escrowState.CLOSED;
  escrow.save();
  let id = eventId(event.transaction.hash, event.logIndex, null);
  let closure = new EscrowClosure(id);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  closure.emitter = account.id;
  closure.escrow = escrow.id;
  closure.escrowContract = escrow.contract;
  closure.timestamp = event.block.timestamp;
  closure.transaction = transaction.id;
  closure.save();
}
