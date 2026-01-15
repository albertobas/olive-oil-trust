import { baseUri, dictChainActorsNames, dictContracts, uupsLibOpts } from '@shared/constants';
import { OliveOilMillCompany, OliveOilMillCompanyEscrow, OliveOilMillCompanyOliveOil } from '@types';
import shouldBehaveLikeInitialize from '@test/members/OliveOilMillCompany/effects/initialize';
import { deployOliveOilMillAndDeps } from '@shared/helpers';

export function shouldBehaveLikeOliveOilMillCompany(): void {
  const { oliveOilMill } = dictChainActorsNames;
  const { oliveOilMillCompany, oliveOilMillCompanyEscrow, oliveOilMillCompanyOliveOil, validation } = dictContracts;

  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { oliveOilMill, oliveOilMillOil, oliveOilMillEscrow } = await deployOliveOilMillAndDeps(
          oliveOilMillCompany.v1,
          oliveOilMillCompanyOliveOil.v1,
          oliveOilMillCompanyEscrow.v1,
          validation.v1,
          baseUri,
          this.signers.deployer,
          uupsLibOpts
        );
        this.contracts.oliveOilMillCompany = oliveOilMill.proxy as OliveOilMillCompany;
        this.contracts.oliveOilMillCompanyOliveOil = oliveOilMillOil.proxy as OliveOilMillCompanyOliveOil;
        this.contracts.oliveOilMillCompanyEscrow = oliveOilMillEscrow.proxy as OliveOilMillCompanyEscrow;
      });
      shouldBehaveLikeInitialize(oliveOilMill.id1);
    });
  });
}
