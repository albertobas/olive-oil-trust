import { shouldBehaveLikeIndependentTokenUpgradeable } from '@test/tokens/IndependentTokenUpgradeable/IndependentTokenUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testIndependentTokenUpgradeable(): void {
  describe(dictContracts.independentTokenWithInit.v1, function () {
    shouldBehaveLikeIndependentTokenUpgradeable();
  });
}
