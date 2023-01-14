import { expect } from 'chai';
import { constants } from 'ethers';
import { EventsBaseToken, EventsERC1155, EventsIndustrialUnitToken } from 'hardhat-env/test/shared/events';

export default function shouldBehaveLikeUnpackBatch(
  palletsIds: string[],
  tokenTypeIds: string[][],
  tokenIds: string[][],
  tokenAmounts: number[][]
): void {
  context('succeeds', function () {
    it('unpacking multiple pallets', async function () {
      const tx = await this.contracts.bottlingPlant.unpackBatch(palletsIds);
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
              this.contracts.palletToken.address,
              this.contracts.bottlingPlant.address,
              intTokenId,
              tokenAmounts[i][j]
            );
          await expect(tx)
            .to.emit(this.contracts.oliveOilBottleToken, EventsBaseToken.TokenTransferred)
            .withArgs(
              this.contracts.palletToken.address,
              this.contracts.palletToken.address,
              this.contracts.bottlingPlant.address,
              tokenTypeIds[i][j],
              tokenIds[i][j],
              tokenAmounts[i][j]
            );
        }
      }
      const intPalletsIds = await Promise.all(
        palletsIds.map(async (id) => {
          return await this.contracts.palletToken.bytesToIntId(id);
        })
      );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchUnpacked)
        .withArgs(this.contracts.bottlingPlant.address, palletsIds);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.bottlingPlant.address,
          this.contracts.bottlingPlant.address,
          constants.AddressZero,
          intPalletsIds,
          palletsAmounts
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchTransferred)
        .withArgs(
          this.contracts.bottlingPlant.address,
          this.contracts.bottlingPlant.address,
          constants.AddressZero,
          palletsIds,
          palletsAmounts
        );
    });
  });
}
