import { shouldBehaveLikeDistributorCompany } from '@test/members/DistributorCompany/DistributorCompany.behavior';
import { dictContracts } from '@shared/constants';

export function testDistributorCompany(): void {
  describe(dictContracts.distributorCompany.v1, function () {
    shouldBehaveLikeDistributorCompany();
  });
}
