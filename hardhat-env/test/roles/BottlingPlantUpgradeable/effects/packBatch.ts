import { expect } from 'chai';
import { constants } from 'ethers';
import { EventsBaseToken, EventsERC1155, EventsIndustrialUnitToken } from 'hardhat-env/test/shared/events';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';

export default function shouldBehaveLikePackBatch(
  palletsIds: string[],
  tokenTypeIds: string[][],
  tokenIds: string[][],
  tokenAmounts: number[][]
): void {
  context('succeeds', function () {
    it('packing multiple pallets', async function () {
      const tx = await this.contracts.bottlingPlant.packBatch(palletsIds, tokenTypeIds, tokenIds, tokenAmounts);
      const intPalletsIds = await Promise.all(
        palletsIds.map(async (id) => {
          return await this.contracts.palletToken.bytesToIntId(id);
        })
      );
      await expect(tx).to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchPacked);
      const palletsAmounts = [];
      for (let i = 0; i < tokenIds.length; i++) {
        palletsAmounts.push(1);
        for (let j = 0; j < tokenIds[i].length; j++) {
          const intTokenId = await this.contracts.oliveOilBottleToken.bytesToIntTokenId(
            tokenTypeIds[i][j],
            tokenIds[i][j]
          );
          await expect(tx)
            .to.emit(this.contracts.oliveOilBottleToken, EventsERC1155.TransferSingle)
            .withArgs(
              this.contracts.palletToken.address,
              this.contracts.bottlingPlant.address,
              this.contracts.palletToken.address,
              intTokenId,
              tokenAmounts[i][j]
            );
          await expect(tx)
            .to.emit(this.contracts.oliveOilBottleToken, EventsBaseToken.TokenTransferred)
            .withArgs(
              this.contracts.palletToken.address,
              this.contracts.bottlingPlant.address,
              this.contracts.palletToken.address,
              tokenTypeIds[i][j],
              tokenIds[i][j],
              tokenAmounts[i][j]
            );
        }
      }
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.bottlingPlant.address,
          constants.AddressZero,
          this.contracts.bottlingPlant.address,
          intPalletsIds,
          palletsAmounts
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchTransferred)
        .withArgs(
          this.contracts.bottlingPlant.address,
          constants.AddressZero,
          this.contracts.bottlingPlant.address,
          palletsIds,
          palletsAmounts
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.bottlingPlant
          .connect(this.signers.acc2)
          .packBatch(palletsIds, tokenTypeIds, tokenIds, tokenAmounts)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
