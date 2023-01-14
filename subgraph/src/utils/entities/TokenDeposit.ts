import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { Escrow, TokenDeposit, Account } from 'subgraph/src/generated/types/schema';
import { eventId } from 'subgraph/src/utils/helpers';
import { ensureEscrowBalance } from 'subgraph/src/utils/entities/Balance';
import { registerTokenEscrowMapping } from 'subgraph/src/utils/entities/TokenEscrowMapping';
import { ensureTransaction } from 'subgraph/src/utils/entities/Transaction';
import { getIndustrialUnitTokenId, getTokenId } from 'subgraph/src/utils/entities/Token';
import { ensureTokenContract } from 'subgraph/src/utils/entities/TokenContract';
import { ensureEscrowContract } from 'subgraph/src/utils/entities/EscrowContract';

export function registerTokenDeposit(
  event: ethereum.Event,
  escrow: Escrow,
  escrowAccount: Account,
  tokenAddress: Address,
  eventTokenTypeId: Bytes,
  eventTokenId: Bytes,
  sellerAddress: Address,
  sellerWalletAddress: Address,
  amount: BigInt
): void {
  let tokenContract = ensureTokenContract(tokenAddress);
  let tokenId = getTokenId(eventTokenTypeId, eventTokenId, tokenContract.id);
  registerDeposit(event, tokenId, tokenContract.id, escrow, escrowAccount, sellerAddress, sellerWalletAddress, amount);
}

export function registerIndustrialUnitTokenDeposit(
  event: ethereum.Event,
  escrow: Escrow,
  escrowAccount: Account,
  tokenAddress: Address,
  eventTokenId: Bytes,
  sellerAddress: Address,
  sellerWalletAddress: Address
): void {
  let tokenContract = ensureTokenContract(tokenAddress);
  let tokenId = getIndustrialUnitTokenId(eventTokenId, tokenContract.id);
  let amount = BigInt.fromI32(1);
  registerDeposit(event, tokenId, tokenContract.id, escrow, escrowAccount, sellerAddress, sellerWalletAddress, amount);
}

function registerDeposit(
  event: ethereum.Event,
  tokenId: string,
  tokenContractId: Bytes,
  escrow: Escrow,
  escrowAccount: Account,
  sellerAddress: Address,
  sellerWalletAddress: Address,
  amount: BigInt
): void {
  let escrowBalance = ensureEscrowBalance(escrow.id, escrow.contract, escrowAccount);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  let id = eventId(event.transaction.hash, event.logIndex, null);
  let deposit = new TokenDeposit(id);
  deposit.amount = amount;
  deposit.emitter = escrowAccount.id;
  deposit.escrow = escrow.id;
  deposit.escrowContract = escrowAccount.id;
  deposit.seller = sellerAddress;
  deposit.sellerWallet = sellerWalletAddress;
  deposit.timestamp = event.block.timestamp;
  deposit.token = tokenId;
  deposit.tokenContract = tokenContractId;
  deposit.transaction = transaction.id;
  deposit.save();
  escrowBalance.escrowEscrow = escrow.id;

  if (escrowBalance.escrowAmounts) {
    let escrowAmounts = escrowBalance.escrowAmounts;
    escrowAmounts!.push(amount);
    escrowBalance.escrowAmounts = escrowAmounts;
  } else {
    escrowBalance.escrowAmounts = [amount];
  }
  if (escrowBalance.escrowTokens) {
    escrowBalance.escrowTokens!.push(tokenId);

    let escrowTokens = escrowBalance.escrowTokens;
    escrowTokens!.push(tokenId);
    escrowBalance.escrowTokens = escrowTokens;
  } else {
    escrowBalance.escrowTokens = [tokenId];
  }
  escrowBalance.save();
  registerTokenEscrowMapping(tokenId, escrow.id);
  ensureEscrowContract(event.address);
}
