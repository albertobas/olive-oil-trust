import { baseUri, dictChainActorsNames, dictContracts, uupsLibOpts } from 'hardhat-env/shared/constants';
import { OliveOilMillCompany, OliveOilMillCompanyEscrow, OliveOilMillCompanyOliveOil } from 'hardhat-env/types';
import shouldBehaveLikeInitialize from 'hardhat-env/test/members/OliveOilMillCompany/effects/initialize';
import { deployOliveOilMillAndDeps } from 'hardhat-env/shared/helpers';

export function shouldBehaveLikeOliveOilMillCompany(): void {
  const oliveOilMillId = dictChainActorsNames.oliveOilMill.id1;
  const oliveOilMillCompanyContractName = dictContracts.oliveOilMillCompany.v1;
  const oliveOilMillCompanyOliveOilContractName = dictContracts.oliveOilMillCompanyOliveOil.v1;
  const oliveOilMillCompanyEscrowContractName = dictContracts.oliveOilMillCompanyEscrow.v1;
  const uri = baseUri;
  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { oliveOilMill, oliveOilMillOil, oliveOilMillEscrow } = await deployOliveOilMillAndDeps(
          oliveOilMillCompanyContractName,
          oliveOilMillCompanyOliveOilContractName,
          oliveOilMillCompanyEscrowContractName,
          uri,
          this.signers.deployer,
          uupsLibOpts,
          [dictContracts.validation.v1]
        );
        this.contracts.oliveOilMillCompany = oliveOilMill.proxy as OliveOilMillCompany;
        this.contracts.oliveOilMillCompanyOliveOil = oliveOilMillOil.proxy as OliveOilMillCompanyOliveOil;
        this.contracts.oliveOilMillCompanyEscrow = oliveOilMillEscrow.proxy as OliveOilMillCompanyEscrow;
      });
      shouldBehaveLikeInitialize(oliveOilMillId);
    });
  });
}
