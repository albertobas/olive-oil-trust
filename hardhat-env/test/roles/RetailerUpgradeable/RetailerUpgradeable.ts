import { shouldBehaveLikeRetailerUpgradeable } from 'hardhat-env/test/roles/RetailerUpgradeable/RetailerUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testRetailerUpgradeable(): void {
  describe(dictContracts.retailerWithInit.v1, function () {
    shouldBehaveLikeRetailerUpgradeable();
  });
}
