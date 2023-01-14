import { shouldBehaveLikeIndustrialUnitTokenUpgradeable } from 'hardhat-env/test/tokens/IndustrialUnitTokenUpgradeable/IndustrialUnitTokenUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testIndustrialUnitTokenUpgradeable(): void {
  describe(dictContracts.industrialUnitTokenWithInit.v1, function () {
    shouldBehaveLikeIndustrialUnitTokenUpgradeable();
  });
}
