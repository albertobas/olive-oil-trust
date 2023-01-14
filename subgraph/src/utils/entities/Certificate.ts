import { Address, BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Certificate } from 'subgraph/src/generated/types/schema';
import { separator } from 'subgraph/src/utils/constants';
import { ensureCertificateContract } from 'subgraph/src/utils/entities/CertificateContract';
import { CertificateUpgradeable } from 'subgraph/src/generated/types/CertificateUpgradeableDataSource/CertificateUpgradeable';
import { getMetadata } from 'subgraph/src/utils/helpers';
import { ensureAccount } from 'subgraph/src/utils/entities/Account';

export function getCertificateId(contractId: Bytes, certificateId: Bytes): string {
  return contractId.toHex().concat(separator).concat(certificateId.toString());
}

export function ensureCertificate(certificateId: Bytes, certificateAddress: Address, timestamp: BigInt): Certificate {
  let certificateContract = ensureCertificateContract(certificateAddress);
  let id = getCertificateId(certificateContract.id, certificateId);
  let certificate = Certificate.load(id);
  if (certificate === null) {
    let certificateIdStr = certificateId.toString();
    let account = ensureAccount(certificateAddress);
    let certificateUpgradeable = CertificateUpgradeable.bind(certificateAddress);
    let uriRes = certificateUpgradeable.try_uri();
    let metadata = getMetadata(certificateIdStr);
    certificate = new Certificate(id);
    certificate.contract = certificateContract.id;
    certificate.identifier = certificateIdStr;
    certificate.creationDate = timestamp;
    certificate.uri = uriRes.reverted ? 'null' : uriRes.value.replaceAll('{id}', certificateIdStr.toString());
    if (metadata) {
      certificate.bottleQuality = metadata.bottleQuality;
      certificate.bottleMaterial = metadata.bottleMaterial;
      if (metadata.bottleSize) {
        certificate.bottleSize = BigInt.fromString(metadata.bottleSize!);
      }
      if (metadata.imageHeight) {
        certificate.imageHeight = BigInt.fromString(metadata.imageHeight!);
      }
      certificate.imagePath = metadata.imagePath;
      if (metadata.imageWidth) {
        certificate.imageWidth = BigInt.fromString(metadata.imageWidth!);
      }
      certificate.description = metadata.description;
      certificate.oliveQuality = metadata.oliveQuality;
      if (metadata.oliveOilAcidity) {
        certificate.oliveOilAcidity = BigDecimal.fromString(metadata.oliveOilAcidity!);
      }
      certificate.oliveOilAroma = metadata.oliveOilAroma;
      certificate.oliveOilBitterness = metadata.oliveOilBitterness;
      certificate.oliveOilColour = metadata.oliveOilColour;
      certificate.oliveOilFruitness = metadata.oliveOilFruitness;
      certificate.oliveOilIntensity = metadata.oliveOilIntensity;
      certificate.oliveOilItching = metadata.oliveOilItching;
      certificate.oliveOrigin = metadata.oliveOrigin;
      certificate.title = metadata.title;
    }
    certificate.save();
    account.asCertificateContract = certificateContract.id;
    account.save();
  }
  return certificate;
}
