import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from '@shared/constants';
import { DistributorCompany, DistributorCompanyPallet, DistributorCompanyEscrow } from '@types';
import shouldBehaveLikeInitialize from '@test/members/DistributorCompany/effects/initialize';
import { deployDistributorAndDeps } from '@shared/helpers';

export function shouldBehaveLikeDistributorCompany(): void {
  const distributorPlantId = dictChainActorsNames.distributor.id1;
  const distributorCompanyContractName = dictContracts.distributorCompany.v1;
  const distributorCompanyPalletContractName = dictContracts.distributorCompanyPallet.v1;
  const distributorCompanyEscrowContractName = dictContracts.distributorCompanyEscrow.v1;
  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { distributor, distributorPallet, distributorEscrow } = await deployDistributorAndDeps(
          distributorCompanyContractName,
          distributorCompanyPalletContractName,
          distributorCompanyEscrowContractName,
          baseUri,
          this.signers.deployer,
          uupsOpts
        );
        this.contracts.distributorCompany = distributor.proxy as DistributorCompany;
        this.contracts.distributorCompanyPallet = distributorPallet.proxy as DistributorCompanyPallet;
        this.contracts.distributorCompanyEscrow = distributorEscrow.proxy as DistributorCompanyEscrow;
      });
      shouldBehaveLikeInitialize(distributorPlantId);
    });
  });
}
