import { BigNumber, utils } from 'ethers';
import { dictOliveOil, dictOlives } from '@test/shared/constants';
import { baseUri, dictChainActorsNames, dictContracts, uupsLibOpts } from '@shared/constants';
import {
  oliveOilMillFixture,
  activeOliveOilMillFixture,
  depositedOliveOilMillFixture,
  instructedCertificateOliveOilMillFixture,
  mintedOliveOilMillFixture,
  offeredPaymentOliveOilMillFixture,
  initializedOliveOilMillFixture,
  paymentOliveOilMillFixture
} from '@test/shared/fixtures';
import shouldBehaveLikeInitialize from '@test/roles/OliveOilMillUpgradeable/effects/initialize';
import shouldBehaveLikeSetTokenTypeInstructions from '@test/shared/base/DependentCreator/effects/setTokenTypeInstructions';
import shouldBehaveLikeSetTokenTypesInstructions from '@test/shared/base/DependentCreator/effects/setTokenTypesInstructions';
import shouldBehaveLikeMint from '@test/shared/base/DependentCreator/effects/mint';
import shouldBehaveLikeMintBatch from '@test/shared/base/DependentCreator/effects/mintBatch';
import shouldBehaveLikeDepositToken from '@test/shared/base/ManufacturedUnitsSeller/effects/depositToken';
import shouldBehaveLikeDepositBatch from '@test/shared/base/ManufacturedUnitsSeller/effects/depositBatch';
import shouldBehaveLikeRevertBeforePayment from '@test/shared/base/BaseSeller/effects/revertBeforePayment';
import shouldBehaveLikeRevertAfterPayment from '@test/shared/base/BaseSeller/effects/revertAfterPayment';
import shouldBehaveLikeCloseEscrow from '@test/shared/base/BaseSeller/effects/closeEscrow';
import shouldBehaveLikeMakeOffer from '@test/roles/OliveOilMillUpgradeable/effects/makeOffer';
import shouldBehaveLikeCancelPayment from '@test/roles/OliveOilMillUpgradeable/effects/cancelPayment';
import shouldBehaveLikeName from '@test/shared/base/BaseMember/view/name';
import shouldBehaveLikeReceive from '@test/shared/base/BaseSeller/effects/receive';
import shouldUpgrade from '@test/roles/OliveOilMillUpgradeable/effects/upgrade';
import shouldBehaveLikeBurn from '@test/shared/base/BaseSeller/effects/burn';
import shouldBehaveLikeBurnBatch from '@test/shared/base/BaseSeller/effects/burnBatch';

export function shouldBehaveLikeOliveOilMillUpgradeable(): void {
  const contract = 'oliveOilMill';
  const contractCertificate = 'oliveOilMillCertificate';
  const tokenContract = 'oliveOilToken';
  const instructedTokenContract = 'olivesToken';
  const tokenContractCertificate = 'oliveOilTokenCertificate';
  const oliveOilMillName = dictChainActorsNames.oliveOilMill.id1;
  const idOliveOilExtraVirginIntense = utils.formatBytes32String(dictOliveOil.extraVirginIntense.id);
  const idOliveOilExtraVirginSmooth = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.id);
  const idOliveOilExtraVirginIntenseToken1 = utils.formatBytes32String(dictOliveOil.extraVirginIntense.tokenId1);
  const idOliveOilExtraVirginSmoothToken1 = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.tokenId1);
  const idPicual = utils.formatBytes32String(dictOlives.picual.id);
  const idArbequina = utils.formatBytes32String(dictOlives.arbequina.id);
  const idHojiblanca = utils.formatBytes32String(dictOlives.hojiblanca.id);
  const idHojiblancaToken1 = utils.formatBytes32String(dictOlives.hojiblanca.tokenId1);
  const idPicualToken1 = utils.formatBytes32String(dictOlives.picual.tokenId1);
  const idArbequinaToken1 = utils.formatBytes32String(dictOlives.arbequina.tokenId1);
  const extraVirginIntenseInstructedIds = [idPicual];
  const extraVirginSmoothInstructedIds = [idArbequina];
  const extraVirginIntenseOlivesUnits = BigNumber.from(dictOliveOil.extraVirginIntense.olivesUnits);
  const extraVirginSmoothOlivesUnits = BigNumber.from(dictOliveOil.extraVirginSmooth.olivesUnits);
  const extraVirginIntenseInstructedAmounts = [extraVirginIntenseOlivesUnits];
  const extraVirginSmoothInstructedAmounts = [extraVirginSmoothOlivesUnits];
  const oobAmount = 1000 ** 2;
  const oliveOilUnitsToMint = dictOliveOil.unitsToMint;
  const oliveOilUnitsToBurn = dictOliveOil.unitsToMint;
  const oliveOilUnitsToEscrow = dictOliveOil.unitsToEscrow;
  const olivesPrice = dictOlives.price.toString();
  const oliveOilPrice = dictOliveOil.price.toString();
  const id0 = 0;
  const id1 = 1;

  describe('Effects functions', function () {
    describe('#upgrade', function () {
      shouldUpgrade(
        dictContracts.oliveOilMillWithInit.v1,
        dictContracts.dependentTokenWithInit.v1,
        dictContracts.commercialUnitsEscrowWithInit.v1,
        baseUri,
        uupsLibOpts,
        dictContracts.validation.v1
      );
    });

    describe('#initialize', function () {
      before(async function () {
        const { oliveOilMill, oliveOilToken, escrow } = await this.loadFixture(oliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.oliveOilToken = oliveOilToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeInitialize(oliveOilMillName);
    });

    describe('#setTokenTypeInstructions', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilToken, olivesToken } = await this.loadFixture(initializedOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.oliveOilToken = oliveOilToken;
        this.token.addresses = [olivesToken.address];
      });

      shouldBehaveLikeSetTokenTypeInstructions(
        contract,
        tokenContract,
        idOliveOilExtraVirginIntense,
        extraVirginIntenseInstructedIds,
        extraVirginIntenseInstructedAmounts
      );
    });

    describe('#setTokenTypesInstructions', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilToken, olivesToken } = await this.loadFixture(initializedOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.oliveOilToken = oliveOilToken;
        this.token.addresses = [olivesToken.address];
      });

      shouldBehaveLikeSetTokenTypesInstructions(
        contract,
        tokenContract,
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [extraVirginIntenseInstructedIds, extraVirginSmoothInstructedIds],
        [extraVirginIntenseInstructedAmounts, extraVirginSmoothInstructedAmounts]
      );
    });

    describe('#mint', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilMillWithCertificate } = await this.loadFixture(
          instructedCertificateOliveOilMillFixture
        );
        this.contracts.oliveOilMill = oliveOilMill.oliveOilMill;
        this.contracts.oliveOilMillCertificate = oliveOilMillWithCertificate.oliveOilMill;
        this.contracts.oliveOilToken = oliveOilMill.oliveOilToken;
        this.contracts.olivesToken = oliveOilMill.olivesToken;
        this.contracts.oliveOilTokenCertificate = oliveOilMillWithCertificate.oliveOilToken;
        this.token.addresses = [oliveOilMill.olivesToken.address];
        this.token.addressesCertificate = [oliveOilMillWithCertificate.olivesToken.address];
      });

      shouldBehaveLikeMint(
        contract,
        contractCertificate,
        tokenContract,
        [instructedTokenContract],
        tokenContractCertificate,
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntenseToken1,
        oliveOilUnitsToMint,
        [[idPicual]],
        [[idPicualToken1]],
        [[idHojiblanca]],
        [[idHojiblancaToken1]],
        [[extraVirginIntenseOlivesUnits.mul(oliveOilUnitsToMint)]],
        oobAmount
      );
    });

    describe('#mintBatch', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilMillWithCertificate } = await this.loadFixture(
          instructedCertificateOliveOilMillFixture
        );
        this.contracts.oliveOilMill = oliveOilMill.oliveOilMill;
        this.contracts.oliveOilMillCertificate = oliveOilMillWithCertificate.oliveOilMill;
        this.contracts.oliveOilToken = oliveOilMill.oliveOilToken;
        this.contracts.olivesToken = oliveOilMill.olivesToken;
        this.contracts.oliveOilTokenCertificate = oliveOilMillWithCertificate.oliveOilToken;
        this.token.addresses = [oliveOilMill.olivesToken.address];
        this.token.addressesCertificate = [oliveOilMillWithCertificate.olivesToken.address];
      });

      shouldBehaveLikeMintBatch(
        contract,
        contractCertificate,
        tokenContract,
        [instructedTokenContract],
        tokenContractCertificate,
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        [oliveOilUnitsToMint, oliveOilUnitsToMint],
        [[[idPicual]], [[idArbequina]]],
        [[[idPicualToken1]], [[idArbequinaToken1]]],
        [[[idHojiblanca]], [[idHojiblanca]]],
        [[[idHojiblancaToken1]], [[idHojiblancaToken1]]],
        [
          [[extraVirginIntenseOlivesUnits.mul(oliveOilUnitsToMint)]],
          [[extraVirginSmoothOlivesUnits.mul(oliveOilUnitsToMint)]]
        ],
        oobAmount
      );
    });

    describe('#burn', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilToken } = await this.loadFixture(mintedOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.oliveOilToken = oliveOilToken;
      });

      shouldBehaveLikeBurn(
        contract,
        tokenContract,
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntenseToken1,
        oliveOilUnitsToBurn
      );
    });

    describe('#burnBatch', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilToken } = await this.loadFixture(mintedOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.oliveOilToken = oliveOilToken;
      });

      shouldBehaveLikeBurnBatch(
        contract,
        tokenContract,
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        [oliveOilUnitsToBurn, oliveOilUnitsToBurn]
      );
    });

    describe('#depositToken', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilToken, escrow } = await this.loadFixture(mintedOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.oliveOilToken = oliveOilToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeDepositToken(
        contract,
        tokenContract,
        id0,
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntenseToken1,
        oliveOilUnitsToEscrow,
        oliveOilPrice
      );
    });

    describe('#depositBatch', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilToken, escrow } = await this.loadFixture(mintedOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.oliveOilToken = oliveOilToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeDepositBatch(
        contract,
        tokenContract,
        id0,
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        [oliveOilUnitsToEscrow, oliveOilUnitsToEscrow],
        oliveOilPrice
      );
    });

    describe('#revertBeforePayment', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilToken, escrow } = await this.loadFixture(activeOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.oliveOilToken = oliveOilToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeRevertBeforePayment(
        contract,
        tokenContract,
        [id0, id1],
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntenseToken1,
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        oliveOilUnitsToEscrow,
        [oliveOilUnitsToEscrow, oliveOilUnitsToEscrow]
      );
    });

    describe('#revertAfterPayment', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilToken, escrow } = await this.loadFixture(depositedOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.oliveOilToken = oliveOilToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeRevertAfterPayment(
        contract,
        tokenContract,
        [id0, id1],
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntenseToken1,
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        oliveOilUnitsToEscrow,
        [oliveOilUnitsToEscrow, oliveOilUnitsToEscrow],
        oliveOilPrice
      );
    });

    describe('#closeEscrow', function () {
      beforeEach(async function () {
        const { oliveOilMill, oliveOilToken, escrow } = await this.loadFixture(depositedOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.oliveOilToken = oliveOilToken;
        this.contracts.commercialUnitsEscrow = escrow;
      });

      shouldBehaveLikeCloseEscrow(
        contract,
        tokenContract,
        [id0, id1],
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntenseToken1,
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
        oliveOilUnitsToEscrow,
        [oliveOilUnitsToEscrow, oliveOilUnitsToEscrow],
        oliveOilPrice
      );
    });

    describe('#makeOffer', function () {
      beforeEach(async function () {
        const { oliveOilMill, escrow } = await this.loadFixture(paymentOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.agriculturalEscrow = escrow;
      });

      shouldBehaveLikeMakeOffer(id0, olivesPrice);
    });

    describe('#cancelPayment', function () {
      beforeEach(async function () {
        const { oliveOilMill, olivesToken, escrow } = await this.loadFixture(offeredPaymentOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
        this.contracts.olivesToken = olivesToken;
        this.contracts.agriculturalEscrow = escrow;
      });

      shouldBehaveLikeCancelPayment(id0, olivesPrice);
    });

    describe('#receive', function () {
      beforeEach(async function () {
        const { oliveOilMill } = await this.loadFixture(initializedOliveOilMillFixture);
        this.contracts.oliveOilMill = oliveOilMill;
      });

      shouldBehaveLikeReceive(contract, oliveOilPrice);
    });
  });

  describe('View functions', function () {
    describe('#name', function () {
      before(async function () {
        const { oliveOilMill } = await initializedOliveOilMillFixture([this.signers.deployer]);
        this.contracts.oliveOilMill = oliveOilMill;
      });
      shouldBehaveLikeName(contract, oliveOilMillName);
    });
  });
}
