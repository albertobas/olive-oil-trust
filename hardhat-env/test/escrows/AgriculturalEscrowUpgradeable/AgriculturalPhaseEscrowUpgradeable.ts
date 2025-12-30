import { shouldBehaveLikeAgriculturalEscrowUpgradeable } from '@test/escrows/AgriculturalEscrowUpgradeable/AgriculturalPhaseEscrowUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testAgriculturalEscrowUpgradeable(): void {
  describe(dictContracts.agriculturalEscrowWithInit.v1, function () {
    shouldBehaveLikeAgriculturalEscrowUpgradeable();
  });
}
