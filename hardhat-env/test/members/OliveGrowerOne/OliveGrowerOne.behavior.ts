import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from '@shared/constants';
import { OliveGrowerOne, OliveGrowerOneEscrow, OliveGrowerOneOlives } from '@types';
import shouldBehaveLikeInitialize from '@test/members/OliveGrowerOne/effects/initialize';
import { deployOliveGrowerAndDeps } from '@shared/helpers';

export function shouldBehaveLikeOliveGrowerOne(): void {
  const { oliveGrower } = dictChainActorsNames;
  const { oliveGrowerOne, oliveGrowerOneEscrow, oliveGrowerOneOlives } = dictContracts;

  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { oliveGrower, oliveGrowerOlives, oliveGrowerEscrow } = await deployOliveGrowerAndDeps(
          oliveGrowerOne.v1,
          oliveGrowerOneOlives.v1,
          oliveGrowerOneEscrow.v1,
          baseUri,
          this.signers.deployer,
          uupsOpts
        );
        this.contracts.oliveGrowerOne = oliveGrower.proxy as OliveGrowerOne;
        this.contracts.oliveGrowerOneOlives = oliveGrowerOlives.proxy as OliveGrowerOneOlives;
        this.contracts.oliveGrowerOneEscrow = oliveGrowerEscrow.proxy as OliveGrowerOneEscrow;
      });
      shouldBehaveLikeInitialize(oliveGrower.id1);
    });
  });
}
