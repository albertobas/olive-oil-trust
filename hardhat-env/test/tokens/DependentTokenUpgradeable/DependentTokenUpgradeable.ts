import { shouldBehaveLikeDependentTokenUpgradeable } from 'hardhat-env/test/tokens/DependentTokenUpgradeable/DependentTokenUpgradeable.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testDependentTokenUpgradeable(): void {
  describe(dictContracts.dependentTokenWithInit.v1, function () {
    shouldBehaveLikeDependentTokenUpgradeable();
  });
}
