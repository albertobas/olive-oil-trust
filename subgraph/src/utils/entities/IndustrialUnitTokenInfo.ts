import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { IndustrialUnitTokenInfo } from 'subgraph/src/generated/types/schema';
import { separator } from 'subgraph/src/utils/constants';

export function registerIndustrialUnitTokenInfo(
  contractId: Bytes,
  tokenId: string,
  tokenIdentifier: string,
  amounts: BigInt[],
  commercialUnitIds: string[]
): string {
  let id = contractId.toHex().concat(separator).concat(tokenIdentifier);
  let tokenInfo = IndustrialUnitTokenInfo.load(id);
  tokenInfo = new IndustrialUnitTokenInfo(id);
  tokenInfo.amounts = amounts;
  tokenInfo.commercialUnits = commercialUnitIds;
  tokenInfo.industrialUnit = tokenId;
  tokenInfo.save();
  return tokenInfo.id;
}
