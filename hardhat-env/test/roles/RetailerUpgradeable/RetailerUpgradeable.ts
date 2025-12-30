import { shouldBehaveLikeRetailerUpgradeable } from '@test/roles/RetailerUpgradeable/RetailerUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testRetailerUpgradeable(): void {
  describe(dictContracts.retailerWithInit.v1, function () {
    shouldBehaveLikeRetailerUpgradeable();
  });
}
