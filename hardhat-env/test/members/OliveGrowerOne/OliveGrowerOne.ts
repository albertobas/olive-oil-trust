import { shouldBehaveLikeOliveGrowerOne } from '@test/members/OliveGrowerOne/OliveGrowerOne.behavior';
import { dictContracts } from '@shared/constants';

export function testOliveGrowerOne(): void {
  describe(dictContracts.oliveGrowerOne.v1, function () {
    shouldBehaveLikeOliveGrowerOne();
  });
}
