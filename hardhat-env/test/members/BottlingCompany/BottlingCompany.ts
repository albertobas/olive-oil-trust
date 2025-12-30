import { shouldBehaveLikeBottlingCompany } from '@test/members/BottlingCompany/BottlingCompany.behavior';
import { dictContracts } from '@shared/constants';

export function testBottlingCompany(): void {
  describe(dictContracts.bottlingCompany.v1, function () {
    shouldBehaveLikeBottlingCompany();
  });
}
