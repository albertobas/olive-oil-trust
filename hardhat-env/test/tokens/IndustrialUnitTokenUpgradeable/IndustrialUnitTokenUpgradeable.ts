import { shouldBehaveLikeIndustrialUnitTokenUpgradeable } from '@test/tokens/IndustrialUnitTokenUpgradeable/IndustrialUnitTokenUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testIndustrialUnitTokenUpgradeable(): void {
  describe(dictContracts.industrialUnitTokenWithInit.v1, function () {
    shouldBehaveLikeIndustrialUnitTokenUpgradeable();
  });
}
