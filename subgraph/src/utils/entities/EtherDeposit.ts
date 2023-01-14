import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { EtherDeposit } from 'subgraph/src/generated/types/schema';
import { eventId } from 'subgraph/src/utils/helpers';
import { ensureTransaction } from 'subgraph/src/utils/entities/Transaction';
import { decimals } from '@amxx/graphprotocol-utils';
import { ensureEscrow } from 'subgraph/src/utils/entities/Escrow';
import { ensureAccount } from 'subgraph/src/utils/entities/Account';
import { ensureEtherBalance } from 'subgraph/src/utils/entities/Balance';
import { escrowState } from 'subgraph/src/utils/constants';
import { increaseBalance } from 'subgraph/src/utils/entities/helpers/balance';

export function registerEtherDeposit(
  event: ethereum.Event,
  escrowId: BigInt,
  buyerAddress: Address,
  buyerWalletAddress: Address,
  amount: BigInt
): void {
  let escrow = ensureEscrow(escrowId, event.address);
  let account = ensureAccount(event.address);
  let etherBalance = ensureEtherBalance(escrowId.toString(), escrow.contract);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  let id = eventId(event.transaction.hash, event.logIndex, null);
  let deposit = new EtherDeposit(id);
  increaseBalance(etherBalance, amount);
  escrow.etherBalance = etherBalance.id;
  escrow.buyer = buyerAddress;
  escrow.buyerWallet = buyerWalletAddress;
  escrow.price = amount;
  escrow.state = escrowState.ETHER_DEPOSITED;
  escrow.save();
  deposit.buyer = buyerAddress;
  deposit.buyerWallet = buyerWalletAddress;
  deposit.emitter = account.id;
  deposit.escrow = escrow.id;
  deposit.escrowContract = escrow.contract;
  deposit.timestamp = event.block.timestamp;
  deposit.transaction = transaction.id;
  deposit.value = decimals.toDecimals(amount);
  deposit.valueExact = amount;
  deposit.save();
}
