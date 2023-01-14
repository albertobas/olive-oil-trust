import { shouldBehaveLikeBottlingPlantUpgradeable } from 'hardhat-env/test/roles/BottlingPlantUpgradeable/BottlingPlantUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testBottlingPlantUpgradeable(): void {
  describe(dictContracts.bottlingPlantWithInit.v1, function () {
    shouldBehaveLikeBottlingPlantUpgradeable();
  });
}
