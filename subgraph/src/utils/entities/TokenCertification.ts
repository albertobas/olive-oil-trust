import { Bytes, ethereum } from '@graphprotocol/graph-ts';
import { Certificate, TokenCertification } from 'subgraph/src/generated/types/schema';
import { ensureTransaction } from 'subgraph/src/utils/entities/Transaction';
import { eventId } from 'subgraph/src/utils/helpers';

export function registerTokenCertification(
  event: ethereum.Event,
  certificate: Certificate,
  tokenContractId: Bytes
): void {
  let id = eventId(event.transaction.hash, event.logIndex, certificate.identifier);
  let certification = new TokenCertification(id);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  certification.certificate = certificate.id;
  certification.certificateContract = certificate.contract;
  certification.emitter = certificate.contract;
  certification.tokenContract = tokenContractId;
  certification.transaction = transaction.id;
  certification.timestamp = event.block.timestamp;
  certification.save();
}
