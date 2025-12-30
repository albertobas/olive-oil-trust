import {
  ApprovalForAll,
  BatchTransferred,
  TokenTransferred,
  OwnershipTransferred,
  BatchPacked,
  BatchUnpacked,
  SinglePacked,
  SingleUnpacked
} from '../generated/types/IndustrialUnitTokenUpgradeableDataSource/IndustrialUnitTokenUpgradeable';
import { ensureIndustrialUnitToken } from '../utils/entities/Token';
import { registerTokenTransfer } from '../utils/entities/TokenTransfer';
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { ensureOwnershipTransferred } from '../utils/entities/OwnershipTransferred';
import { ensureAccount } from '../utils/entities/Account';
import { registerApproval } from '../utils/entities/TokenOperator';
import { registerIndustrialUnitPackaging } from '../utils/entities/IndustrialUnitPackaging';
import { registerIndustrialUnitUnpackaging } from '../utils/entities/IndustrialUnitUnpackaging';
import { ensureTokenContract } from '../utils/entities/TokenContract';

function handleTransferred(
  event: ethereum.Event,
  tokenId: Bytes,
  operatorAddress: Address,
  fromAddress: Address,
  toAddress: Address,
  value: BigInt
): void {
  let operator = ensureAccount(operatorAddress);
  let from = ensureAccount(fromAddress);
  let to = ensureAccount(toAddress);
  let token = ensureIndustrialUnitToken(tokenId, event.address);
  registerTokenTransfer(event, token, operator.id, from.id, to.id, value);
  if (from.id == Address.zero()) {
    token.mintingDate = event.block.timestamp;
    token.save();
  }
}

export function handleTokenTransferred(event: TokenTransferred): void {
  handleTransferred(
    event,
    event.params.tokenId,
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

export function handleSinglePacked(event: SinglePacked): void {
  registerIndustrialUnitPackaging(
    event,
    event.params.palletId,
    event.params.tokenAddresses,
    event.params.tokenAmounts,
    event.params.tokenTypeIds,
    event.params.tokenIds,
    event.params.owner
  );
}

export function handleBatchPacked(event: BatchPacked): void {
  for (let i = 0; i < event.params.palletIds.length; i++) {
    registerIndustrialUnitPackaging(
      event,
      event.params.palletIds[i],
      event.params.tokenAddresses[i],
      event.params.tokenAmounts[i],
      event.params.tokenTypeIds[i],
      event.params.tokenIds[i],
      event.params.owner
    );
  }
}

export function handleSingleUnpacked(event: SingleUnpacked): void {
  registerIndustrialUnitUnpackaging(event, event.params.palletId, event.params.owner);
}

export function handleBatchUnpacked(event: BatchUnpacked): void {
  for (let i = 0; i < event.params.palletIds.length; i++) {
    registerIndustrialUnitUnpackaging(event, event.params.palletIds[i], event.params.owner);
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let transfer = ensureOwnershipTransferred(event, event.params.previousOwner, event.params.newOwner);
  let contract = ensureTokenContract(event.address);
  contract.owner = transfer.owner;
  contract.save();
}
