import { utils } from 'ethers';
import { activePalletEscrowFixture, depositedPalletEscrowFixture, palletEscrowFixture } from '@test/shared/fixtures';
import { dictPallet } from '@test/shared/constants';
import shouldBehaveLikeCancelPayment from '@test/escrows/IndustrialUnitsEscrowUpgradeable/effects/cancelPayment';
import shouldBehaveLikeClose from '@test/escrows/IndustrialUnitsEscrowUpgradeable/effects/close';
import shouldBehaveLikeInitialize from '@test/escrows/IndustrialUnitsEscrowUpgradeable/effects/initialize';
import shouldBehaveLikeRevertAfterPayment from '@test/escrows/IndustrialUnitsEscrowUpgradeable/effects/revertAfterPayment';
import shouldBehaveLikeRevertBeforePayment from '@test/escrows/IndustrialUnitsEscrowUpgradeable/effects/revertBeforePayment';
import shouldBehaveLikeEscrow from '@test/escrows/IndustrialUnitsEscrowUpgradeable/view/escrow';
import shouldBehaveLikeState from '@test/escrows/IndustrialUnitsEscrowUpgradeable/view/state';
import shouldBehaveLikeDepositBatch from '@test/escrows/IndustrialUnitsEscrowUpgradeable/effects/depositBatch';
import shouldBehaveLikeMakePayment from '@test/escrows/IndustrialUnitsEscrowUpgradeable/effects/makePayment';
import shouldBehaveLikeDepositToken from '@test/escrows/IndustrialUnitsEscrowUpgradeable/effects/depositToken';
import shouldUpgrade from '@test/escrows/IndustrialUnitsEscrowUpgradeable/effects/upgrade';

export function shouldBehaveLikeIndustrialUnitsEscrowUpgradeable(): void {
  const idPallet1 = utils.formatBytes32String(dictPallet.default.id1);
  const idPallet2 = utils.formatBytes32String(dictPallet.default.id2);
  const idPallet3 = utils.formatBytes32String(dictPallet.default.id3);
  const id0 = 0;
  const id1 = 1;
  const palletPrice = dictPallet.price.toString();

  describe('Effects functions', function () {
    before(async function () {
      const { escrow } = await this.loadFixture(palletEscrowFixture);
      this.contracts.industrialUnitsEscrow = escrow;
    });
    describe('#upgrade', function () {
      shouldUpgrade();
    });

    describe('#initialize', function () {
      beforeEach(async function () {
        const { escrow } = await this.loadFixture(palletEscrowFixture);
        this.contracts.industrialUnitsEscrow = escrow;
      });
      shouldBehaveLikeInitialize();
    });

    describe('#depositToken', function () {
      beforeEach(async function () {
        const { escrow, palletToken } = await this.loadFixture(palletEscrowFixture);
        this.contracts.industrialUnitsEscrow = escrow;
        this.contracts.palletToken = palletToken;
      });
      shouldBehaveLikeDepositToken(id0, idPallet1, id1, palletPrice);
    });

    describe('#depositBatch', function () {
      beforeEach(async function () {
        const { escrow, palletToken } = await this.loadFixture(palletEscrowFixture);
        this.contracts.industrialUnitsEscrow = escrow;
        this.contracts.palletToken = palletToken;
      });
      shouldBehaveLikeDepositBatch(id0, [idPallet1, idPallet2], [id1, id1], palletPrice);
    });

    describe('#revertBeforePayment', function () {
      before(async function () {
        const { escrow, palletToken } = await this.loadFixture(activePalletEscrowFixture);
        this.contracts.industrialUnitsEscrow = escrow;
        this.contracts.palletToken = palletToken;
      });
      shouldBehaveLikeRevertBeforePayment([id0, id1], idPallet1, [idPallet2, idPallet3], id1, [id1, id1]);
    });

    describe('#makePayment', function () {
      beforeEach(async function () {
        const { escrow, palletToken } = await this.loadFixture(activePalletEscrowFixture);
        this.contracts.industrialUnitsEscrow = escrow;
        this.contracts.palletToken = palletToken;
      });
      shouldBehaveLikeMakePayment(id0, palletPrice);
    });

    describe('#cancelPayment', function () {
      beforeEach(async function () {
        const { escrow, palletToken } = await this.loadFixture(depositedPalletEscrowFixture);
        this.contracts.industrialUnitsEscrow = escrow;
        this.contracts.palletToken = palletToken;
      });
      shouldBehaveLikeCancelPayment(id0, palletPrice);
    });

    describe('#revertAfterPayment', function () {
      before(async function () {
        const { escrow, palletToken } = await this.loadFixture(depositedPalletEscrowFixture);
        this.contracts.industrialUnitsEscrow = escrow;
        this.contracts.palletToken = palletToken;
      });
      shouldBehaveLikeRevertAfterPayment([id0, id1], idPallet1, [idPallet2, idPallet3], id1, [id1, id1], palletPrice);
    });

    describe('#close', function () {
      before(async function () {
        const { escrow, palletToken } = await this.loadFixture(depositedPalletEscrowFixture);
        this.contracts.industrialUnitsEscrow = escrow;
        this.contracts.palletToken = palletToken;
      });

      shouldBehaveLikeClose([id0, id1], idPallet1, [idPallet2, idPallet3], id1, [id1, id1], palletPrice);
    });
  });

  describe('View functions', function () {
    describe('#escrow', function () {
      before(async function () {
        const { escrow, palletToken } = await depositedPalletEscrowFixture([
          this.signers.deployer,
          this.signers.acc2,
          this.signers.acc3
        ]);
        this.contracts.industrialUnitsEscrow = escrow;
        this.contracts.palletToken = palletToken;
      });
      shouldBehaveLikeEscrow(id1, [idPallet2, idPallet3], palletPrice);
    });

    describe('#state', function () {
      before(async function () {
        const { escrow, palletToken } = await this.loadFixture(activePalletEscrowFixture);
        this.contracts.industrialUnitsEscrow = escrow;
        this.contracts.palletToken = palletToken;
      });
      shouldBehaveLikeState(id0);
    });
  });
}
