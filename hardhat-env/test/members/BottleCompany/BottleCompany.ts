import { shouldBehaveLikeBottleCompany } from 'hardhat-env/test/members/BottleCompany/BottleCompany.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testBottleCompany(): void {
  describe(dictContracts.bottleCompany.v1, function () {
    shouldBehaveLikeBottleCompany();
  });
}
