import { shouldBehaveLikeIndustrialUnitsEscrowUpgradeable } from 'hardhat-env/test/escrows/IndustrialUnitsEscrowUpgradeable/IndustrialUnitsEscrowUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testIndustrialUnitsEscrowUpgradeable(): void {
  describe(dictContracts.industrialUnitsEscrowWithInit.v1, function () {
    shouldBehaveLikeIndustrialUnitsEscrowUpgradeable();
  });
}
