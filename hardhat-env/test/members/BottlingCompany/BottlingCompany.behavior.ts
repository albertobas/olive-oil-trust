import { baseUri, dictChainActorsNames, dictContracts, uupsLibOpts } from 'hardhat-env/shared/constants';
import {
  BottlingCompany,
  BottlingCompanyOliveOilBottle,
  BottlingCompanyPallet,
  BottlingCompanyEscrow
} from 'hardhat-env/types';
import shouldBehaveLikeInitialize from 'hardhat-env/test/members/BottlingCompany/effects/initialize';
import { deployBottlingPlantAndDeps } from 'hardhat-env/shared/helpers';

export function shouldBehaveLikeBottlingCompany(): void {
  const bottlingPlantId = dictChainActorsNames.bottlingPlant.id1;
  const bottlingCompanyContractName = dictContracts.bottlingCompany.v1;
  const bottlingCompanyOliveOilBottleContractName = dictContracts.bottlingCompanyOliveOilBottle.v1;
  const bottlingCompanyPalletContractName = dictContracts.bottlingCompanyPallet.v1;
  const bottlingCompanyEscrowContractName = dictContracts.bottlingCompanyEscrow.v1;

  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { bottlingPlant, bottlingPlantOilBottle, bottlingPlantPallet, bottlingPlantEscrow } =
          await deployBottlingPlantAndDeps(
            bottlingCompanyContractName,
            bottlingCompanyOliveOilBottleContractName,
            bottlingCompanyPalletContractName,
            bottlingCompanyEscrowContractName,
            baseUri,
            this.signers.deployer,
            uupsLibOpts,
            [dictContracts.validation.v1]
          );
        this.contracts.bottlingCompany = bottlingPlant.proxy as BottlingCompany;
        this.contracts.bottlingCompanyOliveOilBottle = bottlingPlantOilBottle.proxy as BottlingCompanyOliveOilBottle;
        this.contracts.bottlingCompanyPallet = bottlingPlantPallet.proxy as BottlingCompanyPallet;
        this.contracts.bottlingCompanyEscrow = bottlingPlantEscrow.proxy as BottlingCompanyEscrow;
      });
      shouldBehaveLikeInitialize(bottlingPlantId);
    });
  });
}
