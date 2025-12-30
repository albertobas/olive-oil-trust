import { shouldBehaveLikeIndustrialUnitsEscrowUpgradeable } from '@test/escrows/IndustrialUnitsEscrowUpgradeable/IndustrialUnitsEscrowUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testIndustrialUnitsEscrowUpgradeable(): void {
  describe(dictContracts.industrialUnitsEscrowWithInit.v1, function () {
    shouldBehaveLikeIndustrialUnitsEscrowUpgradeable();
  });
}
