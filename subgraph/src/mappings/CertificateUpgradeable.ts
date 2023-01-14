import { Address, Bytes, ethereum } from '@graphprotocol/graph-ts';
import {
  BatchCertified,
  OwnershipTransferred,
  TokenCertified
} from 'subgraph/src/generated/types/CertificateUpgradeableDataSource/CertificateUpgradeable';
import { Certificate } from 'subgraph/src/generated/types/schema';
import { ensureCertificate } from 'subgraph/src/utils/entities/Certificate';
import { ensureOwnershipTransferred } from 'subgraph/src/utils/entities/OwnershipTransferred';
import { registerTokenCertification } from 'subgraph/src/utils/entities/TokenCertification';
import { ensureAccount } from 'subgraph/src/utils/entities/Account';
import { ensureCertificateContract } from 'subgraph/src/utils/entities/CertificateContract';
import { getTokenTypeId } from 'subgraph/src/utils/entities/TokenType';
import { registerTokenTypeCertificateMapping } from 'subgraph/src/utils/entities/TokenTypeCertificateMapping';

function handleCertified(
  event: ethereum.Event,
  certificate: Certificate,
  certifierAddress: Address,
  tokenAddress: Bytes,
  tokenTypeIdEvent: Bytes
): void {
  registerTokenCertification(event, certificate, tokenAddress);
  let tokenTypeId = getTokenTypeId(tokenAddress, tokenTypeIdEvent);
  registerTokenTypeCertificateMapping(tokenTypeId, certificate.id);
  let account = ensureAccount(certifierAddress);
  let contract = ensureCertificateContract(event.address);
  contract.owner = account.id;
  contract.save();
}

export function handleTokenCertified(event: TokenCertified): void {
  let certificate = ensureCertificate(event.params.certificateId, event.address, event.block.timestamp);
  handleCertified(
    event,
    certificate,
    event.params.certifierAddress,
    event.params.tokenAddress,
    event.params.tokenTypeId
  );
}

export function handleBatchCertified(event: BatchCertified): void {
  for (let i = 0; i < event.params.certificateIds.length; i++) {
    let certificate = ensureCertificate(event.params.certificateIds[i], event.address, event.block.timestamp);
    handleCertified(
      event,
      certificate,
      event.params.certifierAddress,
      event.params.tokenAddresses[i],
      event.params.tokenTypeIds[i]
    );
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let transfer = ensureOwnershipTransferred(event, event.params.previousOwner, event.params.newOwner);
  let contract = ensureCertificateContract(event.address);
  contract.owner = transfer.owner;
  contract.save();
}
