import { dictOliveOilBottle, dictPallet } from 'hardhat-env/test/shared/constants';
import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from 'hardhat-env/shared/constants';
import { utils } from 'ethers';
import {
  distributorFixture,
  initializedDistributorFixture,
  activeDistributorFixture,
  depositedDistributorFixture,
  depositedPaymentDistributorFixture,
  distributorWithStockFixture,
  packedDistributorFixture,
  paymentDistributorFixture
} from 'hardhat-env/test/shared/fixtures';
import shouldBehaveLikeInitialize from 'hardhat-env/test/roles/DistributorUpgradeable/effects/initialize';
import shouldBehaveLikeName from 'hardhat-env/test/shared/base/BaseMember/view/name';
import shouldBehaveLikeDepositToken from 'hardhat-env/test/shared/base/IndustrialUnitsSeller/effects/depositToken';
import shouldBehaveLikeDepositBatch from 'hardhat-env/test/shared/base/IndustrialUnitsSeller/effects/depositBatch';
import shouldBehaveLikeRevertBeforePayment from 'hardhat-env/test/shared/base/IndustrialUnitsSeller/effects/revertBeforePayment';
import shouldBehaveLikeRevertAfterPayment from 'hardhat-env/test/shared/base/IndustrialUnitsSeller/effects/revertAfterPayment';
import shouldBehaveLikeCloseEscrow from 'hardhat-env/test/shared/base/IndustrialUnitsSeller/effects/closeEscrow';
import shouldBehaveLikeMakePayment from 'hardhat-env/test/shared/base/IndustrialOrCommercialUnitsPaymentGateway/effects/makePayment';
import shouldBehaveLikeCancelPayment from 'hardhat-env/test/shared/base/IndustrialOrCommercialUnitsPaymentGateway/effects/cancelPayment';
import shouldBehaveLikePack from 'hardhat-env/test/roles/DistributorUpgradeable/effects/pack';
import shouldBehaveLikePackBatch from 'hardhat-env/test/roles/DistributorUpgradeable/effects/packBatch';
import shouldBehaveLikeUnpack from 'hardhat-env/test/roles/DistributorUpgradeable/effects/unpack';
import shouldBehaveLikeUnpackBatch from 'hardhat-env/test/roles/DistributorUpgradeable/effects/unpackBatch';
import shouldBehaveLikeReceive from 'hardhat-env/test/shared/base/BaseSeller/effects/receive';
import shouldUpgrade from 'hardhat-env/test/roles/DistributorUpgradeable/effects/upgrade';
import shouldBehaveLikeBurn from 'hardhat-env/test/shared/base/BaseSeller/effects/burn';
import shouldBehaveLikeBurnBatch from 'hardhat-env/test/shared/base/BaseSeller/effects/burnBatch';

export function shouldBehaveLikeDistributorUpgradeable(): void {
  const contract = 'distributor';
  const tokenContract = 'oliveOilBottleToken';
  const escrowContract = 'industrialUnitsEscrow';
  const distributorName = dictChainActorsNames.distributor.id1;
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
  const idPallet1 = utils.formatBytes32String(dictPallet.distributor.id1);
  const idPallet2 = utils.formatBytes32String(dictPallet.distributor.id2);
  const idPallet3 = utils.formatBytes32String(dictPallet.distributor.id3);
  const oliveOilBottleUnitsToPack = dictOliveOilBottle.unitsToPack;
  const oliveOilBottleUnitsToBurn = dictOliveOilBottle.unitsToBurn;
  const palletPrice = dictPallet.price.toString();
  const id0 = 0;
  const id1 = 1;

  describe('Effects functions', function () {
    describe('#upgrade', function () {
      shouldUpgrade(
        dictContracts.distributorWithInit.v1,
        dictContracts.industrialUnitTokenWithInit.v1,
        dictContracts.industrialUnitsEscrowWithInit.v1,
        baseUri,
        uupsOpts
      );
    });

    describe('#initialize', function () {
      before(async function () {
        const { distributor, palletToken, escrow } = await this.loadFixture(distributorFixture);
        this.contracts.distributor = distributor;
        this.contracts.palletToken = palletToken;
        this.contracts.industrialUnitsEscrow = escrow;
      });
      shouldBehaveLikeInitialize(distributorName);
    });

    describe('#burn', function () {
      beforeEach(async function () {
        const { distributor, oliveOilBottleToken } = await this.loadFixture(distributorWithStockFixture);
        this.contracts.distributor = distributor;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
      });

      shouldBehaveLikeBurn(
        contract,
        tokenContract,
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        oliveOilBottleUnitsToBurn
      );
    });

    describe('#burnBatch', function () {
      beforeEach(async function () {
        const { distributor, oliveOilBottleToken } = await this.loadFixture(distributorWithStockFixture);
        this.contracts.distributor = distributor;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
      });

      shouldBehaveLikeBurnBatch(
        contract,
        tokenContract,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        [oliveOilBottleUnitsToBurn, oliveOilBottleUnitsToBurn]
      );
    });

    describe('#depositToken', function () {
      beforeEach(async function () {
        const { distributor, palletToken, escrow } = await this.loadFixture(packedDistributorFixture);
        this.contracts.distributor = distributor;
        this.contracts.palletToken = palletToken;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeDepositToken(contract, id0, idPallet1, id1, palletPrice);
    });

    describe('#depositBatch', function () {
      beforeEach(async function () {
        const { distributor, palletToken, escrow } = await this.loadFixture(packedDistributorFixture);
        this.contracts.distributor = distributor;
        this.contracts.palletToken = palletToken;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeDepositBatch(contract, id0, [idPallet1, idPallet2], [id1, id1], palletPrice);
    });

    describe('#revertBeforePayment', function () {
      beforeEach(async function () {
        const { distributor, palletToken, escrow } = await this.loadFixture(activeDistributorFixture);
        this.contracts.distributor = distributor;
        this.contracts.palletToken = palletToken;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeRevertBeforePayment(contract, [id0, id1], idPallet1, [idPallet2, idPallet3], id1, [id1, id1]);
    });
    describe('#revertAfterPayment', function () {
      beforeEach(async function () {
        const { distributor, palletToken, escrow } = await this.loadFixture(depositedDistributorFixture);
        this.contracts.distributor = distributor;
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
        const { distributor, palletToken, escrow } = await this.loadFixture(depositedDistributorFixture);
        this.contracts.distributor = distributor;
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
        const { distributor, escrow } = await this.loadFixture(paymentDistributorFixture);
        this.contracts.distributor = distributor;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeMakePayment(contract, escrowContract, id0, palletPrice);
    });

    describe('#cancelPayment', function () {
      beforeEach(async function () {
        const { distributor, escrow } = await this.loadFixture(depositedPaymentDistributorFixture);
        this.contracts.distributor = distributor;
        this.contracts.industrialUnitsEscrow = escrow;
      });

      shouldBehaveLikeCancelPayment(contract, escrowContract, id0, palletPrice);
    });

    describe('#pack', function () {
      before(async function () {
        const { distributor, oliveOilBottleToken, palletToken } = await this.loadFixture(distributorWithStockFixture);
        this.contracts.distributor = distributor;
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
        const { distributor, oliveOilBottleToken, palletToken } = await this.loadFixture(distributorWithStockFixture);
        this.contracts.distributor = distributor;
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
        const { distributor, oliveOilBottleToken, palletToken } = await packedDistributorFixture([
          this.signers.deployer
        ]);
        this.contracts.distributor = distributor;
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
        const { distributor, oliveOilBottleToken, palletToken } = await packedDistributorFixture([
          this.signers.deployer
        ]);
        this.contracts.distributor = distributor;
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
        const { distributor } = await this.loadFixture(initializedDistributorFixture);
        this.contracts.distributor = distributor;
      });

      shouldBehaveLikeReceive(contract, palletPrice);
    });
  });

  describe('View functions', function () {
    describe('#name', function () {
      before(async function () {
        const { distributor } = await this.loadFixture(initializedDistributorFixture);
        this.contracts.distributor = distributor;
      });

      shouldBehaveLikeName(contract, distributorName);
    });
  });
}
