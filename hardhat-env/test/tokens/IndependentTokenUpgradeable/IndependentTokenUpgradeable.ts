import { shouldBehaveLikeIndependentTokenUpgradeable } from 'hardhat-env/test/tokens/IndependentTokenUpgradeable/IndependentTokenUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testIndependentTokenUpgradeable(): void {
  describe(dictContracts.independentTokenWithInit.v1, function () {
    shouldBehaveLikeIndependentTokenUpgradeable();
  });
}
