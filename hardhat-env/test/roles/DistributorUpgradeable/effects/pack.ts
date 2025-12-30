import { expect } from 'chai';
import { constants } from 'ethers';
import { EventsBaseToken, EventsERC1155, EventsIndustrialUnitToken } from '@test/shared/events';
import { ErrorsOwnable } from '@test/shared/errors';

export default function shouldBehaveLikePack(
  palletId: string,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[]
): void {
  context('succeeds', function () {
    it('packing a pallet', async function () {
      const addresses = [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address];
      const tx = await this.contracts.distributor.pack(palletId, addresses, tokenTypeIds, tokenIds, tokenAmounts);
      for (let i = 0; i < tokenIds.length; i++) {
        const intTokenId = await this.contracts.oliveOilBottleToken.bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
        await expect(tx)
          .to.emit(this.contracts.oliveOilBottleToken, EventsERC1155.TransferSingle)
          .withArgs(
            this.contracts.palletToken.address,
            this.contracts.distributor.address,
            this.contracts.palletToken.address,
            intTokenId,
            tokenAmounts[i]
          );
        await expect(tx)
          .to.emit(this.contracts.oliveOilBottleToken, EventsBaseToken.TokenTransferred)
          .withArgs(
            this.contracts.palletToken.address,
            this.contracts.distributor.address,
            this.contracts.palletToken.address,
            tokenTypeIds[i],
            tokenIds[i],
            tokenAmounts[i]
          );
      }
      const intPalletId = await this.contracts.palletToken.bytesToIntId(palletId);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.SinglePacked)
        .withArgs(this.contracts.distributor.address, palletId, addresses, tokenTypeIds, tokenIds, tokenAmounts);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.distributor.address,
          constants.AddressZero,
          this.contracts.distributor.address,
          intPalletId,
          1
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.TokenTransferred)
        .withArgs(
          this.contracts.distributor.address,
          constants.AddressZero,
          this.contracts.distributor.address,
          palletId,
          1
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      const addresses = [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address];
      await expect(
        this.contracts.distributor
          .connect(this.signers.acc2)
          .pack(palletId, addresses, tokenTypeIds, tokenIds, tokenAmounts)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
