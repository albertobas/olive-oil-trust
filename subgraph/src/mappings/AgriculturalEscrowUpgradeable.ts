import {
  BatchDeposited,
  PaymentCancelled,
  Closed,
  EtherDeposited,
  EtherWithdrawn,
  OwnershipTransferred,
  RevertedAfterPayment,
  RevertedBeforePayment,
  TokenDeposited,
  TokenWithdrawn,
  TokensWithdrawn
} from '../generated/types/AgriculturalEscrowUpgradeableDataSource/AgriculturalEscrowUpgradeable';
import { escrowState } from '../utils/constants';
import { ensureEscrow } from '../utils/entities/Escrow';
import { ensureOwnershipTransferred } from '../utils/entities/OwnershipTransferred';
import { registerTokenDeposit } from '../utils/entities/TokenDeposit';
import { registerBeforeDepositReversal } from '../utils/entities/BeforeDepositReversal';
import { registerEtherDeposit } from '../utils/entities/EtherDeposit';
import { registerEtherDepositCancellation } from '../utils/entities/EtherDepositCancellation';
import { registerEscrowClosure } from '../utils/entities/EscrowClosure';
import { ensureAccount } from '../utils/entities/Account';
import { ensureMemberContract } from '../utils/entities/MemberContract';
import { registerAfterDepositReversal } from '../utils/entities/AfterDepositReversal';
import { handleEtherWithdrawal, handleTokensWithdrawal } from '../utils/entities/helpers/escrow';
import { ensureEscrowContract } from '../utils/entities/EscrowContract';

export function handleTokenDeposited(event: TokenDeposited): void {
  let escrow = ensureEscrow(event.params.escrowId, event.address);
  let escrowAccount = ensureAccount(event.address);
  escrow.escrowId = event.params.escrowId;
  escrow.seller = event.params.seller;
  escrow.sellerWallet = event.params.sellerWallet;
  escrow.state = escrowState.ACTIVE;
  escrow.save();
  registerTokenDeposit(
    event,
    escrow,
    escrowAccount,
    event.params.tokenAddress,
    event.params.tokenTypeId,
    event.params.tokenId,
    event.params.seller,
    event.params.sellerWallet,
    event.params.tokenAmount
  );
}

export function handleBatchDeposited(event: BatchDeposited): void {
  let escrow = ensureEscrow(event.params.escrowId, event.address);
  let escrowAccount = ensureAccount(event.address);
  if (escrowAccount.asMemberContract === null) {
    let member = ensureMemberContract(event.params.seller);
    escrowAccount.asMemberContract = member.id;
    escrowAccount.save();
  }
  escrow.escrowId = event.params.escrowId;
  escrow.seller = event.params.seller;
  escrow.sellerWallet = event.params.sellerWallet;
  escrow.state = escrowState.ACTIVE;
  escrow.save();
  for (let i = 0; i < event.params.tokenIds.length; i++) {
    registerTokenDeposit(
      event,
      escrow,
      escrowAccount,
      event.params.tokenAddress,
      event.params.tokenTypeIds[i],
      event.params.tokenIds[i],
      event.params.seller,
      event.params.sellerWallet,
      event.params.tokenAmounts[i]
    );
  }
}

export function handleRevertedBeforePayment(event: RevertedBeforePayment): void {
  registerBeforeDepositReversal(event, event.params.escrowId);
}

export function handleEtherDeposited(event: EtherDeposited): void {
  registerEtherDeposit(
    event,
    event.params.escrowId,
    event.params.buyer,
    event.params.buyerWallet,
    event.params.weiAmount
  );
}

export function handlePaymentCancelled(event: PaymentCancelled): void {
  registerEtherDepositCancellation(event, event.params.escrowId, event.params.buyer, event.params.buyerWallet);
}

export function handleRevertedAfterPayment(event: RevertedAfterPayment): void {
  registerAfterDepositReversal(event, event.params.escrowId);
}

export function handleClosed(event: Closed): void {
  registerEscrowClosure(event, event.params.escrowId);
}

export function handleEtherWithdrawn(event: EtherWithdrawn): void {
  handleEtherWithdrawal(event, event.params.escrowId, event.params.weiAmount);
}

export function handleTokenWithdrawn(event: TokenWithdrawn): void {
  handleTokensWithdrawal(event.params.escrowId, event.address, [event.params.tokenAmount]);
}

export function handleTokensWithdrawn(event: TokensWithdrawn): void {
  for (let i = 0; i < event.params.tokenIds.length; i++) {}
  handleTokensWithdrawal(event.params.escrowId, event.address, event.params.tokenAmounts);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let transfer = ensureOwnershipTransferred(event, event.params.previousOwner, event.params.newOwner);
  let contract = ensureEscrowContract(event.address);
  contract.owner = transfer.owner;
  contract.save();
}
