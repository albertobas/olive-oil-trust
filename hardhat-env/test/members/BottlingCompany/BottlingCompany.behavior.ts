import { baseUri, dictChainActorsNames, dictContracts, uupsLibOpts } from '@shared/constants';
import { BottlingCompany, BottlingCompanyOliveOilBottle, BottlingCompanyPallet, BottlingCompanyEscrow } from '@types';
import shouldBehaveLikeInitialize from '@test/members/BottlingCompany/effects/initialize';
import { deployBottlingPlantAndDeps } from '@shared/helpers';

export function shouldBehaveLikeBottlingCompany(): void {
  const { bottlingCompany, bottlingCompanyOliveOilBottle, bottlingCompanyPallet, bottlingCompanyEscrow, validation } =
    dictContracts;
  const { bottlingPlant } = dictChainActorsNames;

  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { bottlingPlant, bottlingPlantOilBottle, bottlingPlantPallet, bottlingPlantEscrow } =
          await deployBottlingPlantAndDeps(
            bottlingCompany.v1,
            bottlingCompanyOliveOilBottle.v1,
            bottlingCompanyPallet.v1,
            bottlingCompanyEscrow.v1,
            validation.v1,
            baseUri,
            this.signers.deployer,
            uupsLibOpts
          );
        this.contracts.bottlingCompany = bottlingPlant.proxy as BottlingCompany;
        this.contracts.bottlingCompanyOliveOilBottle = bottlingPlantOilBottle.proxy as BottlingCompanyOliveOilBottle;
        this.contracts.bottlingCompanyPallet = bottlingPlantPallet.proxy as BottlingCompanyPallet;
        this.contracts.bottlingCompanyEscrow = bottlingPlantEscrow.proxy as BottlingCompanyEscrow;
      });
      shouldBehaveLikeInitialize(bottlingPlant.id1);
    });
  });
}
