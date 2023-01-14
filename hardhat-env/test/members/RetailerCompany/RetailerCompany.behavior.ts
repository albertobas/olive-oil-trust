import { dictChainActorsNames, dictContracts } from 'hardhat-env/shared/constants';
import { RetailerCompany, RetailerCompanyEscrow } from 'hardhat-env/types';
import shouldBehaveLikeInitialize from 'hardhat-env/test/members/RetailerCompany/effects/initialize';
import { deployRetailerAndDeps } from 'hardhat-env/shared/helpers';

export function shouldBehaveLikeRetailerCompany(): void {
  const retailerId = dictChainActorsNames.retailer.id1;
  const retailerCompanyContractName = dictContracts.retailerCompany.v1;
  const retailerCompanyEscrowContractName = dictContracts.retailerCompanyEscrow.v1;
  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { retailer, retailerEscrow } = await deployRetailerAndDeps(
          retailerCompanyContractName,
          retailerCompanyEscrowContractName,
          this.signers.deployer
        );
        this.contracts.retailerCompany = retailer.proxy as RetailerCompany;
        this.contracts.retailerCompanyEscrow = retailerEscrow.proxy as RetailerCompanyEscrow;
      });
      shouldBehaveLikeInitialize(retailerId);
    });
  });
}
