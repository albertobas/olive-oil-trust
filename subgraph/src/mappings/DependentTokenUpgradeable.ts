import {
  ApprovalForAll,
  TokenTypeInstructionsSet,
  TokenTypesInstructionsSet,
  BatchTransferred,
  TokenTransferred,
  OwnershipTransferred,
} from '../generated/types/DependentTokenUpgradeableDataSource/DependentTokenUpgradeable';
import { ensureToken } from '../utils/entities/Token';
import { registerTokenTransfer } from '../utils/entities/TokenTransfer';
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { ensureAccount } from '../utils/entities/Account';
import { registerTokenTypeInstructionsSet } from '../utils/entities/TokenTypeInstructionsSet';
import { ensureTokenType } from '../utils/entities/TokenType';
import { ensureOwnershipTransferred } from '../utils/entities/OwnershipTransferred';
import { registerApproval } from '../utils/entities/TokenOperator';
import { ensureTokenContract } from '../utils/entities/TokenContract';

function handleTransferred(
  event: ethereum.Event,
  tokenId: Bytes,
  tokenTypeId: Bytes,
  operatorAddress: Address,
  fromAddress: Address,
  toAddress: Address,
  value: BigInt
): void {
  let operator = ensureAccount(operatorAddress);
  let from = ensureAccount(fromAddress);
  let to = ensureAccount(toAddress);
  let token = ensureToken(tokenTypeId, tokenId, event.address);
  registerTokenTransfer(event, token, operator.id, from.id, to.id, value);
  if (from.id == Address.zero()) {
    let tokenType = ensureTokenType(token.contract, tokenTypeId, event.block.timestamp);
    token.tokenType = tokenType.id;
    token.mintingDate = event.block.timestamp;
    token.save();
  }
}

export function handleTokenTransferred(event: TokenTransferred): void {
  handleTransferred(
    event,
    event.params.tokenId,
    event.params.tokenTypeId,
    event.params.operator,
    event.params.from,
    event.params.to,
    event.params.tokenAmount
  );
}

export function handleBatchTransferred(event: BatchTransferred): void {
  for (let i = 0; i < event.params.tokenIds.length; i++) {
    handleTransferred(
      event,
      event.params.tokenIds[i],
      event.params.tokenTypeIds[i],
      event.params.operator,
      event.params.from,
      event.params.to,
      event.params.tokenAmounts[i]
    );
  }
}

export function handleApprovalForAll(event: ApprovalForAll): void {
  registerApproval(event, event.params.account, event.params.operator, event.params.approved);
}

export function handleTokenTypeInstructionsSet(event: TokenTypeInstructionsSet): void {
  registerTokenTypeInstructionsSet(
    event,
    event.params.tokenTypeId,
    event.params.instructedTokenAddresses,
    event.params.instructedTokenAmounts,
    event.params.instructedTokenTypeIds
  );
}

export function handleTokenTypesInstructionsSet(event: TokenTypesInstructionsSet): void {
  for (let i = 0; i < event.params.tokenTypeIds.length; i++) {
    registerTokenTypeInstructionsSet(
      event,
      event.params.tokenTypeIds[i],
      event.params.instructedTokenAddresses[i],
      event.params.instructedTokenAmounts[i],
      event.params.instructedTokenTypeIds[i]
    );
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let transfer = ensureOwnershipTransferred(event, event.params.previousOwner, event.params.newOwner);
  let contract = ensureTokenContract(event.address);
  contract.owner = transfer.owner;
  contract.save();
}
