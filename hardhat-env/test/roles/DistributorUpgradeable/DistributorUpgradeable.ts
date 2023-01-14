import { shouldBehaveLikeDistributorUpgradeable } from 'hardhat-env/test/roles/DistributorUpgradeable/DistributorUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testDistributorUpgradeable(): void {
  describe(dictContracts.distributorWithInit.v1, function () {
    shouldBehaveLikeDistributorUpgradeable();
  });
}
