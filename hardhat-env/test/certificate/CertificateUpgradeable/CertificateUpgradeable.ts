import { shouldBehaveLikeCertificateUpgradeable } from '@test/certificate/CertificateUpgradeable/CertificateUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testCertificateUpgradeable(): void {
  describe(dictContracts.certificateWithInit.v1, function () {
    shouldBehaveLikeCertificateUpgradeable();
  });
}
