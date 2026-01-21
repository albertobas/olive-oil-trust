import { dictChainActorsNames, dictContracts } from '@shared/constants';
import { RetailerCompany, RetailerCompanyEscrow } from '@types';
import shouldBehaveLikeInitialize from '@test/members/RetailerCompany/effects/initialize';
import { deployRetailerAndDeps } from '@shared/helpers';

export function shouldBehaveLikeRetailerCompany(): void {
  const { retailer } = dictChainActorsNames;
  const { retailerCompany, retailerCompanyEscrow } = dictContracts;

  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { retailer, retailerEscrow } = await deployRetailerAndDeps(
          retailerCompany.v1,
          retailerCompanyEscrow.v1,
          this.signers.deployer
        );
        this.contracts.retailerCompany = retailer.proxy as RetailerCompany;
        this.contracts.retailerCompanyEscrow = retailerEscrow.proxy as RetailerCompanyEscrow;
      });
      shouldBehaveLikeInitialize(retailer.id1);
    });
  });
}
