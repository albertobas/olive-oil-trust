import { shouldBehaveLikeOliveOilMillUpgradeable } from '@test/roles/OliveOilMillUpgradeable/OliveOilMillUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testOliveOilMillUpgradeable(): void {
  describe(dictContracts.oliveOilMillWithInit.v1, function () {
    shouldBehaveLikeOliveOilMillUpgradeable();
  });
}
