import { shouldBehaveLikeCertifierUpgradeable } from '@test/roles/CertifierUpgradeable/CertifierUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testCertifierUpgradeable(): void {
  describe(dictContracts.certifierWithInit.v1, function () {
    shouldBehaveLikeCertifierUpgradeable();
  });
}
