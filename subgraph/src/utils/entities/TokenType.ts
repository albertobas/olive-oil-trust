import { BigInt, Bytes, BigDecimal } from '@graphprotocol/graph-ts';
import { TokenType } from '../../generated/types/schema';
import { separator } from '../../utils/constants';
import { getMetadata } from '../../utils/helpers';

export function getTokenTypeId(contractId: Bytes, tokenTypeId: Bytes): string {
  return contractId.toHex().concat(separator).concat(tokenTypeId.toString());
}

export function ensureTokenType(contractId: Bytes, tokenTypeId: Bytes, timestamp: BigInt): TokenType {
  let id = getTokenTypeId(contractId, tokenTypeId);
  let tokenType = TokenType.load(id);
  if (tokenType === null) {
    let tokenTypeIdStr = tokenTypeId.toString();
    tokenType = new TokenType(id);
    tokenType.contract = contractId;
    tokenType.identifier = tokenTypeIdStr;
    tokenType.creationDate = timestamp;
    let metadata = getMetadata(tokenTypeIdStr);
    if (metadata) {
      tokenType.bottleQuality = metadata.bottleQuality;
      tokenType.bottleMaterial = metadata.bottleMaterial;
      if (metadata.bottleSize != '') {
        tokenType.bottleSize = BigInt.fromString(metadata.bottleSize);
      }
      if (metadata.imageHeight != '') {
        tokenType.imageHeight = BigInt.fromString(metadata.imageHeight);
      }
      tokenType.imagePath = metadata.imagePath;
      if (metadata.imageWidth != '') {
        tokenType.imageWidth = BigInt.fromString(metadata.imageWidth);
      }
      tokenType.description = metadata.description;
      tokenType.oliveQuality = metadata.oliveQuality;
      if (metadata.oliveOilAcidity != '') {
        tokenType.oliveOilAcidity = BigDecimal.fromString(metadata.oliveOilAcidity);
      }
      tokenType.oliveOilAroma = metadata.oliveOilAroma;
      tokenType.oliveOilBitterness = metadata.oliveOilBitterness;
      tokenType.oliveOilColour = metadata.oliveOilColour;
      tokenType.oliveOilFruitness = metadata.oliveOilFruitness;
      tokenType.oliveOilIntensity = metadata.oliveOilIntensity;
      tokenType.oliveOilItching = metadata.oliveOilItching;
      tokenType.oliveOrigin = metadata.oliveOrigin;
      tokenType.title = metadata.title;
    }
    tokenType.save();
  }
  return tokenType;
}
