import { TokenEscrowMapping } from '../../generated/types/schema';
import { separator } from '../../utils/constants';

export function registerTokenEscrowMapping(tokenId: string, escrowId: string): void {
  let id = tokenId.concat(separator.concat(escrowId));
  let mapping = new TokenEscrowMapping(id);
  mapping.token = tokenId;
  mapping.escrow = escrowId;
  mapping.save();
}
