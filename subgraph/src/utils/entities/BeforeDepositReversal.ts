import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { BeforeDepositReversal } from 'subgraph/src/generated/types/schema';
import { eventId } from 'subgraph/src/utils/helpers';
import { ensureTransaction } from 'subgraph/src/utils/entities/Transaction';
import { ensureEscrow } from 'subgraph/src/utils/entities/Escrow';
import { ensureAccount } from 'subgraph/src/utils/entities/Account';
import { escrowState } from 'subgraph/src/utils/constants';

export function registerBeforeDepositReversal(event: ethereum.Event, escrowId: BigInt): void {
  let escrow = ensureEscrow(escrowId, event.address);
  let account = ensureAccount(event.address);
  let id = eventId(event.transaction.hash, event.logIndex, null);
  let reversal = new BeforeDepositReversal(id);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  escrow.state = escrowState.REVERTED_BEFORE_PAYMENT;
  escrow.save();
  reversal.emitter = account.id;
  reversal.escrow = escrow.id;
  reversal.escrowContract = escrow.contract;
  reversal.timestamp = event.block.timestamp;
  reversal.transaction = transaction.id;
  reversal.save();
}
