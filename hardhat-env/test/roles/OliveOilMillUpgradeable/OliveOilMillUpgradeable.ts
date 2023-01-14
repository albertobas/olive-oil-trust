import { shouldBehaveLikeOliveOilMillUpgradeable } from 'hardhat-env/test/roles/OliveOilMillUpgradeable/OliveOilMillUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testOliveOilMillUpgradeable(): void {
  describe(dictContracts.oliveOilMillWithInit.v1, function () {
    shouldBehaveLikeOliveOilMillUpgradeable();
  });
}
