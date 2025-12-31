import { expect } from 'chai';
import { constants } from 'ethers';
import { EventsBaseToken, EventsERC1155, EventsIndustrialUnitToken } from '@test/shared/events';
import { ErrorsBottlingPlantUpgradeable, ErrorsOwnable } from '@test/shared/errors';

export default function shouldBehaveLikePack(
  palletId: string,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[]
): void {
  context('succeeds', function () {
    it('packing a pallet', async function () {
      const addresses = [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address];
      const tx = await this.contracts.bottlingPlant.pack(palletId, tokenTypeIds, tokenIds, tokenAmounts);
      for (let i = 0; i < tokenIds.length; i++) {
        const intTokenId = await this.contracts.oliveOilBottleToken.bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
        await expect(tx)
          .to.emit(this.contracts.oliveOilBottleToken, EventsERC1155.TransferSingle)
          .withArgs(
            this.contracts.palletToken.address,
            this.contracts.bottlingPlant.address,
            this.contracts.palletToken.address,
            intTokenId,
            tokenAmounts[i]
          );
        await expect(tx)
          .to.emit(this.contracts.oliveOilBottleToken, EventsBaseToken.TokenTransferred)
          .withArgs(
            this.contracts.palletToken.address,
            this.contracts.bottlingPlant.address,
            this.contracts.palletToken.address,
            tokenTypeIds[i],
            tokenIds[i],
            tokenAmounts[i]
          );
      }
      const intPalletId = await this.contracts.palletToken.bytesToIntId(palletId);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.SinglePacked)
        .withArgs(this.contracts.bottlingPlant.address, palletId, addresses, tokenTypeIds, tokenIds, tokenAmounts);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.bottlingPlant.address,
          constants.AddressZero,
          this.contracts.bottlingPlant.address,
          intPalletId,
          1
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.TokenTransferred)
        .withArgs(
          this.contracts.bottlingPlant.address,
          constants.AddressZero,
          this.contracts.bottlingPlant.address,
          palletId,
          1
        );
    });
  });

  context('fails', function () {
    it("if packing a pallet with invalid arrays' lengths", async function () {
      await expect(this.contracts.bottlingPlant.pack(palletId, [], tokenIds, tokenAmounts)).to.be.revertedWith(
        ErrorsBottlingPlantUpgradeable.InvalidArray
      );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.bottlingPlant.connect(this.signers.acc2).pack(palletId, tokenTypeIds, tokenIds, tokenAmounts)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
