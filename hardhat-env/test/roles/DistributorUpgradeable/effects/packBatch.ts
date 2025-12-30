import { expect } from 'chai';
import { constants } from 'ethers';
import { EventsBaseToken, EventsERC1155, EventsIndustrialUnitToken } from '@test/shared/events';
import { ErrorsDistributorUpgradeable, ErrorsOwnable } from '@test/shared/errors';

export default function shouldBehaveLikePackBatch(
  palletsIds: string[],
  tokenTypeIds: string[][],
  tokenIds: string[][],
  tokenAmounts: number[][]
): void {
  context('succeeds', function () {
    it('packing multiple pallets', async function () {
      const addresses = [
        [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address],
        [this.contracts.oliveOilBottleToken.address]
      ];
      const tx = await this.contracts.distributor.packBatch(
        palletsIds,
        addresses,
        tokenTypeIds,
        tokenIds,
        tokenAmounts
      );
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
              this.contracts.distributor.address,
              this.contracts.palletToken.address,
              intTokenId,
              tokenAmounts[i][j]
            );
          await expect(tx)
            .to.emit(this.contracts.oliveOilBottleToken, EventsBaseToken.TokenTransferred)
            .withArgs(
              this.contracts.palletToken.address,
              this.contracts.distributor.address,
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
          this.contracts.distributor.address,
          constants.AddressZero,
          this.contracts.distributor.address,
          intPalletsIds,
          palletsAmounts
        );
    });
  });

  context('fails', function () {
    it("if packing a pallet with invalid arrays' lengths", async function () {
      await expect(
        this.contracts.distributor.packBatch(palletsIds, [], tokenTypeIds, tokenIds, tokenAmounts)
      ).to.be.revertedWith(ErrorsDistributorUpgradeable.InvalidArray);
    });

    it("if packing a pallet with invalid arrays' lengths in second dimension", async function () {
      await expect(
        this.contracts.distributor.packBatch(
          palletsIds,
          [[this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address], []],
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        )
      ).to.be.revertedWith(ErrorsDistributorUpgradeable.InvalidArray);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      const addresses = [
        [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address],
        [this.contracts.oliveOilBottleToken.address]
      ];
      await expect(
        this.contracts.distributor
          .connect(this.signers.acc2)
          .packBatch(palletsIds, addresses, tokenTypeIds, tokenIds, tokenAmounts)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
