import { shouldBehaveLikeDistributorCompany } from 'hardhat-env/test/members/DistributorCompany/DistributorCompany.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testDistributorCompany(): void {
  describe(dictContracts.distributorCompany.v1, function () {
    shouldBehaveLikeDistributorCompany();
  });
}
