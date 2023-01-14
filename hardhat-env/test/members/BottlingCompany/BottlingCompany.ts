import { shouldBehaveLikeBottlingCompany } from 'hardhat-env/test/members/BottlingCompany/BottlingCompany.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testBottlingCompany(): void {
  describe(dictContracts.bottlingCompany.v1, function () {
    shouldBehaveLikeBottlingCompany();
  });
}
