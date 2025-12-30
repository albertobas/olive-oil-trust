import { utils } from 'ethers';
import { dictOlives } from '@test/shared/constants';
import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from '@shared/constants';
import {
  activeOliveGrowerFixture,
  mintedOliveGrowerFixture,
  offeredOliveGrowerFixture,
  oliveGrowerFixture
} from '@test/shared/fixtures';
import shouldBehaveLikeName from '@test/shared/base/BaseMember/view/name';
import shouldBehaveLikeRevertAfterPayment from '@test/roles/OliveGrowerUpgradeable/effects/revertAfterPayment';
import shouldBehaveLikeCloseEscrow from '@test/roles/OliveGrowerUpgradeable/effects/closeEscrow';
import shouldBehaveLikeInitialize from '@test/roles/OliveGrowerUpgradeable/effects/initialize';
import shouldBehaveLikeMint from '@test/shared/base/IndependentCreator/effects/mint';
import shouldBehaveLikeMintBatch from '@test/shared/base/IndependentCreator/effects/mintBatch';
import shouldBehaveLikeDepositToken from '@test/roles/OliveGrowerUpgradeable/effects/depositToken';
import shouldBehaveLikeDepositBatch from '@test/roles/OliveGrowerUpgradeable/effects/depositBatch';
import shouldBehaveLikeRevertBeforePayment from '@test/roles/OliveGrowerUpgradeable/effects/revertBeforePayment';
import shouldBehaveLikeReceive from '@test/shared/base/BaseSeller/effects/receive';
import shouldUpgrade from '@test/roles/OliveGrowerUpgradeable/effects/upgrade';
import shouldBehaveLikeBurn from '@test/shared/base/BaseSeller/effects/burn';
import shouldBehaveLikeBurnBatch from '@test/shared/base/BaseSeller/effects/burnBatch';

export function shouldBehaveLikeOliveGrowerUpgradeable(): void {
  const contract = 'oliveGrower';
  const tokenContract = 'olivesToken';
  const oliveGrowerName = dictChainActorsNames.oliveGrower.id1;
  const idPicual = utils.formatBytes32String(dictOlives.picual.id);
  const idArbequina = utils.formatBytes32String(dictOlives.arbequina.id);
  const idPicualToken1 = utils.formatBytes32String(dictOlives.picual.tokenId1);
  const idArbequinaToken1 = utils.formatBytes32String(dictOlives.arbequina.tokenId1);
  const olivesUnitsToMint = dictOlives.unitsToMint;
  const olivesUnitsToBurn = dictOlives.unitsToBurn;
  const olivesUnitsToEscrow = dictOlives.unitsToEscrow;
  const olivesPrice = dictOlives.price.toString();
  const id0 = 0;
  const id1 = 1;

  describe('Effects functions', function () {
    describe('#upgrade', function () {
      shouldUpgrade(
        dictContracts.oliveGrowerWithInit.v1,
        dictContracts.independentTokenWithInit.v1,
        dictContracts.agriculturalEscrowWithInit.v1,
        baseUri,
        uupsOpts
      );
    });

    describe('#initialize', function () {
      beforeEach(async function () {
        const { oliveGrower, olivesToken, escrow } = await this.loadFixture(oliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
        this.contracts.olivesToken = olivesToken;
        this.contracts.agriculturalEscrow = escrow;
      });

      shouldBehaveLikeInitialize(oliveGrowerName);
    });

    describe('#mint', function () {
      beforeEach(async function () {
        const { oliveGrower, olivesToken, escrow } = await this.loadFixture(oliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
        this.contracts.olivesToken = olivesToken;
        this.contracts.agriculturalEscrow = escrow;
      });

      shouldBehaveLikeMint(contract, tokenContract, idPicual, idPicualToken1, olivesUnitsToMint);
    });

    describe('#mintBatch', function () {
      beforeEach(async function () {
        const { oliveGrower, olivesToken, escrow } = await this.loadFixture(oliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
        this.contracts.olivesToken = olivesToken;
        this.contracts.agriculturalEscrow = escrow;
      });

      shouldBehaveLikeMintBatch(
        contract,
        tokenContract,
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [olivesUnitsToMint, olivesUnitsToMint]
      );
    });

    describe('#burn', function () {
      beforeEach(async function () {
        const { oliveGrower, olivesToken } = await this.loadFixture(mintedOliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
        this.contracts.olivesToken = olivesToken;
      });

      shouldBehaveLikeBurn(contract, tokenContract, idPicual, idPicualToken1, olivesUnitsToBurn);
    });

    describe('#burnBatch', function () {
      beforeEach(async function () {
        const { oliveGrower, olivesToken } = await this.loadFixture(mintedOliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
        this.contracts.olivesToken = olivesToken;
      });

      shouldBehaveLikeBurnBatch(
        contract,
        tokenContract,
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [olivesUnitsToBurn, olivesUnitsToBurn]
      );
    });

    describe('#depositToken', function () {
      beforeEach(async function () {
        const { oliveGrower, olivesToken, escrow } = await this.loadFixture(mintedOliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
        this.contracts.olivesToken = olivesToken;
        this.contracts.agriculturalEscrow = escrow;
      });

      shouldBehaveLikeDepositToken(id0, idPicual, idPicualToken1, olivesUnitsToEscrow);
    });

    describe('#depositBatch', function () {
      beforeEach(async function () {
        const { oliveGrower, olivesToken, escrow } = await this.loadFixture(mintedOliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
        this.contracts.olivesToken = olivesToken;
        this.contracts.agriculturalEscrow = escrow;
      });

      shouldBehaveLikeDepositBatch(
        id0,
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [olivesUnitsToEscrow, olivesUnitsToEscrow]
      );
    });

    describe('#revertBeforePayment', function () {
      beforeEach(async function () {
        const { oliveGrower, olivesToken, escrow } = await this.loadFixture(activeOliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
        this.contracts.olivesToken = olivesToken;
        this.contracts.agriculturalEscrow = escrow;
      });

      shouldBehaveLikeRevertBeforePayment(
        [id0, id1],
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [olivesUnitsToEscrow, olivesUnitsToEscrow]
      );
    });

    describe('#revertAfterPayment', function () {
      beforeEach(async function () {
        const { oliveGrower, olivesToken, escrow } = await this.loadFixture(offeredOliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
        this.contracts.olivesToken = olivesToken;
        this.contracts.agriculturalEscrow = escrow;
      });

      shouldBehaveLikeRevertAfterPayment(
        [id0, id1],
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [olivesUnitsToEscrow, olivesUnitsToEscrow],
        olivesPrice
      );
    });

    describe('#closeEscrow', function () {
      beforeEach(async function () {
        const { oliveGrower, olivesToken, escrow } = await this.loadFixture(offeredOliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
        this.contracts.olivesToken = olivesToken;
        this.contracts.agriculturalEscrow = escrow;
      });

      shouldBehaveLikeCloseEscrow(
        [id0, id1],
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [olivesUnitsToEscrow, olivesUnitsToEscrow],
        olivesPrice
      );
    });

    describe('#receive', function () {
      beforeEach(async function () {
        const { oliveGrower } = await this.loadFixture(oliveGrowerFixture);
        this.contracts.oliveGrower = oliveGrower;
      });

      shouldBehaveLikeReceive(contract, olivesPrice);
    });
  });

  describe('View functions', function () {
    describe('#name', function () {
      before(async function () {
        const { oliveGrower } = await oliveGrowerFixture([this.signers.deployer]);
        this.contracts.oliveGrower = oliveGrower;
      });

      shouldBehaveLikeName(contract, oliveGrowerName);
    });
  });
}
