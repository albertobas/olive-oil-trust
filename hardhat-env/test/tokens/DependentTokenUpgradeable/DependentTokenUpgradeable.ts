import { shouldBehaveLikeDependentTokenUpgradeable } from '@test/tokens/DependentTokenUpgradeable/DependentTokenUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testDependentTokenUpgradeable(): void {
  describe(dictContracts.dependentTokenWithInit.v1, function () {
    shouldBehaveLikeDependentTokenUpgradeable();
  });
}
