import { shouldBehaveLikeAgriculturalEscrowUpgradeable } from 'hardhat-env/test/escrows/AgriculturalEscrowUpgradeable/AgriculturalPhaseEscrowUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testAgriculturalEscrowUpgradeable(): void {
  describe(dictContracts.agriculturalEscrowWithInit.v1, function () {
    shouldBehaveLikeAgriculturalEscrowUpgradeable();
  });
}
