import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from 'hardhat-env/shared/constants';
import { OliveGrowerOne, OliveGrowerOneEscrow, OliveGrowerOneOlives } from 'hardhat-env/types';
import shouldBehaveLikeInitialize from 'hardhat-env/test/members/OliveGrowerOne/effects/initialize';
import { deployOliveGrowerAndDeps } from 'hardhat-env/shared/helpers';

export function shouldBehaveLikeOliveGrowerOne(): void {
  const oliveGrowerId = dictChainActorsNames.oliveGrower.id1;
  const oliveGrowerOneContractName = dictContracts.oliveGrowerOne.v1;
  const oliveGrowerOneOlivesContractName = dictContracts.oliveGrowerOneOlives.v1;
  const oliveGrowerOneEscrowContractName = dictContracts.oliveGrowerOneEscrow.v1;
  const uri = baseUri;
  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { oliveGrower, oliveGrowerOlives, oliveGrowerEscrow } = await deployOliveGrowerAndDeps(
          oliveGrowerOneContractName,
          oliveGrowerOneOlivesContractName,
          oliveGrowerOneEscrowContractName,
          uri,
          this.signers.deployer,
          uupsOpts
        );
        this.contracts.oliveGrowerOne = oliveGrower.proxy as OliveGrowerOne;
        this.contracts.oliveGrowerOneOlives = oliveGrowerOlives.proxy as OliveGrowerOneOlives;
        this.contracts.oliveGrowerOneEscrow = oliveGrowerEscrow.proxy as OliveGrowerOneEscrow;
      });
      shouldBehaveLikeInitialize(oliveGrowerId);
    });
  });
}
