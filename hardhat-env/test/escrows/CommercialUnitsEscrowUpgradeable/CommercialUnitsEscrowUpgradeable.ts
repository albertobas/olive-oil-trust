import { shouldBehaveLikeCommercialUnitsEscrowUpgradeable } from '@test/escrows/CommercialUnitsEscrowUpgradeable/CommercialUnitsEscrowUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testCommercialUnitsEscrowUpgradeable(): void {
  describe(dictContracts.commercialUnitsEscrowWithInit.v1, function () {
    shouldBehaveLikeCommercialUnitsEscrowUpgradeable();
  });
}
