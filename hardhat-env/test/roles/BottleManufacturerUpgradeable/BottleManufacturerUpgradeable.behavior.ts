import { utils } from 'ethers';
import {
  bottleManufacturerFixture,
  initializedBottleManufacturerFixture,
  activeBottleManufacturerFixture,
  depositedBottleManufacturerFixture,
  mintedBottleManufacturerFixture
} from 'hardhat-env/test/shared/fixtures';
import { dictBottle } from 'hardhat-env/test/shared/constants';
import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from 'hardhat-env/shared/constants';
import shouldBehaveLikeMint from 'hardhat-env/test/shared/base/IndependentCreator/effects/mint';
import shouldBehaveLikeMintBatch from 'hardhat-env/test/shared/base/IndependentCreator/effects/mintBatch';
import shouldBehaveLikeCloseEscrow from 'hardhat-env/test/shared/base/BaseSeller/effects/closeEscrow';
import shouldBehaveLikeDepositBatch from 'hardhat-env/test/shared/base/ManufacturedUnitsSeller/effects/depositBatch';
import shouldBehaveLikeDepositToken from 'hardhat-env/test/shared/base/ManufacturedUnitsSeller/effects/depositToken';
import shouldBehaveLikeRevertAfterPayment from 'hardhat-env/test/shared/base/BaseSeller/effects/revertAfterPayment';
import shouldBehaveLikeRevertBeforePayment from 'hardhat-env/test/shared/base/BaseSeller/effects/revertBeforePayment';
import shouldBehaveLikeInitialize from 'hardhat-env/test/roles/BottleManufacturerUpgradeable/effects/initialize';
import shouldUpgrade from 'hardhat-env/test/roles/BottleManufacturerUpgradeable/effects/upgrade';
import shouldBehaveLikeName from 'hardhat-env/test/shared/base/BaseMember/view/name';
import shouldBehaveLikeReceive from 'hardhat-env/test/shared/base/BaseSeller/effects/receive';
import shouldBehaveLikeBurn from 'hardhat-env/test/shared/base/BaseSeller/effects/burn';
import shouldBehaveLikeBurnBatch from 'hardhat-env/test/shared/base/BaseSeller/effects/burnBatch';

export function shouldBehaveLikeBottleManufacturerUpgradeable(): void {
  const contract = 'bottleManufacturer';
  const tokenContract = 'bottleToken';
  const bottleManufacturerName = dictChainActorsNames.bottleManufacturer.id1;
  const idGlass = utils.formatBytes32String(dictBottle.glass.id);
  const idPlastic = utils.formatBytes32String(dictBottle.plastic.id);
  const idGlassToken1 = utils.formatBytes32String(dictBottle.glass.tokenId1);
  const idPlasticToken1 = utils.formatBytes32String(dictBottle.plastic.tokenId1);
  const bottleUnitsToMint = dictBottle.unitsToMint;
  const bottleUnitsToEscrow = dictBottle.unitsToEscrow;
  const bottleUnitsToBurn = dictBottle.unitsToBurn;
  const bottlePrice = dictBottle.price.toString();
  const id0 = 0;
  const id1 = 1;

  describe('Effects functions', function () {
    describe('#upgrade', function () {
      shouldUpgrade(
        dictContracts.bottleManufacturerWithInit.v1,
        dictContracts.independentTokenWithInit.v1,
        dictContracts.commercialUnitsEscrowWithInit.v1,
        baseUri,
        uupsOpts
      );
    });

    describe('#initialize', function () {
      before(async function () {
        const { bottleManufacturer, bottleToken, escrow } = await this.loadFixture(bottleManufacturerFixture);
        this.contracts.bottleManufacturer = bottleManufacturer;
        this.contracts.bottleToken = bottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeInitialize(bottleManufacturerName);
    });

    describe('#mint', function () {
      before(async function () {
        const { bottleManufacturer, bottleToken, escrow } = await this.loadFixture(
          initializedBottleManufacturerFixture
        );
        this.contracts.bottleManufacturer = bottleManufacturer;
        this.contracts.bottleToken = bottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeMint(contract, tokenContract, idGlass, idGlassToken1, bottleUnitsToMint);
    });

    describe('#mintBatch', function () {
      before(async function () {
        const { bottleManufacturer, bottleToken, escrow } = await this.loadFixture(
          initializedBottleManufacturerFixture
        );
        this.contracts.bottleManufacturer = bottleManufacturer;
        this.contracts.bottleToken = bottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeMintBatch(
        contract,
        tokenContract,
        [idGlass, idPlastic],
        [idGlassToken1, idPlasticToken1],
        [bottleUnitsToMint, bottleUnitsToMint]
      );
    });

    describe('#burn', function () {
      beforeEach(async function () {
        const { bottleManufacturer, bottleToken } = await this.loadFixture(mintedBottleManufacturerFixture);
        this.contracts.bottleManufacturer = bottleManufacturer;
        this.contracts.bottleToken = bottleToken;
      });

      shouldBehaveLikeBurn(contract, tokenContract, idGlass, idGlassToken1, bottleUnitsToBurn);
    });

    describe('#burnBatch', function () {
      beforeEach(async function () {
        const { bottleManufacturer, bottleToken } = await this.loadFixture(mintedBottleManufacturerFixture);
        this.contracts.bottleManufacturer = bottleManufacturer;
        this.contracts.bottleToken = bottleToken;
      });

      shouldBehaveLikeBurnBatch(
        contract,
        tokenContract,
        [idGlass, idPlastic],
        [idGlassToken1, idPlasticToken1],
        [bottleUnitsToBurn, bottleUnitsToBurn]
      );
    });

    describe('#depositToken', function () {
      beforeEach(async function () {
        const { bottleManufacturer, bottleToken, escrow } = await this.loadFixture(mintedBottleManufacturerFixture);
        this.contracts.bottleManufacturer = bottleManufacturer;
        this.contracts.bottleToken = bottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeDepositToken(
        contract,
        tokenContract,
        id0,
        idGlass,
        idGlassToken1,
        bottleUnitsToEscrow,
        bottlePrice
      );
    });

    describe('#depositBatch', function () {
      beforeEach(async function () {
        const { bottleManufacturer, bottleToken, escrow } = await this.loadFixture(mintedBottleManufacturerFixture);
        this.contracts.bottleManufacturer = bottleManufacturer;
        this.contracts.bottleToken = bottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeDepositBatch(
        contract,
        tokenContract,
        id0,
        [idGlass, idPlastic],
        [idGlassToken1, idPlasticToken1],
        [bottleUnitsToEscrow, bottleUnitsToEscrow],
        bottlePrice
      );
    });

    describe('#revertBeforePayment', function () {
      beforeEach(async function () {
        const { bottleManufacturer, bottleToken, escrow } = await this.loadFixture(activeBottleManufacturerFixture);
        this.contracts.bottleManufacturer = bottleManufacturer;
        this.contracts.bottleToken = bottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeRevertBeforePayment(
        contract,
        tokenContract,
        [id0, id1],
        idGlass,
        idGlassToken1,
        [idGlass, idPlastic],
        [idGlassToken1, idPlasticToken1],
        bottleUnitsToEscrow,
        [bottleUnitsToEscrow, bottleUnitsToEscrow]
      );
    });

    describe('#revertAfterPayment', function () {
      beforeEach(async function () {
        const { bottleManufacturer, bottleToken, escrow } = await this.loadFixture(depositedBottleManufacturerFixture);
        this.contracts.bottleManufacturer = bottleManufacturer;
        this.contracts.bottleToken = bottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeRevertAfterPayment(
        contract,
        tokenContract,
        [id0, id1],
        idGlass,
        idGlassToken1,
        [idGlass, idPlastic],
        [idGlassToken1, idPlasticToken1],
        bottleUnitsToEscrow,
        [bottleUnitsToEscrow, bottleUnitsToEscrow],
        bottlePrice
      );
    });

    describe('#closeEscrow', function () {
      beforeEach(async function () {
        const { bottleManufacturer, bottleToken, escrow } = await this.loadFixture(depositedBottleManufacturerFixture);
        this.contracts.bottleManufacturer = bottleManufacturer;
        this.contracts.bottleToken = bottleToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeCloseEscrow(
        contract,
        tokenContract,
        [id0, id1],
        idGlass,
        idGlassToken1,
        [idGlass, idPlastic],
        [idGlassToken1, idPlasticToken1],
        bottleUnitsToEscrow,
        [bottleUnitsToEscrow, bottleUnitsToEscrow],
        bottlePrice
      );
    });

    describe('#receive', function () {
      beforeEach(async function () {
        const { bottleManufacturer } = await this.loadFixture(initializedBottleManufacturerFixture);
        this.contracts.bottleManufacturer = bottleManufacturer;
      });

      shouldBehaveLikeReceive(contract, bottlePrice);
    });
  });

  describe('View functions', function () {
    describe('#name', function () {
      before(async function () {
        const { bottleManufacturer } = await await this.loadFixture(initializedBottleManufacturerFixture);
        this.contracts.bottleManufacturer = bottleManufacturer;
      });

      shouldBehaveLikeName(contract, bottleManufacturerName);
    });
  });
}
