import { shouldBehaveLikeDistributorUpgradeable } from '@test/roles/DistributorUpgradeable/DistributorUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testDistributorUpgradeable(): void {
  describe(dictContracts.distributorWithInit.v1, function () {
    shouldBehaveLikeDistributorUpgradeable();
  });
}
