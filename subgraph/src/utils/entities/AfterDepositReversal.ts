import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { AfterDepositReversal } from '../../generated/types/schema';
import { eventId } from '../../utils/helpers';
import { ensureTransaction } from '../../utils/entities/Transaction';
import { ensureEscrow } from '../../utils/entities/Escrow';
import { ensureAccount } from '../../utils/entities/Account';
import { escrowState } from '../../utils/constants';

export function registerAfterDepositReversal(event: ethereum.Event, escrowId: BigInt): void {
  let escrow = ensureEscrow(escrowId, event.address);
  let account = ensureAccount(event.address);
  let id = eventId(event.transaction.hash, event.logIndex, null);
  let reversal = new AfterDepositReversal(id);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  escrow.state = escrowState.REVERTED_AFTER_PAYMENT;
  escrow.save();
  reversal.emitter = account.id;
  reversal.escrow = escrow.id;
  reversal.escrowContract = escrow.contract;
  reversal.timestamp = event.block.timestamp;
  reversal.transaction = transaction.id;
  reversal.save();
}
