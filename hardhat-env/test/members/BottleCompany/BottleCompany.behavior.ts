import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from '@shared/constants';
import shouldBehaveLikeInitialize from '@test/members/BottleCompany/effects/initialize';
import { deployBottleManufacturerAndDeps } from '@shared/helpers';
import { BottleCompany, BottleCompanyBottle, BottleCompanyEscrow } from '@types';

export function shouldBehaveLikeBottleCompany(): void {
  const { bottleManufacturer } = dictChainActorsNames;
  const { bottleCompany, bottleCompanyBottle, bottleCompanyEscrow } = dictContracts;

  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { bottleManufacturer, bottleManufacturerBottle, bottleManufacturerEscrow } =
          await deployBottleManufacturerAndDeps(
            bottleCompany.v1,
            bottleCompanyBottle.v1,
            bottleCompanyEscrow.v1,
            baseUri,
            this.signers.deployer,
            uupsOpts
          );
        this.contracts.bottleCompany = bottleManufacturer.proxy as BottleCompany;
        this.contracts.bottleCompanyBottle = bottleManufacturerBottle.proxy as BottleCompanyBottle;
        this.contracts.bottleCompanyEscrow = bottleManufacturerEscrow.proxy as BottleCompanyEscrow;
      });
      shouldBehaveLikeInitialize(bottleManufacturer.id1);
    });
  });
}
