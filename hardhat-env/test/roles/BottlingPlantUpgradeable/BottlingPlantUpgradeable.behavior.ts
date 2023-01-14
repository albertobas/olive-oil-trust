import { dictBottle, dictOliveOil, dictOliveOilBottle, dictPallet } from 'hardhat-env/test/shared/constants';
import { baseUri, dictChainActorsNames, dictContracts, uupsLibOpts } from 'hardhat-env/shared/constants';
import { BigNumber, utils } from 'ethers';
import {
  bottlingPlantFixture,
  activeBottlingPlantFixture,
  initializedBottlingPlantFixture,
  depositedBottlingPlantFixture,
  depositedPaymentBottlingPlantFixture,
  instructedCertificateBottlingPlantFixture,
  mintedBottlingPlantFixture,
  packedBottlingPlantFixture,
  paymentBottlingPlantFixture
} from 'hardhat-env/test/shared/fixtures';
import shouldBehaveLikeInitialize from 'hardhat-env/test/roles/BottlingPlantUpgradeable/effects/initialize';
import shouldBehaveLikeSetTokenTypeInstructions from 'hardhat-env/test/shared/base/DependentCreator/effects/setTokenTypeInstructions';
import shouldBehaveLikeSetTokenTypesInstructions from 'hardhat-env/test/shared/base/DependentCreator/effects/setTokenTypesInstructions';
import shouldBehaveLikeMint from 'hardhat-env/test/shared/base/DependentCreator/effects/mint';
import shouldBehaveLikeMintBatch from 'hardhat-env/test/shared/base/DependentCreator/effects/mintBatch';
import shouldBehaveLikeName from 'hardhat-env/test/shared/base/BaseMember/view/name';
import shouldBehaveLikeDepositToken from 'hardhat-env/test/shared/base/IndustrialUnitsSeller/effects/depositToken';
import shouldBehaveLikeDepositBatch from 'hardhat-env/test/shared/base/IndustrialUnitsSeller/effects/depositBatch';
import shouldBehaveLikeRevertBeforePayment from 'hardhat-env/test/shared/base/IndustrialUnitsSeller/effects/revertBeforePayment';
import shouldBehaveLikeRevertAfterPayment from 'hardhat-env/test/shared/base/IndustrialUnitsSeller/effects/revertAfterPayment';
import shouldBehaveLikeCloseEscrow from 'hardhat-env/test/shared/base/IndustrialUnitsSeller/effects/closeEscrow';
import shouldBehaveLikeMakePayment from 'hardhat-env/test/shared/base/IndustrialOrCommercialUnitsPaymentGateway/effects/makePayment';
import shouldBehaveLikeCancelPayment from 'hardhat-env/test/shared/base/IndustrialOrCommercialUnitsPaymentGateway/effects/cancelPayment';
import shouldBehaveLikePack from 'hardhat-env/test/roles/BottlingPlantUpgradeable/effects/pack';
import shouldBehaveLikePackBatch from 'hardhat-env/test/roles/BottlingPlantUpgradeable/effects/packBatch';
import shouldBehaveLikeUnpack from 'hardhat-env/test/roles/BottlingPlantUpgradeable/effects/unpack';
import shouldBehaveLikeUnpackBatch from 'hardhat-env/test/roles/BottlingPlantUpgradeable/effects/unpackBatch';
import shouldBehaveLikeReceive from 'hardhat-env/test/shared/base/BaseSeller/effects/receive';
import shouldUpgrade from 'hardhat-env/test/roles/BottlingPlantUpgradeable/effects/upgrade';
import shouldBehaveLikeBurn from 'hardhat-env/test/shared/base/BaseSeller/effects/burn';
import shouldBehaveLikeBurnBatch from 'hardhat-env/test/shared/base/BaseSeller/effects/burnBatch';

export function shouldBehaveLikeBottlingPlantUpgradeable(): void {
  const contract = 'bottlingPlant';
  const contractCertificate = 'bottlingPlantCertificate';
  const oliveOilTokenContract = 'oliveOilToken';
  const bottleTokenContract = 'bottleToken';
  const oliveOilBottleTokenContract = 'oliveOilBottleToken';
  const oliveOilBottleTokenContractCertificate = 'oliveOilBottleTokenCertificate';
  const escrowContract = 'commercialUnitsEscrow';
  const bottlingPlantName = dictChainActorsNames.bottlingPlant.id1;
  const idOliveOilExtraVirginIntenseGlassBottle = utils.formatBytes32String(
    dictOliveOilBottle.extraVirginIntenseGlass.id
  );
  const idOliveOilExtraVirginSmoothPlasticBottle = utils.formatBytes32String(
    dictOliveOilBottle.extraVirginSmoothPlastic.id
  );
  const idOliveOilExtraVirginIntenseGlassBottleToken1 = utils.formatBytes32String(
    dictOliveOilBottle.extraVirginIntenseGlass.tokenId1
  );
  const idOliveOilExtraVirginSmoothPlasticBottleToken1 = utils.formatBytes32String(
    dictOliveOilBottle.extraVirginSmoothPlastic.tokenId1
  );
  const idOliveOilExtraVirginIntense = utils.formatBytes32String(dictOliveOil.extraVirginIntense.id);
  const idOliveOilExtraVirginMedium = utils.formatBytes32String(dictOliveOil.extraVirginMedium.id);
  const idOliveOilExtraVirginSmooth = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.id);
  const idOliveOilExtraVirginIntenseToken1 = utils.formatBytes32String(dictOliveOil.extraVirginIntense.tokenId1);
  const idOliveOilExtraVirginSmoothToken1 = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.tokenId1);
  const idOliveOilExtraVirginMediumToken1 = utils.formatBytes32String(dictOliveOil.extraVirginMedium.tokenId1);
  const idGlass = utils.formatBytes32String(dictBottle.glass.id);
  const idPlastic = utils.formatBytes32String(dictBottle.plastic.id);
  const idGlassToken1 = utils.formatBytes32String(dictBottle.glass.tokenId1);
  const idPlasticToken1 = utils.formatBytes32String(dictBottle.plastic.tokenId1);
  const idPallet1 = utils.formatBytes32String(dictPallet.bottlingPlant.id1);
  const idPallet2 = utils.formatBytes32String(dictPallet.bottlingPlant.id2);
  const idPallet3 = utils.formatBytes32String(dictPallet.bottlingPlant.id3);
  const extraVirginIntenseInstructedIds = [idOliveOilExtraVirginIntense, idGlass];
  const extraVirginSmoothInstructedIds = [idOliveOilExtraVirginSmooth, idPlastic];
  const extraVirginSmoothPlasticBottleBottlesUnits = BigNumber.from(
    dictOliveOilBottle.extraVirginSmoothPlastic.bottleUnits
  );
  const extraVirginSmoothPlasticBottleOliveOilUnits = BigNumber.from(
    dictOliveOilBottle.extraVirginSmoothPlastic.oliveOilUnits
  );
  const extraVirginIntenseGlassBottleOliveOilUnits = BigNumber.from(
    dictOliveOilBottle.extraVirginIntenseGlass.oliveOilUnits
  );
  const extraVirginIntenseGlassBottleBottlesUnits = BigNumber.from(
    dictOliveOilBottle.extraVirginIntenseGlass.bottleUnits
  );
  const extraVirginIntenseGlassBottleInstructedAmounts = [
    extraVirginIntenseGlassBottleOliveOilUnits,
    extraVirginIntenseGlassBottleBottlesUnits
  ];
  const extraVirginSmoothPlasticBottleInstructedAmounts = [
    BigNumber.from(dictOliveOilBottle.extraVirginSmoothPlastic.oliveOilUnits),
    BigNumber.from(dictOliveOilBottle.extraVirginSmoothPlastic.bottleUnits)
  ];
  const oliveOilBottleUnitsToMint = dictOliveOilBottle.unitsToMint;
  const oliveOilBottleUnitsToPack = dictOliveOilBottle.unitsToPack;
  const oliveOilBottleUnitsToBurn = dictOliveOilBottle.unitsToBurn;
  const oobAmount = 1000 ** 2;
  const oliveOilPrice = dictOliveOil.price.toString();
  const palletPrice = dictPallet.price.toString();
  const id0 = 0;
  const id1 = 1;

  describe('Effects functions', function () {
    describe('#upgrade', function () {
      shouldUpgrade(
        dictContracts.bottlingPlantWithInit.v1,
        dictContracts.dependentTokenWithInit.v1,
        dictContracts.industrialUnitTokenWithInit.v1,
        dictContracts.industrialUnitsEscrowWithInit.v1,
        baseUri,
        uupsLibOpts,
        [dictContracts.validation.v1]
      );
    });

    describe('#initialize', function () {
      before(async function () {
        const { bottlingPlant, oliveOilBottleToken, palletToken, escrow } = await this.loadFixture(
          bottlingPlantFixture
        );
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.contracts.palletToken = palletToken;
        this.contracts.industrialUnitsEscrow = escrow;
      });
      shouldBehaveLikeInitialize(bottlingPlantName);
    });

    describe('#setTokenTypeInstructions', function () {
      beforeEach(async function () {
        const { bottlingPlant, oliveOilToken, oliveOilBottleToken, bottleToken } = await this.loadFixture(
          initializedBottlingPlantFixture
        );
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.token.addresses = [oliveOilToken.address, bottleToken.address];
      });
      shouldBehaveLikeSetTokenTypeInstructions(
        contract,
        oliveOilBottleTokenContract,
        idOliveOilExtraVirginIntenseGlassBottle,
        [idOliveOilExtraVirginIntense, idGlass],
        [extraVirginIntenseGlassBottleOliveOilUnits, extraVirginIntenseGlassBottleBottlesUnits]
      );
    });

    describe('#setTokenTypesInstructions', function () {
      beforeEach(async function () {
        const { bottlingPlant, oliveOilToken, oliveOilBottleToken, bottleToken } = await this.loadFixture(
          initializedBottlingPlantFixture
        );
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.token.addresses = [oliveOilToken.address, bottleToken.address];
      });
      shouldBehaveLikeSetTokenTypesInstructions(
        contract,
        oliveOilBottleTokenContract,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [extraVirginIntenseInstructedIds, extraVirginSmoothInstructedIds],
        [extraVirginIntenseGlassBottleInstructedAmounts, extraVirginSmoothPlasticBottleInstructedAmounts]
      );
    });

    describe('#mint', function () {
      beforeEach(async function () {
        const { bottlingPlant, bottlingPlantWithCertificate } = await this.loadFixture(
          instructedCertificateBottlingPlantFixture
        );
        this.contracts.bottlingPlant = bottlingPlant.bottlingPlant;
        this.contracts.bottlingPlantCertificate = bottlingPlantWithCertificate.bottlingPlant;
        this.contracts.oliveOilBottleToken = bottlingPlant.oliveOilBottleToken;
        this.contracts.oliveOilBottleTokenCertificate = bottlingPlantWithCertificate.oliveOilBottleToken;
        this.contracts.bottleToken = bottlingPlant.bottleToken;
        this.contracts.oliveOilToken = bottlingPlant.oliveOilToken;
        this.token.addresses = [bottlingPlant.oliveOilToken.address, bottlingPlant.bottleToken.address];
        this.token.addressesCertificate = [
          bottlingPlantWithCertificate.oliveOilToken.address,
          bottlingPlantWithCertificate.bottleToken.address
        ];
      });
      shouldBehaveLikeMint(
        contract,
        contractCertificate,
        oliveOilBottleTokenContract,
        [oliveOilTokenContract, bottleTokenContract],
        oliveOilBottleTokenContractCertificate,
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        oliveOilBottleUnitsToMint,
        [[idOliveOilExtraVirginIntense], [idGlass]],
        [[idOliveOilExtraVirginIntenseToken1], [idGlassToken1]],
        [[idOliveOilExtraVirginMedium], [idGlass]],
        [[idOliveOilExtraVirginMediumToken1], [idGlassToken1]],
        [
          [extraVirginIntenseGlassBottleOliveOilUnits.mul(oliveOilBottleUnitsToMint)],
          [extraVirginIntenseGlassBottleBottlesUnits.mul(oliveOilBottleUnitsToMint)]
        ],
        oobAmount
      );
    });

    describe('#mintBatch', function () {
      beforeEach(async function () {
        const { bottlingPlant, bottlingPlantWithCertificate } = await this.loadFixture(
          instructedCertificateBottlingPlantFixture
        );
        this.contracts.bottlingPlant = bottlingPlant.bottlingPlant;
        this.contracts.bottlingPlantCertificate = bottlingPlantWithCertificate.bottlingPlant;
        this.contracts.oliveOilBottleToken = bottlingPlant.oliveOilBottleToken;
        this.contracts.oliveOilBottleTokenCertificate = bottlingPlantWithCertificate.oliveOilBottleToken;
        this.contracts.bottleToken = bottlingPlant.bottleToken;
        this.contracts.oliveOilToken = bottlingPlant.oliveOilToken;
        this.token.addresses = [bottlingPlant.oliveOilToken.address, bottlingPlant.bottleToken.address];
        this.token.addressesCertificate = [
          bottlingPlantWithCertificate.oliveOilToken.address,
          bottlingPlantWithCertificate.bottleToken.address
        ];
      });
      shouldBehaveLikeMintBatch(
        contract,
        contractCertificate,
        oliveOilBottleTokenContract,
        [oliveOilTokenContract, bottleTokenContract],
        oliveOilBottleTokenContractCertificate,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        [oliveOilBottleUnitsToMint, oliveOilBottleUnitsToMint],
        [
          [[idOliveOilExtraVirginIntense], [idGlass]],
          [[idOliveOilExtraVirginSmooth], [idPlastic]]
        ],
        [
          [[idOliveOilExtraVirginIntenseToken1], [idGlassToken1]],
          [[idOliveOilExtraVirginSmoothToken1], [idPlasticToken1]]
        ],
        [
          [[idOliveOilExtraVirginMedium], [idGlass]],
          [[idOliveOilExtraVirginMedium], [idPlastic]]
        ],
        [
          [[idOliveOilExtraVirginMediumToken1], [idGlassToken1]],
          [[idOliveOilExtraVirginMediumToken1], [idPlasticToken1]]
        ],
        [
          [
            [extraVirginIntenseGlassBottleOliveOilUnits.mul(oliveOilBottleUnitsToMint)],
            [extraVirginIntenseGlassBottleBottlesUnits.mul(oliveOilBottleUnitsToMint)]
          ],
          [
            [extraVirginSmoothPlasticBottleOliveOilUnits.mul(oliveOilBottleUnitsToMint)],
            [extraVirginSmoothPlasticBottleBottlesUnits.mul(oliveOilBottleUnitsToMint)]
          ]
        ],
        oobAmount
      );
    });

    describe('#burn', function () {
      beforeEach(async function () {
        const { bottlingPlant, oliveOilBottleToken } = await this.loadFixture(mintedBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
      });

      shouldBehaveLikeBurn(
        contract,
        oliveOilBottleTokenContract,
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        oliveOilBottleUnitsToBurn
      );
    });

    describe('#burnBatch', function () {
      beforeEach(async function () {
        const { bottlingPlant, oliveOilBottleToken } = await this.loadFixture(mintedBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
      });

      shouldBehaveLikeBurnBatch(
        contract,
        oliveOilBottleTokenContract,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        [oliveOilBottleUnitsToBurn, oliveOilBottleUnitsToBurn]
      );
    });

    describe('#depositToken', function () {
      beforeEach(async function () {
        const { bottlingPlant, palletToken, escrow } = await this.loadFixture(packedBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.palletToken = palletToken;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeDepositToken(contract, id0, idPallet1, id1, palletPrice);
    });

    describe('#depositBatch', function () {
      beforeEach(async function () {
        const { bottlingPlant, palletToken, escrow } = await this.loadFixture(packedBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.palletToken = palletToken;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeDepositBatch(contract, id0, [idPallet1, idPallet2], [id1, id1], palletPrice);
    });

    describe('#revertBeforePayment', function () {
      beforeEach(async function () {
        const { bottlingPlant, palletToken, escrow } = await this.loadFixture(activeBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.palletToken = palletToken;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeRevertBeforePayment(contract, [id0, id1], idPallet1, [idPallet2, idPallet3], id1, [id1, id1]);
    });

    describe('#revertAfterPayment', function () {
      beforeEach(async function () {
        const { bottlingPlant, palletToken, escrow } = await this.loadFixture(depositedBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.palletToken = palletToken;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeRevertAfterPayment(
        contract,
        [id0, id1],
        idPallet1,
        [idPallet2, idPallet3],
        id1,
        [id1, id1],
        palletPrice
      );
    });

    describe('#closeEscrow', function () {
      beforeEach(async function () {
        const { bottlingPlant, palletToken, escrow } = await this.loadFixture(depositedBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.palletToken = palletToken;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeCloseEscrow(
        contract,
        [id0, id1],
        idPallet1,
        [idPallet2, idPallet3],
        id1,
        [id1, id1],
        palletPrice
      );
    });

    describe('#makePayment', function () {
      beforeEach(async function () {
        const { bottlingPlant, escrow } = await this.loadFixture(paymentBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeMakePayment(contract, escrowContract, id0, oliveOilPrice);
    });

    describe('#cancelPayment', function () {
      beforeEach(async function () {
        const { bottlingPlant, escrow } = await this.loadFixture(depositedPaymentBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeCancelPayment(contract, escrowContract, id0, oliveOilPrice);
    });

    describe('#pack', function () {
      before(async function () {
        const { bottlingPlant, oliveOilBottleToken, palletToken } = await this.loadFixture(mintedBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.contracts.palletToken = palletToken;
      });

      shouldBehaveLikePack(
        idPallet1,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack]
      );
    });

    describe('#packBatch', function () {
      before(async function () {
        const { bottlingPlant, oliveOilBottleToken, palletToken } = await this.loadFixture(mintedBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.contracts.palletToken = palletToken;
      });

      shouldBehaveLikePackBatch(
        [idPallet1, idPallet2],
        [
          [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
          [idOliveOilExtraVirginIntenseGlassBottle]
        ],
        [
          [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
          [idOliveOilExtraVirginIntenseGlassBottleToken1]
        ],
        [[oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack], [oliveOilBottleUnitsToPack]]
      );
    });

    describe('#unpack', function () {
      before(async function () {
        const { bottlingPlant, oliveOilBottleToken, palletToken } = await packedBottlingPlantFixture([
          this.signers.deployer
        ]);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.contracts.palletToken = palletToken;
      });

      shouldBehaveLikeUnpack(
        idPallet1,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack]
      );
    });

    describe('#unpackBatch', function () {
      before(async function () {
        const { bottlingPlant, oliveOilBottleToken, palletToken } = await packedBottlingPlantFixture([
          this.signers.deployer
        ]);
        this.contracts.bottlingPlant = bottlingPlant;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.contracts.palletToken = palletToken;
      });

      shouldBehaveLikeUnpackBatch(
        [idPallet1, idPallet2],
        [
          [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
          [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle]
        ],
        [
          [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
          [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1]
        ],
        [
          [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack],
          [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack]
        ]
      );
    });

    describe('#receive', function () {
      beforeEach(async function () {
        const { bottlingPlant } = await this.loadFixture(initializedBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
      });

      shouldBehaveLikeReceive(contract, palletPrice);
    });
  });

  describe('View functions', function () {
    describe('#name', function () {
      before(async function () {
        const { bottlingPlant } = await this.loadFixture(initializedBottlingPlantFixture);
        this.contracts.bottlingPlant = bottlingPlant;
      });
      shouldBehaveLikeName(contract, bottlingPlantName);
    });
  });
}
