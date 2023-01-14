import { shouldBehaveLikeOliveOilMillCompany } from 'hardhat-env/test/members/OliveOilMillCompany/OliveOilMillCompany.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testOliveOilMillCompany(): void {
  describe(dictContracts.oliveOilMillCompany.v1, function () {
    shouldBehaveLikeOliveOilMillCompany();
  });
}
