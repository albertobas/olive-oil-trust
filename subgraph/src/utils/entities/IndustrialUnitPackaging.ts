import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { IndustrialUnitPackaging } from 'subgraph/src/generated/types/schema';
import { ensureTransaction } from 'subgraph/src/utils/entities/Transaction';
import { eventId } from 'subgraph/src/utils/helpers';
import { ensureTokenContract } from 'subgraph/src/utils/entities/TokenContract';
import { registerIndustrialUnitTokenInfo } from 'subgraph/src/utils/entities/IndustrialUnitTokenInfo';
import { ensureIndustrialUnitToken, getTokenId } from 'subgraph/src/utils/entities/Token';

export function registerIndustrialUnitPackaging(
  event: ethereum.Event,
  industrialUnitId: Bytes,
  tokenAddresses: Address[],
  tokenAmounts: BigInt[],
  tokenTypeIds: Bytes[],
  tokenIds: Bytes[],
  ownerId: Bytes
): void {
  let token = ensureIndustrialUnitToken(industrialUnitId, event.address);
  let id = eventId(event.transaction.hash, event.logIndex, token.id);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  let packaging = new IndustrialUnitPackaging(id);
  let commercialUnitIds: string[] = [];
  for (let i = 0; i < tokenAddresses.length; i++) {
    let contract = ensureTokenContract(tokenAddresses[i]);
    let tokenId = getTokenId(tokenTypeIds[i], tokenIds[i], contract.id);
    commercialUnitIds.push(tokenId);
  }
  let tokenInfoId = registerIndustrialUnitTokenInfo(
    token.contract,
    token.id,
    token.identifier,
    tokenAmounts,
    commercialUnitIds
  );
  token.industrialUnitTokenInfo = tokenInfoId;
  token.save();
  packaging.contract = token.contract;
  packaging.idustrialUnitTokenInfo = tokenInfoId;
  packaging.emitter = token.contract;
  packaging.owner = ownerId;
  packaging.timestamp = event.block.timestamp;
  packaging.token = token.id;
  packaging.transaction = transaction.id;
  packaging.save();
}
