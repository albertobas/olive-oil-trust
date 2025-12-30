import { shouldBehaveLikeBottleCompany } from '@test/members/BottleCompany/BottleCompany.behavior';
import { dictContracts } from '@shared/constants';

export function testBottleCompany(): void {
  describe(dictContracts.bottleCompany.v1, function () {
    shouldBehaveLikeBottleCompany();
  });
}
