import { oliveOilTokenFixture, mintedOliveOilTokenFixture } from 'hardhat-env/test/shared/fixtures';
import { dictOliveOil, dictOlives } from 'hardhat-env/test/shared/constants';
import { baseUri } from 'hardhat-env/shared/constants';
import { BigNumber, utils } from 'ethers';
import shouldUpgrade from 'hardhat-env/test/tokens/DependentTokenUpgradeable/effects/upgrade';
import shouldBehaveLikeInitialize from 'hardhat-env/test/tokens/DependentTokenUpgradeable/effects/initialize';
import shouldBehaveLikeMint from 'hardhat-env/test/tokens/DependentTokenUpgradeable/effects/mint';
import shouldBehaveLikeSetTokenTypeInstructions from 'hardhat-env/test/tokens/DependentTokenUpgradeable/effects/setTokenTypeInstructions';
import shouldBehaveLikeSetTokenTypesInstructions from 'hardhat-env/test/tokens/DependentTokenUpgradeable/effects/setTokenTypesInstructions';
import shouldBehaveLikeMintBatch from 'hardhat-env/test/tokens/DependentTokenUpgradeable/effects/mintBatch';
import shouldBehaveLikeBurn from 'hardhat-env/test/shared/base/BaseToken/effects/burn';
import shouldBehaveLikeBurnBatch from 'hardhat-env/test/shared/base/BaseToken/effects/burnBatch';
import shouldBehaveLikeBytesToIntTokenTypeId from 'hardhat-env/test/shared/base/BaseToken/view/bytesToIntTokenTypeId';
import shouldBehaveLikeGetInstructions from 'hardhat-env/test/tokens/DependentTokenUpgradeable/view/getInstructions';
import shouldBehaveLikeBytesToIntTokenId from 'hardhat-env/test/shared/base/BaseToken/view/bytesToIntTokenId';
import shouldBehaveLikeIntToBytesTokenId from 'hardhat-env/test/shared/base/BaseToken/view/intToBytesTokenId';

export function shouldBehaveLikeDependentTokenUpgradeable(): void {
  const contract = 'oliveOilToken';
  const idPicual = utils.formatBytes32String(dictOlives.picual.id);
  const idArbequina = utils.formatBytes32String(dictOlives.arbequina.id);
  const idOliveOilExtraVirginIntense = utils.formatBytes32String(dictOliveOil.extraVirginIntense.id);
  const idOliveOilExtraVirginSmooth = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.id);
  const idOliveOilExtraVirginIntenseToken1 = utils.formatBytes32String(dictOliveOil.extraVirginIntense.tokenId1);
  const idOliveOilExtraVirginIntenseToken2 = utils.formatBytes32String(dictOliveOil.extraVirginIntense.tokenId2);
  const oliveOilUnitsToMint = dictOliveOil.unitsToMint;
  const tokenUri = baseUri;
  const tokenTypeIds = [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth];
  const extraVirginIntenseInstructedIds = [idPicual];
  const extraVirginSmoothInstructedIds = [idArbequina];
  const oliveOilUnitsToBurn = dictOliveOil.unitsToBurn;
  const extraVirginIntenseOlivesUnits = BigNumber.from(dictOliveOil.extraVirginIntense.olivesUnits);
  const extraVirginIntenseInstructedAmounts = [extraVirginIntenseOlivesUnits];
  const extraVirginSmoothInstructedAmounts = [BigNumber.from(dictOliveOil.extraVirginSmooth.olivesUnits)];
  const id1 = 1;

  describe('Effects functions', function () {
    describe('#upgrade', function () {
      before(async function () {
        const { oliveOilToken } = await this.loadFixture(oliveOilTokenFixture);
        this.contracts.oliveOilToken = oliveOilToken;
      });

      shouldUpgrade(contract);
    });

    describe('#initialize', function () {
      before(async function () {
        const { oliveOilToken } = await this.loadFixture(oliveOilTokenFixture);
        this.contracts.oliveOilToken = oliveOilToken;
      });

      shouldBehaveLikeInitialize(contract, tokenUri);
    });

    describe('#setTokenTypeInstructions', function () {
      beforeEach(async function () {
        const { olivesToken, oliveOilToken } = await this.loadFixture(oliveOilTokenFixture);
        this.contracts.oliveOilToken = oliveOilToken;
        this.token.addresses = [olivesToken.address];
      });

      shouldBehaveLikeSetTokenTypeInstructions(
        contract,
        idOliveOilExtraVirginIntense,
        extraVirginIntenseInstructedIds,
        extraVirginIntenseInstructedAmounts
      );
    });

    describe('#setTokenTypesInstructions', function () {
      beforeEach(async function () {
        const { olivesToken, oliveOilToken } = await this.loadFixture(oliveOilTokenFixture);
        this.contracts.oliveOilToken = oliveOilToken;
        this.token.addresses = [olivesToken.address];
      });

      shouldBehaveLikeSetTokenTypesInstructions(
        contract,
        tokenTypeIds,
        [extraVirginIntenseInstructedIds, extraVirginSmoothInstructedIds],
        [extraVirginIntenseInstructedAmounts, extraVirginSmoothInstructedAmounts]
      );
    });

    describe('#mint', function () {
      beforeEach(async function () {
        const { oliveOilToken } = await this.loadFixture(oliveOilTokenFixture);
        this.contracts.oliveOilToken = oliveOilToken;
      });

      shouldBehaveLikeMint(
        contract,
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntenseToken1,
        oliveOilUnitsToMint,
        extraVirginIntenseInstructedIds,
        extraVirginIntenseInstructedAmounts
      );
    });

    describe('#mintBatch', function () {
      beforeEach(async function () {
        const { olivesToken, oliveOilToken } = await this.loadFixture(oliveOilTokenFixture);
        this.contracts.olivesToken = olivesToken;
        this.contracts.oliveOilToken = oliveOilToken;
      });

      shouldBehaveLikeMintBatch(
        contract,
        tokenTypeIds,
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginIntenseToken2],
        [oliveOilUnitsToMint, oliveOilUnitsToMint],
        [extraVirginIntenseInstructedIds, extraVirginIntenseInstructedIds],
        [extraVirginIntenseInstructedAmounts, extraVirginIntenseInstructedAmounts]
      );
    });

    describe('#burn', function () {
      beforeEach(async function () {
        const { oliveOilToken } = await this.loadFixture(mintedOliveOilTokenFixture);
        this.contracts.oliveOilToken = oliveOilToken;
      });

      shouldBehaveLikeBurn(
        contract,
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntenseToken1,
        oliveOilUnitsToBurn
      );
    });

    describe('#burnBatch', function () {
      beforeEach(async function () {
        const { oliveOilToken } = await this.loadFixture(mintedOliveOilTokenFixture);
        this.contracts.oliveOilToken = oliveOilToken;
      });

      shouldBehaveLikeBurnBatch(
        contract,
        [idOliveOilExtraVirginIntense, idOliveOilExtraVirginIntense],
        [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginIntenseToken2],
        [oliveOilUnitsToBurn, oliveOilUnitsToBurn]
      );
    });
  });

  describe('View functions', function () {
    before(async function () {
      const { olivesToken, oliveOilToken } = await this.loadFixture(mintedOliveOilTokenFixture);
      this.contracts.olivesToken = olivesToken;
      this.contracts.oliveOilToken = oliveOilToken;
    });

    describe('#getInstructions', function () {
      shouldBehaveLikeGetInstructions(
        contract,
        idOliveOilExtraVirginIntense,
        [idPicual],
        [extraVirginIntenseOlivesUnits]
      );
    });

    describe('#bytesToIntTokenId', function () {
      shouldBehaveLikeBytesToIntTokenId(
        contract,
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntenseToken1,
        id1
      );
    });

    describe('#bytesToIntTokenTypeId', function () {
      shouldBehaveLikeBytesToIntTokenTypeId(contract, idOliveOilExtraVirginIntense, id1);
    });

    describe('#intToBytesTokenId', function () {
      shouldBehaveLikeIntToBytesTokenId(contract, id1, idOliveOilExtraVirginIntenseToken1);
    });
  });
}
