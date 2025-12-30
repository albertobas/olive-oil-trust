import { dictOliveOilBottle, dictPallet } from '@test/shared/constants';
import { dictChainActorsNames, dictContracts, uupsOpts } from '@shared/constants';
import { utils } from 'ethers';
import {
  activeRetailerFixture,
  depositedRetailerFixture,
  depositedPaymentRetailerFixture,
  retailerFixture,
  initializedRetailerFixture,
  retailerWithStockFixture,
  paymentRetailerFixture,
  packedRetailerFixture
} from '@test/shared/fixtures';
import shouldBehaveLikeInitialize from '@test/roles/RetailerUpgradeable/effects/initialize';
import shouldBehaveLikeName from '@test/shared/base/BaseMember/view/name';
import shouldBehaveLikeDepositToken from '@test/roles/RetailerUpgradeable/effects/depositToken';
import shouldBehaveLikeDepositBatch from '@test/roles/RetailerUpgradeable/effects/depositBatch';
import shouldBehaveLikeRevertBeforePayment from '@test/shared/base/BaseSeller/effects/revertBeforePayment';
import shouldBehaveLikeRevertAfterPayment from '@test/shared/base/BaseSeller/effects/revertAfterPayment';
import shouldBehaveLikeCloseEscrow from '@test/shared/base/BaseSeller/effects/closeEscrow';
import shouldBehaveLikeMakePayment from '@test/shared/base/IndustrialOrCommercialUnitsPaymentGateway/effects/makePayment';
import shouldBehaveLikeCancelPayment from '@test/shared/base/IndustrialOrCommercialUnitsPaymentGateway/effects/cancelPayment';
import shouldBehaveLikeUnpack from '@test/roles/RetailerUpgradeable/effects/unpack';
import shouldBehaveLikeUnpackBatch from '@test/roles/RetailerUpgradeable/effects/unpackBatch';
import shouldBehaveLikeReceive from '@test/shared/base/BaseSeller/effects/receive';
import shouldUpgrade from '@test/roles/RetailerUpgradeable/effects/upgrade';
import shouldBehaveLikeBurn from '@test/shared/base/BaseSeller/effects/burn';
import shouldBehaveLikeBurnBatch from '@test/shared/base/BaseSeller/effects/burnBatch';

export function shouldBehaveLikeRetailerUpgradeable(): void {
  const contract = 'retailer';
  const oliveOilBottleTokenContract = 'oliveOilBottleToken';
  const escrowContract = 'industrialUnitsEscrow';
  const retailerName = dictChainActorsNames.retailer.id1;
  const idPallet1 = utils.formatBytes32String(dictPallet.default.id1);
  const idPallet2 = utils.formatBytes32String(dictPallet.default.id2);
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
  const oliveOilBottleUnitsToBurn = dictOliveOilBottle.unitsToBurn;
  const oliveOilBottleUnitsToEscrow = dictOliveOilBottle.unitsToEscrow;
  const oliveOilBottleUnitsToPack = dictOliveOilBottle.unitsToPack;
  const oliveOilBottlePrice = dictOliveOilBottle.price.toString();
  const palletPrice = dictPallet.price.toString();
  const id0 = 0;
  const id1 = 1;

  describe('Effects functions', function () {
    describe('#upgrade', function () {
      shouldUpgrade(dictContracts.retailerWithInit.v1, dictContracts.commercialUnitsEscrowWithInit.v1, uupsOpts);
    });

    describe('#initialize', function () {
      before(async function () {
        const { retailer, escrow } = await this.loadFixture(retailerFixture);
        this.contracts.retailer = retailer;
        this.contracts.commercialUnitsEscrow = escrow;
      });
      shouldBehaveLikeInitialize(retailerName);
    });

    describe('#burn', function () {
      beforeEach(async function () {
        const { retailer, oliveOilBottleToken } = await this.loadFixture(retailerWithStockFixture);
        this.contracts.retailer = retailer;
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
        const { retailer, oliveOilBottleToken } = await this.loadFixture(retailerWithStockFixture);
        this.contracts.retailer = retailer;
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
        const { retailer, oliveOilBottleToken, escrow } = await this.loadFixture(retailerWithStockFixture);
        this.contracts.retailer = retailer;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeDepositToken(
        oliveOilBottleTokenContract,
        id0,
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        oliveOilBottleUnitsToEscrow,
        oliveOilBottlePrice
      );
    });

    describe('#depositBatch', function () {
      beforeEach(async function () {
        const { retailer, oliveOilBottleToken, escrow } = await this.loadFixture(retailerWithStockFixture);
        this.contracts.retailer = retailer;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeDepositBatch(
        oliveOilBottleTokenContract,
        id0,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        [oliveOilBottleUnitsToEscrow, oliveOilBottleUnitsToEscrow],
        oliveOilBottlePrice
      );
    });

    describe('#revertBeforePayment', function () {
      beforeEach(async function () {
        const { retailer, oliveOilBottleToken, escrow } = await this.loadFixture(activeRetailerFixture);
        this.contracts.retailer = retailer;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeRevertBeforePayment(
        contract,
        oliveOilBottleTokenContract,
        [id0, id1],
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        oliveOilBottleUnitsToEscrow,
        [oliveOilBottleUnitsToEscrow, oliveOilBottleUnitsToEscrow]
      );
    });

    describe('#revertAfterPayment', function () {
      beforeEach(async function () {
        const { retailer, oliveOilBottleToken, escrow } = await this.loadFixture(depositedRetailerFixture);
        this.contracts.retailer = retailer;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeRevertAfterPayment(
        contract,
        oliveOilBottleTokenContract,
        [id0, id1],
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        oliveOilBottleUnitsToEscrow,
        [oliveOilBottleUnitsToEscrow, oliveOilBottleUnitsToEscrow],
        oliveOilBottlePrice
      );
    });

    describe('#closeEscrow', function () {
      beforeEach(async function () {
        const { retailer, oliveOilBottleToken, escrow } = await this.loadFixture(depositedRetailerFixture);
        this.contracts.retailer = retailer;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeCloseEscrow(
        contract,
        oliveOilBottleTokenContract,
        [id0, id1],
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        oliveOilBottleUnitsToEscrow,
        [oliveOilBottleUnitsToEscrow, oliveOilBottleUnitsToEscrow],
        oliveOilBottlePrice
      );
    });

    describe('#makePayment', function () {
      beforeEach(async function () {
        const { retailer, escrow } = await this.loadFixture(paymentRetailerFixture);
        this.contracts.retailer = retailer;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeMakePayment(contract, escrowContract, id0, palletPrice);
    });

    describe('#cancelPayment', function () {
      beforeEach(async function () {
        const { retailer, escrow } = await this.loadFixture(depositedPaymentRetailerFixture);
        this.contracts.retailer = retailer;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeCancelPayment(contract, escrowContract, id0, palletPrice);
    });

    describe('#unpack', function () {
      before(async function () {
        const { retailer, oliveOilBottleToken, palletToken } = await this.loadFixture(packedRetailerFixture);
        this.contracts.retailer = retailer;
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
        const { retailer, oliveOilBottleToken, palletToken } = await this.loadFixture(packedRetailerFixture);
        this.contracts.retailer = retailer;
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
        const { retailer } = await this.loadFixture(initializedRetailerFixture);
        this.contracts.retailer = retailer;
      });

      shouldBehaveLikeReceive(contract, palletPrice);
    });
  });

  describe('View functions', function () {
    describe('#name', function () {
      before(async function () {
        const { retailer } = await this.loadFixture(initializedRetailerFixture);
        this.contracts.retailer = retailer;
      });

      shouldBehaveLikeName(contract, retailerName);
    });
  });
}
