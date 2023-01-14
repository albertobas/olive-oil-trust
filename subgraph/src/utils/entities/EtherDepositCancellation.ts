import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { EtherDepositCancellation } from 'subgraph/src/generated/types/schema';
import { eventId } from 'subgraph/src/utils/helpers';
import { ensureTransaction } from 'subgraph/src/utils/entities/Transaction';
import { ensureEscrow } from 'subgraph/src/utils/entities/Escrow';
import { escrowState } from 'subgraph/src/utils/constants';
import { ensureAccount } from 'subgraph/src/utils/entities/Account';

export function registerEtherDepositCancellation(
  event: ethereum.Event,
  escrowId: BigInt,
  buyerId: Bytes,
  buyerWalletId: Bytes
): void {
  let escrow = ensureEscrow(escrowId, event.address);
  let account = ensureAccount(event.address);
  let id = eventId(event.transaction.hash, event.logIndex, null);
  let cancellation = new EtherDepositCancellation(id);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  escrow.state = escrowState.ACTIVE;
  escrow.buyer = null;
  escrow.buyerWallet = null;
  escrow.save();
  cancellation.buyer = buyerId;
  cancellation.buyerWallet = buyerWalletId;
  cancellation.emitter = account.id;
  cancellation.escrow = escrow.id;
  cancellation.escrowContract = escrow.contract;
  cancellation.timestamp = event.block.timestamp;
  cancellation.transaction = transaction.id;
  cancellation.save();
}
