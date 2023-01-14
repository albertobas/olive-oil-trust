import { shouldBehaveLikeOliveGrowerOne } from 'hardhat-env/test/members/OliveGrowerOne/OliveGrowerOne.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testOliveGrowerOne(): void {
  describe(dictContracts.oliveGrowerOne.v1, function () {
    shouldBehaveLikeOliveGrowerOne();
  });
}
