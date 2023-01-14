import { shouldBehaveLikeBottleManufacturerUpgradeable } from 'hardhat-env/test/roles/BottleManufacturerUpgradeable/BottleManufacturerUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testBottleManufacturerUpgradeable(): void {
  describe(dictContracts.bottleManufacturerWithInit.v1, function () {
    shouldBehaveLikeBottleManufacturerUpgradeable();
  });
}
