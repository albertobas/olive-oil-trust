import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Ancestor } from '../../generated/types/schema';
import { ensureToken } from '../../utils/entities/Token';
import { separator } from '../../utils/constants';

export function registerTokenAncestry(
  tokenTypeId: Bytes,
  tokenId: Bytes,
  tokenAddress: Address,
  inputAddresses: Address[][],
  inputTokenTypeIds: Bytes[][],
  inputTokenIds: Bytes[][],
  inputTokenAmounts: BigInt[][]
): void {
  let token = ensureToken(tokenTypeId, tokenId, tokenAddress);
  for (let i = 0; i < inputAddresses.length; i++) {
    for (let j = 0; j < inputAddresses[i].length; j++) {
      let ancestorToken = ensureToken(inputTokenTypeIds[i][j], inputTokenIds[i][j], inputAddresses[i][j]);
      let id = ancestorToken.id.concat(separator).concat(token.id);
      let ancestor = Ancestor.load(id);
      if (ancestor === null) {
        ancestor = new Ancestor(id);
        ancestor.amount = inputTokenAmounts[i][j];
        ancestor.descendant = token.id;
        ancestor.token = ancestorToken.id;
        ancestor.save();
      }
    }
  }
}
