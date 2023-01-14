import { shouldBehaveLikeOliveGrowerUpgradeable } from 'hardhat-env/test/roles/OliveGrowerUpgradeable/OliveGrowerUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testOliveGrowerUpgradeable(): void {
  describe(dictContracts.oliveGrowerWithInit.v1, function () {
    shouldBehaveLikeOliveGrowerUpgradeable();
  });
}
