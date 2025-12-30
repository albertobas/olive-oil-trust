import { utils } from 'ethers';
import { activeOlivesEscrowFixture, depositedOlivesEscrowFixture, olivesEscrowFixture } from '@test/shared/fixtures';
import { dictOlives } from '@test/shared/constants';
import shouldBehaveLikeInitialize from '@test/shared/base/BaseEscrow/effects/initialize';
import shouldBehaveLikeDepositToken from '@test/escrows/AgriculturalEscrowUpgradeable/effects/depositToken';
import shouldBehaveLikeDepositBatch from '@test/escrows/AgriculturalEscrowUpgradeable/effects/depositBatch';
import shouldBehaveLikeRevertBeforePayment from '@test/shared/base/BaseEscrow/effects/revertBeforePayment';
import shouldBehaveLikeMakeOffer from '@test/escrows/AgriculturalEscrowUpgradeable/effects/makeOffer';
import shouldBehaveLikeRevertAfterPayment from '@test/shared/base/BaseEscrow/effects/revertAfterPayment';
import shouldBehaveLikeCancelPayment from '@test/shared/base/BaseEscrow/effects/cancelPayment';
import shouldBehaveLikeClose from '@test/shared/base/BaseEscrow/effects/close';
import shouldBehaveLikeEscrow from '@test/shared/base/BaseEscrow/view/escrow';
import shouldBehaveLikeState from '@test/shared/base/BaseEscrow/view/state';
import shouldUpgrade from '@test/escrows/AgriculturalEscrowUpgradeable/effects/upgrade';

export function shouldBehaveLikeAgriculturalEscrowUpgradeable(): void {
  const contract = 'agriculturalEscrow';
  const tokenContract = 'olivesToken';
  const idPicual = utils.formatBytes32String(dictOlives.picual.id);
  const idArbequina = utils.formatBytes32String(dictOlives.arbequina.id);
  const idPicualToken1 = utils.formatBytes32String(dictOlives.picual.tokenId1);
  const idArbequinaToken1 = utils.formatBytes32String(dictOlives.arbequina.tokenId1);
  const unitsToEscrow = dictOlives.unitsToEscrow;
  const id0 = 0;
  const id1 = 1;
  const tokenPrice = dictOlives.price.toString();

  describe('Effects functions', function () {
    describe('#upgrade', function () {
      before(async function () {
        const { escrow } = await this.loadFixture(olivesEscrowFixture);
        this.contracts.agriculturalEscrow = escrow;
      });
      shouldUpgrade();
    });

    describe('#initialize', function () {
      beforeEach(async function () {
        const { escrow } = await this.loadFixture(olivesEscrowFixture);
        this.contracts.agriculturalEscrow = escrow;
      });
      shouldBehaveLikeInitialize(contract);
    });

    describe('#depositToken', function () {
      beforeEach(async function () {
        const { escrow, olivesToken } = await this.loadFixture(olivesEscrowFixture);
        await olivesToken.setApprovalForAll(escrow.address, true);
        this.contracts.agriculturalEscrow = escrow;
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeDepositToken(tokenContract, id0, idPicual, idPicualToken1, unitsToEscrow);
    });

    describe('#depositBatch', function () {
      beforeEach(async function () {
        const { escrow, olivesToken } = await this.loadFixture(olivesEscrowFixture);
        await olivesToken.setApprovalForAll(escrow.address, true);
        this.contracts.agriculturalEscrow = escrow;
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeDepositBatch(
        tokenContract,
        id0,
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [unitsToEscrow, unitsToEscrow]
      );
    });

    describe('#revertBeforePayment', function () {
      before(async function () {
        const { escrow, olivesToken } = await this.loadFixture(activeOlivesEscrowFixture);
        this.contracts.agriculturalEscrow = escrow;
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeRevertBeforePayment(
        contract,
        tokenContract,
        [id0, id1],
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [unitsToEscrow, unitsToEscrow]
      );
    });

    describe('#makeOffer', function () {
      beforeEach(async function () {
        const { escrow, olivesToken } = await this.loadFixture(activeOlivesEscrowFixture);
        this.contracts.agriculturalEscrow = escrow;
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeMakeOffer(id0, tokenPrice);
    });

    describe('#cancelPayment', function () {
      beforeEach(async function () {
        const { escrow, olivesToken } = await this.loadFixture(depositedOlivesEscrowFixture);
        this.contracts.agriculturalEscrow = escrow;
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeCancelPayment(contract, id0, tokenPrice);
    });

    describe('#revertAfterPayment', function () {
      before(async function () {
        const { escrow, olivesToken } = await this.loadFixture(depositedOlivesEscrowFixture);
        this.contracts.agriculturalEscrow = escrow;
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeRevertAfterPayment(
        contract,
        tokenContract,
        [id0, id1],
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [unitsToEscrow, unitsToEscrow],
        tokenPrice
      );
    });

    describe('#close', function () {
      before(async function () {
        const { escrow, olivesToken } = await this.loadFixture(depositedOlivesEscrowFixture);
        this.contracts.agriculturalEscrow = escrow;
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeClose(
        contract,
        tokenContract,
        [id0, id1],
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [unitsToEscrow, unitsToEscrow],
        tokenPrice
      );
    });
  });

  describe('View functions', function () {
    describe('#escrow', function () {
      before(async function () {
        const { escrow, olivesToken } = await this.loadFixture(depositedOlivesEscrowFixture);
        this.contracts.agriculturalEscrow = escrow;
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeEscrow(
        contract,
        tokenContract,
        id1,
        [idPicualToken1, idArbequinaToken1],
        [unitsToEscrow, unitsToEscrow],
        tokenPrice
      );
    });

    describe('#state', function () {
      before(async function () {
        const { escrow, olivesToken } = await this.loadFixture(activeOlivesEscrowFixture);
        this.contracts.agriculturalEscrow = escrow;
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeState(contract, id0);
    });
  });
}
