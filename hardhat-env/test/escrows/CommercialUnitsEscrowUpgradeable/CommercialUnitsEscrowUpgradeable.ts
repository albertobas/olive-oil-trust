import { shouldBehaveLikeCommercialUnitsEscrowUpgradeable } from 'hardhat-env/test/escrows/CommercialUnitsEscrowUpgradeable/CommercialUnitsEscrowUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testCommercialUnitsEscrowUpgradeable(): void {
  describe(dictContracts.commercialUnitsEscrowWithInit.v1, function () {
    shouldBehaveLikeCommercialUnitsEscrowUpgradeable();
  });
}
