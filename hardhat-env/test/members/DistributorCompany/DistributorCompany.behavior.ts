import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from '@shared/constants';
import { DistributorCompany, DistributorCompanyPallet, DistributorCompanyEscrow } from '@types';
import shouldBehaveLikeInitialize from '@test/members/DistributorCompany/effects/initialize';
import { deployDistributorAndDeps } from '@shared/helpers';

export function shouldBehaveLikeDistributorCompany(): void {
  const { distributor } = dictChainActorsNames;
  const { distributorCompany, distributorCompanyEscrow, distributorCompanyPallet } = dictContracts;

  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { distributor, distributorPallet, distributorEscrow } = await deployDistributorAndDeps(
          distributorCompany.v1,
          distributorCompanyPallet.v1,
          distributorCompanyEscrow.v1,
          baseUri,
          this.signers.deployer,
          uupsOpts
        );
        this.contracts.distributorCompany = distributor.proxy as DistributorCompany;
        this.contracts.distributorCompanyPallet = distributorPallet.proxy as DistributorCompanyPallet;
        this.contracts.distributorCompanyEscrow = distributorEscrow.proxy as DistributorCompanyEscrow;
      });
      shouldBehaveLikeInitialize(distributor.id1);
    });
  });
}
