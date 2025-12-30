import { shouldBehaveLikeRetailerCompany } from '@test/members/RetailerCompany/RetailerCompany.behavior';
import { dictContracts } from '@shared/constants';

export function testRetailerCompany(): void {
  describe(dictContracts.retailerCompany.v1, function () {
    shouldBehaveLikeRetailerCompany();
  });
}
