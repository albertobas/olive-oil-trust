import { utils } from 'ethers';
import { hexDataSlice, keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import { dictOliveOilBottle, dictPallet } from '@test/shared/constants';
import { baseUri } from '@shared/constants';
import { palletTokenFixture, packedPalletFixture } from '@test/shared/fixtures';
import shouldBehaveLikeInitialize from '@test/tokens/IndustrialUnitTokenUpgradeable/effects/initialize';
import shouldBehaveLikePack from '@test/tokens/IndustrialUnitTokenUpgradeable/effects/pack';
import shouldBehaveLikePackBatch from '@test/tokens/IndustrialUnitTokenUpgradeable/effects/packBatch';
import shouldBehaveLikeUnpack from '@test/tokens/IndustrialUnitTokenUpgradeable/effects/unpack';
import shouldBehaveLikeUnpackBatch from '@test/tokens/IndustrialUnitTokenUpgradeable/effects/unpackBatch';
import shouldBehaveLikeBytesToIntId from '@test/tokens/IndustrialUnitTokenUpgradeable/view/bytesToIntId';
import shouldBehaveLikeGetTokens from '@test/tokens/IndustrialUnitTokenUpgradeable/view/getTokens';
import shouldBehaveLikeSupportsInterface from '@test/tokens/IndustrialUnitTokenUpgradeable/view/supportsInterface';
import shouldBehaveLikeIntToBytesId from '@test/tokens/IndustrialUnitTokenUpgradeable/view/intToBytesId';
import shouldUpgrade from '@test/tokens/IndustrialUnitTokenUpgradeable/effects/upgrade';

export function shouldBehaveLikeIndustrialUnitTokenUpgradeable(): void {
  const idPallet1 = utils.formatBytes32String(dictPallet.default.id1);
  const idPallet2 = utils.formatBytes32String(dictPallet.default.id2);
  const tokenUri = baseUri;
  const oliveOilBottleUnitsToPack = dictOliveOilBottle.unitsToPack;
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
  const id1 = 1;
  const hexString = keccak256(toUtf8Bytes('supportsInterface(bytes4)'));
  const interfaceId = hexDataSlice(hexString, 0, 4);

  describe('Effects functions', function () {
    before(async function () {
      const { palletToken } = await this.loadFixture(palletTokenFixture);
      this.contracts.palletToken = palletToken;
    });
    describe('#upgrade', function () {
      shouldUpgrade();
    });

    describe('#initialize', function () {
      before(async function () {
        const { palletToken } = await this.loadFixture(palletTokenFixture);
        this.contracts.palletToken = palletToken;
      });
      shouldBehaveLikeInitialize(tokenUri);
    });

    describe('#pack', function () {
      beforeEach(async function () {
        const { palletToken, oliveOilBottleToken } = await this.loadFixture(palletTokenFixture);
        this.contracts.palletToken = palletToken;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
      });
      shouldBehaveLikePack(
        idPallet1,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack]
      );
    });

    describe('#packBatch', function () {
      beforeEach(async function () {
        const { palletToken, oliveOilBottleToken } = await this.loadFixture(palletTokenFixture);
        this.contracts.palletToken = palletToken;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
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
      beforeEach(async function () {
        const { palletToken, oliveOilBottleToken } = await this.loadFixture(packedPalletFixture);
        this.contracts.palletToken = palletToken;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
      });
      shouldBehaveLikeUnpack(
        idPallet1,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack]
      );
    });

    describe('#unpackBatch', function () {
      beforeEach(async function () {
        const { palletToken, oliveOilBottleToken } = await this.loadFixture(packedPalletFixture);
        this.contracts.palletToken = palletToken;
        this.contracts.oliveOilBottleToken = oliveOilBottleToken;
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
  });

  describe('View functions', function () {
    before(async function () {
      const { palletToken, oliveOilBottleToken } = await this.loadFixture(packedPalletFixture);
      this.contracts.palletToken = palletToken;
      this.contracts.oliveOilBottleToken = oliveOilBottleToken;
      this.token.addresses = [oliveOilBottleToken.address, oliveOilBottleToken.address];
    });
    describe('#bytesToIntId', function () {
      shouldBehaveLikeBytesToIntId(idPallet1, id1);
    });

    describe('#intToBytesId', function () {
      shouldBehaveLikeIntToBytesId(id1, idPallet1);
    });

    describe('#getTokens', function () {
      shouldBehaveLikeGetTokens(
        idPallet1,
        [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
        [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
        [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack]
      );
    });

    describe('#supportedInterface', function () {
      shouldBehaveLikeSupportsInterface(interfaceId);
    });
  });
}
