import { shouldBehaveLikeBottlingPlantUpgradeable } from '@test/roles/BottlingPlantUpgradeable/BottlingPlantUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testBottlingPlantUpgradeable(): void {
  describe(dictContracts.bottlingPlantWithInit.v1, function () {
    shouldBehaveLikeBottlingPlantUpgradeable();
  });
}
