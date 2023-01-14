import { shouldBehaveLikeCertifierUpgradeable } from 'hardhat-env/test/roles/CertifierUpgradeable/CertifierUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testCertifierUpgradeable(): void {
  describe(dictContracts.certifierWithInit.v1, function () {
    shouldBehaveLikeCertifierUpgradeable();
  });
}
