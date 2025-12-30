import { shouldBehaveLikeOliveGrowerUpgradeable } from '@test/roles/OliveGrowerUpgradeable/OliveGrowerUpgradeable.behavior';
import { dictContracts } from '@shared/constants';

export function testOliveGrowerUpgradeable(): void {
  describe(dictContracts.oliveGrowerWithInit.v1, function () {
    shouldBehaveLikeOliveGrowerUpgradeable();
  });
}
