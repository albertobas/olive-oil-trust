import { shouldBehaveLikeOliveOilMillCompany } from '@test/members/OliveOilMillCompany/OliveOilMillCompany.behavior';
import { dictContracts } from '@shared/constants';

export function testOliveOilMillCompany(): void {
  describe(dictContracts.oliveOilMillCompany.v1, function () {
    shouldBehaveLikeOliveOilMillCompany();
  });
}
