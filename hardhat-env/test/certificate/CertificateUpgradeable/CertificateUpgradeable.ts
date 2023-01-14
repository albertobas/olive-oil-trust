import { shouldBehaveLikeCertificateUpgradeable } from 'hardhat-env/test/certificate/CertificateUpgradeable/CertificateUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testCertificateUpgradeable(): void {
  describe(dictContracts.certificateWithInit.v1, function () {
    shouldBehaveLikeCertificateUpgradeable();
  });
}
