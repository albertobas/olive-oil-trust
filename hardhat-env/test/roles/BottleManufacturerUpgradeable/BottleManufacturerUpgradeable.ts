import { shouldBehaveLikeBottleManufacturerUpgradeable } from '@test/roles/BottleManufacturerUpgradeable/BottleManufacturerUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testBottleManufacturerUpgradeable(): void {
  describe(dictContracts.bottleManufacturerWithInit.v1, function () {
    shouldBehaveLikeBottleManufacturerUpgradeable();
  });
}
