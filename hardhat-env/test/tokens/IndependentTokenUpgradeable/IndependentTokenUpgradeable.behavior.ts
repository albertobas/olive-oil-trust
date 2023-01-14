import { utils } from 'ethers';
import { dictOlives } from 'hardhat-env/test/shared/constants';
import { baseUri } from 'hardhat-env/shared/constants';
import { olivesTokenFixture, mintedOlivesFixture } from 'hardhat-env/test/shared/fixtures';
import shouldUpgrade from 'hardhat-env/test/tokens/IndependentTokenUpgradeable/effects/upgrade';
import shouldBehaveLikeInitialize from 'hardhat-env/test/tokens/IndependentTokenUpgradeable/effects/initialize';
import shouldBehaveLikeMint from 'hardhat-env/test/tokens/IndependentTokenUpgradeable/effects/mint';
import shouldBehaveLikeMintBatch from 'hardhat-env/test/tokens/IndependentTokenUpgradeable/effects/mintBatch';
import shouldBehaveLikeBurn from 'hardhat-env/test/shared/base/BaseToken/effects/burn';
import shouldBehaveLikeBurnBatch from 'hardhat-env/test/shared/base/BaseToken/effects/burnBatch';
import shouldBehaveLikeBytesToIntTokenTypeId from 'hardhat-env/test/shared/base/BaseToken/view/bytesToIntTokenTypeId';
import shouldBehaveLikeBytesToIntTokenId from 'hardhat-env/test/shared/base/BaseToken/view/bytesToIntTokenId';
import shouldBehaveLikeIntToBytesTokenId from 'hardhat-env/test/shared/base/BaseToken/view/intToBytesTokenId';

export function shouldBehaveLikeIndependentTokenUpgradeable(): void {
  const contract = 'olivesToken';
  const idArbequina = utils.formatBytes32String(dictOlives.arbequina.id);
  const idPicual = utils.formatBytes32String(dictOlives.picual.id);
  const idArbequinaToken1 = utils.formatBytes32String(dictOlives.arbequina.tokenId1);
  const idPicualToken1 = utils.formatBytes32String(dictOlives.picual.tokenId1);
  const tokenUri = baseUri;
  const olivesUnitsToMint = dictOlives.unitsToMint;
  const olivesUnitsToBurn = dictOlives.unitsToBurn;
  const id1 = 1;

  describe('Effects functions', function () {
    before(async function () {
      const olivesToken = await this.loadFixture(olivesTokenFixture);
      this.contracts.olivesToken = olivesToken;
    });
    describe('#upgrade', function () {
      shouldUpgrade(contract);
    });

    describe('#initialize', function () {
      beforeEach(async function () {
        const olivesToken = await this.loadFixture(olivesTokenFixture);
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeInitialize(contract, tokenUri);
    });

    describe('#mint', function () {
      beforeEach(async function () {
        const olivesToken = await this.loadFixture(olivesTokenFixture);
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeMint(contract, idPicual, idPicualToken1, olivesUnitsToMint);
    });

    describe('#mintBatch', function () {
      beforeEach(async function () {
        const olivesToken = await this.loadFixture(olivesTokenFixture);
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeMintBatch(
        contract,
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [olivesUnitsToMint, olivesUnitsToMint]
      );
    });

    describe('#burn', function () {
      beforeEach(async function () {
        const olivesToken = await this.loadFixture(mintedOlivesFixture);
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeBurn(contract, idPicual, idPicualToken1, olivesUnitsToBurn);
    });

    describe('#burnBatch', function () {
      beforeEach(async function () {
        const olivesToken = await this.loadFixture(mintedOlivesFixture);
        this.contracts.olivesToken = olivesToken;
      });
      shouldBehaveLikeBurnBatch(
        contract,
        [idPicual, idArbequina],
        [idPicualToken1, idArbequinaToken1],
        [olivesUnitsToBurn, olivesUnitsToBurn]
      );
    });
  });

  describe('View functions', function () {
    before(async function () {
      const olivesToken = await this.loadFixture(mintedOlivesFixture);
      this.contracts.olivesToken = olivesToken;
    });

    describe('#bytesToIntTokenId', function () {
      shouldBehaveLikeBytesToIntTokenId(contract, idPicual, idPicualToken1, id1);
    });

    describe('#bytesToIntTokenTypeId', function () {
      shouldBehaveLikeBytesToIntTokenTypeId(contract, idPicual, id1);
    });

    describe('#intToBytesTokenId', function () {
      shouldBehaveLikeIntToBytesTokenId(contract, id1, idPicualToken1);
    });
  });
}
