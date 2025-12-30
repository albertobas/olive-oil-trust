import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { ensureEscrowContract } from '../../../utils/entities/EscrowContract';
import { ensureEscrow } from '../../../utils/entities/Escrow';
import { ensureEscrowBalance, ensureEtherBalance } from '../../../utils/entities/Balance';
import { decreaseBalance } from '../../../utils/entities/helpers/balance';
import { ensureAccount } from '../../../utils/entities/Account';

export function handleEtherWithdrawal(event: ethereum.Event, escrowId: BigInt, amount: BigInt): void {
  let escrow = ensureEscrow(escrowId, event.address);
  let etherBalance = ensureEtherBalance(escrowId.toString(), escrow.contract);
  decreaseBalance(etherBalance, amount);
  escrow.etherBalance = etherBalance.id;
  escrow.save();
}

export function handleTokensWithdrawal(eventEscrowId: BigInt, escrowAddress: Address, amounts: BigInt[]): void {
  let escrow = ensureEscrow(eventEscrowId, escrowAddress);
  let escrowContract = ensureEscrowContract(escrowAddress);
  let escrowAccount = ensureAccount(escrowAddress);
  let escrowBalance = ensureEscrowBalance(escrow.id, escrowContract.id, escrowAccount);
  if (escrowBalance.escrowAmounts) {
    let escrowAmounts: BigInt[] = [];
    for (let i = 0; i < escrowBalance.escrowAmounts!.length; i++) {
      let escrowAmount = escrowBalance.escrowAmounts![i];
      escrowAmount = escrowAmount.minus(amounts[i]);
      escrowAmounts.push(escrowAmount);
    }
    escrowBalance.escrowAmounts = escrowAmounts;
  }
  escrowBalance.save();
}
