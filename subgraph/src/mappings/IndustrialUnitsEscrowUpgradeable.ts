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
} from '../generated/types/IndustrialUnitsEscrowUpgradeableDataSource/IndustrialUnitsEscrowUpgradeable';
import { escrowState } from '../utils/constants';
import { ensureEscrow } from '../utils/entities/Escrow';
import { ensureOwnershipTransferred } from '../utils/entities/OwnershipTransferred';
import { registerIndustrialUnitTokenDeposit } from '../utils/entities/TokenDeposit';
import { registerBeforeDepositReversal } from '../utils/entities/BeforeDepositReversal';
import { registerEtherDeposit } from '../utils/entities/EtherDeposit';
import { registerEtherDepositCancellation } from '../utils/entities/EtherDepositCancellation';
import { registerEscrowClosure } from '../utils/entities/EscrowClosure';
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { ensureAccount } from '../utils/entities/Account';
import { ensureEscrowContract } from '../utils/entities/EscrowContract';
import { registerAfterDepositReversal } from '../utils/entities/AfterDepositReversal';
import { handleEtherWithdrawal, handleTokensWithdrawal } from '../utils/entities/helpers/escrow';

function handleTokenDeposit(
  event: ethereum.Event,
  escrowId: BigInt,
  tokenIds: Bytes[],
  tokenAddress: Address,
  sellerAddress: Address,
  sellerWalletAddress: Address,
  price: BigInt
): void {
  let escrow = ensureEscrow(escrowId, event.address);
  let escrowAccount = ensureAccount(event.address);
  escrow.escrowId = escrowId;
  escrow.price = price;
  escrow.seller = sellerAddress;
  escrow.sellerWallet = sellerWalletAddress;
  escrow.state = escrowState.ACTIVE;
  escrow.save();
  for (let i = 0; i < tokenIds.length; i++) {
    registerIndustrialUnitTokenDeposit(
      event,
      escrow,
      escrowAccount,
      tokenAddress,
      tokenIds[i],
      sellerAddress,
      sellerWalletAddress
    );
  }
}

export function handleTokenDeposited(event: TokenDeposited): void {
  handleTokenDeposit(
    event,
    event.params.escrowId,
    [event.params.tokenId],
    event.params.tokenAddress,
    event.params.seller,
    event.params.sellerWallet,
    event.params.tokenPrice
  );
}

export function handleBatchDeposited(event: BatchDeposited): void {
  handleTokenDeposit(
    event,
    event.params.escrowId,
    event.params.tokenIds,
    event.params.tokenAddress,
    event.params.seller,
    event.params.sellerWallet,
    event.params.batchPrice
  );
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
  let tokenAmount = BigInt.fromI32(1);
  handleTokensWithdrawal(event.params.escrowId, event.address, [tokenAmount]);
}

export function handleTokensWithdrawn(event: TokensWithdrawn): void {
  let tokenAmounts: BigInt[] = [];
  for (let i = 0; i < event.params.tokenIds.length; i++) {
    tokenAmounts.push(BigInt.fromI32(1));
  }
  handleTokensWithdrawal(event.params.escrowId, event.address, tokenAmounts);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let transfer = ensureOwnershipTransferred(event, event.params.previousOwner, event.params.newOwner);
  let contract = ensureEscrowContract(event.address);
  contract.owner = transfer.owner;
  contract.save();
}
