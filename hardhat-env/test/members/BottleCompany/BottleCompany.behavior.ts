import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from '@shared/constants';
import shouldBehaveLikeInitialize from '@test/members/BottleCompany/effects/initialize';
import { deployBottleManufacturerAndDeps } from '@shared/helpers';
import { BottleCompany, BottleCompanyBottle, BottleCompanyEscrow } from '@types';

export function shouldBehaveLikeBottleCompany(): void {
  const bottleCompanyId = dictChainActorsNames.bottleManufacturer.id1;
  const bottleCompanyContractName = dictContracts.bottleCompany.v1;
  const bottleCompanyBottleContractName = dictContracts.bottleCompanyBottle.v1;
  const bottleCompanyEscrowContractName = dictContracts.bottleCompanyEscrow.v1;
  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { bottleManufacturer, bottleManufacturerBottle, bottleManufacturerEscrow } =
          await deployBottleManufacturerAndDeps(
            bottleCompanyContractName,
            bottleCompanyBottleContractName,
            bottleCompanyEscrowContractName,
            baseUri,
            this.signers.deployer,
            uupsOpts
          );
        this.contracts.bottleCompany = bottleManufacturer.proxy as BottleCompany;
        this.contracts.bottleCompanyBottle = bottleManufacturerBottle.proxy as BottleCompanyBottle;
        this.contracts.bottleCompanyEscrow = bottleManufacturerEscrow.proxy as BottleCompanyEscrow;
      });
      shouldBehaveLikeInitialize(bottleCompanyId);
    });
  });
}
