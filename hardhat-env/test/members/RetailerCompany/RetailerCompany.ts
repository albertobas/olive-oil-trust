import { shouldBehaveLikeRetailerCompany } from 'hardhat-env/test/members/RetailerCompany/RetailerCompany.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testRetailerCompany(): void {
  describe(dictContracts.retailerCompany.v1, function () {
    shouldBehaveLikeRetailerCompany();
  });
}
