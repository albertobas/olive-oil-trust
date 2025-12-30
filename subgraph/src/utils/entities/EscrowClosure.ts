import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { EscrowClosure } from '../../generated/types/schema';
import { eventId } from '../../utils/helpers';
import { ensureTransaction } from '../../utils/entities/Transaction';
import { ensureEscrow } from '../../utils/entities/Escrow';
import { ensureAccount } from '../../utils/entities/Account';
import { escrowState } from '../../utils/constants';

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
