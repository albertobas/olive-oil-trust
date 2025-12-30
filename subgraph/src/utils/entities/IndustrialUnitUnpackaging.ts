import { IndustrialUnitUnpackaging } from '../../generated/types/schema';
import { eventId } from '../../utils/helpers';
import { ensureIndustrialUnitToken } from '../../utils/entities/Token';
import { ensureTransaction } from '../../utils/entities/Transaction';
import { Bytes, ethereum } from '@graphprotocol/graph-ts';

export function registerIndustrialUnitUnpackaging(event: ethereum.Event, palletId: Bytes, ownerId: Bytes): void {
  let token = ensureIndustrialUnitToken(palletId, event.address);
  let id = eventId(event.transaction.hash, event.logIndex, token.id);
  let unpackaging = new IndustrialUnitUnpackaging(id);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  unpackaging.contract = token.contract;
  unpackaging.emitter = token.contract;
  unpackaging.owner = ownerId;
  unpackaging.timestamp = event.block.timestamp;
  unpackaging.token = token.id;
  unpackaging.transaction = transaction.id;
  unpackaging.save();
}
