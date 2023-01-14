import { expect } from 'chai';
import { constants } from 'ethers';
import { EventsBaseToken, EventsERC1155, EventsIndustrialUnitToken } from 'hardhat-env/test/shared/events';

export default function shouldBehaveLikeUnpack(
  palletId: string,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[]
): void {
  context('succeeds', function () {
    it('unpacking a pallet', async function () {
      const tx = await this.contracts.bottlingPlant.unpack(palletId);
      const intPalletId = await this.contracts.palletToken.bytesToIntId(palletId);
      for (let i = 0; i < tokenIds.length; i++) {
        const intTokenId = await this.contracts.oliveOilBottleToken.bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
        await expect(tx)
          .to.emit(this.contracts.oliveOilBottleToken, EventsERC1155.TransferSingle)
          .withArgs(
            this.contracts.palletToken.address,
            this.contracts.palletToken.address,
            this.contracts.bottlingPlant.address,
            intTokenId,
            tokenAmounts[i]
          );
        await expect(tx)
          .to.emit(this.contracts.oliveOilBottleToken, EventsBaseToken.TokenTransferred)
          .withArgs(
            this.contracts.palletToken.address,
            this.contracts.palletToken.address,
            this.contracts.bottlingPlant.address,
            tokenTypeIds[i],
            tokenIds[i],
            tokenAmounts[i]
          );
      }
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.SingleUnpacked)
        .withArgs(this.contracts.bottlingPlant.address, palletId);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.bottlingPlant.address,
          this.contracts.bottlingPlant.address,
          constants.AddressZero,
          intPalletId,
          1
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.TokenTransferred)
        .withArgs(
          this.contracts.bottlingPlant.address,
          this.contracts.bottlingPlant.address,
          constants.AddressZero,
          palletId,
          1
        );
    });
  });
}
