import { utils } from 'ethers';
import {
  activeOliveOilEscrowFixture,
  depositedOliveOilEscrowFixture,
  oliveOilEscrowFixture
} from 'hardhat-env/test/shared/fixtures';
import { dictOliveOil } from 'hardhat-env/test/shared/constants';
import shouldBehaveLikeCancelPayment from 'hardhat-env/test/shared/base/BaseEscrow/effects/cancelPayment';
import shouldBehaveLikeClose from 'hardhat-env/test/shared/base/BaseEscrow/effects/close';
import shouldBehaveLikeInitialize from 'hardhat-env/test/shared/base/BaseEscrow/effects/initialize';
import shouldBehaveLikeRevertAfterPayment from 'hardhat-env/test/shared/base/BaseEscrow/effects/revertAfterPayment';
import shouldBehaveLikeRevertBeforePayment from 'hardhat-env/test/shared/base/BaseEscrow/effects/revertBeforePayment';
import shouldBehaveLikeEscrow from 'hardhat-env/test/shared/base/BaseEscrow/view/escrow';
import shouldBehaveLikeState from 'hardhat-env/test/shared/base/BaseEscrow/view/state';
import shouldBehaveLikeDepositBatch from 'hardhat-env/test/escrows/CommercialUnitsEscrowUpgradeable/effects/depositBatch';
import shouldBehaveLikeMakePayment from 'hardhat-env/test/escrows/CommercialUnitsEscrowUpgradeable/effects/makePayment';
import shouldBehaveLikeDepositToken from 'hardhat-env/test/escrows/CommercialUnitsEscrowUpgradeable/effects/depositToken';
import shouldUpgrade from 'hardhat-env/test/escrows/CommercialUnitsEscrowUpgradeable/effects/upgrade';

export function shouldBehaveLikeCommercialUnitsEscrowUpgradeable(): void {
  const contract = 'commercialUnitsEscrow';
  const tokenContract = 'oliveOilToken';
  const idOliveOilExtraVirginIntense = utils.formatBytes32String(dictOliveOil.extraVirginIntense.id);
  const idOliveOilExtraVirginSmooth = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.id);
  const idOliveOilExtraVirginIntenseToken1 = utils.formatBytes32String(dictOliveOil.extraVirginIntense.tokenId1);
  const idOliveOilExtraVirginSmoothToken1 = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.tokenId1);
  const unitsToEscrow = dictOliveOil.unitsToEscrow;
  const id0 = 0;
  const id1 = 1;
  const tokenPrice = dictOliveOil.price.toString();

  describe('Effects functions', function () {
    describe('#upgrade', function () {
      before(async function () {
        const { escrow } = await this.loadFixture(oliveOilEscrowFixture);
        this.contracts.commercialUnitsEscrow = escrow;
      });
      shouldUpgrade();
    });

    describe('#initialize', function () {
      beforeEach(async function () {
        const { escrow } = await this.loadFixture(oliveOilEscrowFixture);
        this.contracts.commercialUnitsEscrow = escrow;
      });
      shouldBehaveLikeInitialize(contract);
    });

    describe('#depositToken', function () {
      beforeEach(async function () {
        const { escrow, oliveOilToken } = await this.loadFixture(oliveOilEscrowFixture);
        this.contracts.commercialUnitsEscrow = escrow;
        this.contracts.oliveOilToken = oliveOilToken;
      });
      shouldBehaveLikeDepositToken(
        tokenContract,
        id0,
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntenseToken1,
        unitsToEscrow,
        tokenPrice
      );
    });

    describe('#depositBatch', function () {
      beforeEach(async function () {
        const { escrow, oliveOilToken } = await this.loadFixture(oliveOilEscrowFixture);
        this.contracts.commercialUnitsEscrow = escrow;
        this.contracts.oliveOilToken = oliveOilToken;
      });
      shouldBehaveLikeDepositBatch(
        tokenContract,
        id0,
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        [unitsToEscrow, unitsToEscrow],
        tokenPrice
      );
    });

    describe('#revertBeforePayment', function () {
      before(async function () {
        const { escrow, oliveOilToken } = await this.loadFixture(activeOliveOilEscrowFixture);
        this.contracts.commercialUnitsEscrow = escrow;
        this.contracts.oliveOilToken = oliveOilToken;
      });
      shouldBehaveLikeRevertBeforePayment(
        contract,
        tokenContract,
        [id0, id1],
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        [unitsToEscrow, unitsToEscrow]
      );
    });

    describe('#makePayment', function () {
      beforeEach(async function () {
        const { escrow, oliveOilToken } = await this.loadFixture(activeOliveOilEscrowFixture);
        this.contracts.commercialUnitsEscrow = escrow;
        this.contracts.oliveOilToken = oliveOilToken;
      });
      shouldBehaveLikeMakePayment(id0, tokenPrice);
    });

    describe('#cancelPayment', function () {
      beforeEach(async function () {
        const { escrow, oliveOilToken } = await this.loadFixture(depositedOliveOilEscrowFixture);
        this.contracts.commercialUnitsEscrow = escrow;
        this.contracts.oliveOilToken = oliveOilToken;
      });
      shouldBehaveLikeCancelPayment(contract, id0, tokenPrice);
    });

    describe('#revertAfterPayment', function () {
      before(async function () {
        const { escrow, oliveOilToken } = await this.loadFixture(depositedOliveOilEscrowFixture);
        this.contracts.commercialUnitsEscrow = escrow;
        this.contracts.oliveOilToken = oliveOilToken;
      });
      shouldBehaveLikeRevertAfterPayment(
        contract,
        tokenContract,
        [id0, id1],
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        [unitsToEscrow, unitsToEscrow],
        tokenPrice
      );
    });

    describe('#close', function () {
      before(async function () {
        const { escrow, oliveOilToken } = await this.loadFixture(depositedOliveOilEscrowFixture);
        this.contracts.commercialUnitsEscrow = escrow;
        this.contracts.oliveOilToken = oliveOilToken;
      });

      shouldBehaveLikeClose(
        contract,
        tokenContract,
        [id0, id1],
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        [unitsToEscrow, unitsToEscrow],
        tokenPrice
      );
    });
  });

  describe('View functions', function () {
    describe('#escrow', function () {
      before(async function () {
        const { escrow, oliveOilToken } = await depositedOliveOilEscrowFixture([
          this.signers.deployer,
          this.signers.acc2,
          this.signers.acc3
        ]);
        this.contracts.commercialUnitsEscrow = escrow;
        this.contracts.oliveOilToken = oliveOilToken;
      });
      shouldBehaveLikeEscrow(
        contract,
        tokenContract,
        id1,
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        [unitsToEscrow, unitsToEscrow],
        tokenPrice
      );
    });

    describe('#state', function () {
      before(async function () {
        const { escrow, oliveOilToken } = await this.loadFixture(activeOliveOilEscrowFixture);
        this.contracts.commercialUnitsEscrow = escrow;
        this.contracts.oliveOilToken = oliveOilToken;
      });
      shouldBehaveLikeState(contract, id0);
    });
  });
}
