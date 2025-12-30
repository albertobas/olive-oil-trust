import { Address, Bytes } from '@graphprotocol/graph-ts';
import { Token } from '../../generated/types/schema';
import { separator } from '../../utils/constants';
import { ensureTokenContract } from '../../utils/entities/TokenContract';
import { ensureAccount } from '../../utils/entities/Account';
import { ensureTokenBalance } from '../../utils/entities/Balance';

export function getTokenId(eventTokenTypeId: Bytes, eventTokenId: Bytes, contractId: Bytes): string {
  return contractId
    .toHex()
    .concat(separator)
    .concat(eventTokenTypeId.toString())
    .concat(separator)
    .concat(eventTokenId.toString());
}

export function getIndustrialUnitTokenId(eventTokenId: Bytes, contractId: Bytes): string {
  return contractId.toHex().concat(separator).concat(eventTokenId.toString());
}

export function ensureToken(tokenTypeId: Bytes, tokenId: Bytes, tokenAddress: Address): Token {
  let contract = ensureTokenContract(tokenAddress);
  let id = getTokenId(tokenTypeId, tokenId, contract.id);
  return getRegisteredToken(id, tokenId, tokenAddress, contract.id);
}

export function ensureIndustrialUnitToken(tokenId: Bytes, tokenAddress: Address): Token {
  let contract = ensureTokenContract(tokenAddress);
  let id = getIndustrialUnitTokenId(tokenId, contract.id);
  return getRegisteredToken(id, tokenId, tokenAddress, contract.id);
}

function getRegisteredToken(id: string, tokenId: Bytes, tokenAddress: Address, contractId: Bytes): Token {
  let token = Token.load(id);
  if (token === null) {
    let account = ensureAccount(tokenAddress);
    let tokenIdStr = tokenId.toString();
    const totalSupply = ensureTokenBalance(id, contractId, null);
    totalSupply.tokenToken = id;
    totalSupply.save();
    token = new Token(id);
    token.contract = contractId;
    token.identifier = tokenIdStr;
    token.totalSupply = totalSupply.id;
    token.save();
    account.asTokenContract = contractId;
    account.save();
  }
  return token;
}
