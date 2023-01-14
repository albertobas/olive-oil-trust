import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsOwnable, ErrorsIndustrialUnitTokenUpgradeable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsIndustrialUnitToken } from 'hardhat-env/test/shared/events';
import { bytes32Data } from 'hardhat-env/test/shared/constants';

export default function shouldBehaveLikePackBatch(
  palletsIds: string[],
  tokenTypeIds: string[][],
  tokenIds: string[][],
  tokenAmounts: number[][]
): void {
  context('succeeds', function () {
    it('packing multiple pallets', async function () {
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      const addresses = [
        [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address],
        [this.contracts.oliveOilBottleToken.address]
      ];
      const tx = await this.contracts.palletToken.packBatch(
        this.signers.deployer.address,
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
              this.signers.deployer.address,
              this.contracts.palletToken.address,
              intTokenId,
              tokenAmounts[i][j]
            );
          await expect(tx)
            .to.emit(this.contracts.oliveOilBottleToken, EventsBaseToken.TokenTransferred)
            .withArgs(
              this.contracts.palletToken.address,
              this.signers.deployer.address,
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
          this.signers.deployer.address,
          constants.AddressZero,
          this.signers.deployer.address,
          intPalletsIds,
          palletsAmounts
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchTransferred)
        .withArgs(
          this.signers.deployer.address,
          constants.AddressZero,
          this.signers.deployer.address,
          palletsIds,
          palletsAmounts
        );
    });
  });

  context('fails', function () {
    it("if packing a pallet with invalid arrays' lengths", async function () {
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      await expect(
        this.contracts.palletToken.packBatch(
          this.signers.deployer.address,
          palletsIds,
          [[this.contracts.oliveOilBottleToken.address]],
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitTokenUpgradeable.InvalidArray);
    });

    it("if packing a pallet with invalid arrays' lengths in second dimension", async function () {
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      await expect(
        this.contracts.palletToken.packBatch(
          this.signers.deployer.address,
          palletsIds,
          [[this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address], []],
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitTokenUpgradeable.InvalidArray);
    });

    it('if packing multiple pallets with at least one of them with an id that already exists', async function () {
      const addresses = [
        [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address],
        [this.contracts.oliveOilBottleToken.address]
      ];
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      await this.contracts.palletToken.packBatch(
        this.signers.deployer.address,
        palletsIds,
        addresses,
        tokenTypeIds,
        tokenIds,
        tokenAmounts
      );
      await expect(
        this.contracts.palletToken.packBatch(
          this.signers.deployer.address,
          palletsIds,
          addresses,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitTokenUpgradeable.DuplicatedId);
    });

    it('if packing a pallet but failing to have the required items', async function () {
      const id_ = await this.contracts.oliveOilBottleToken.bytesToIntTokenId(tokenTypeIds[0][0], tokenIds[0][0]);
      const balanceId0 = await this.contracts.oliveOilBottleToken.balanceOf(this.signers.deployer.address, id_);
      await this.contracts.oliveOilBottleToken.safeTransferFrom(
        this.signers.deployer.address,
        this.signers.acc2.address,
        id_,
        balanceId0,
        bytes32Data
      );
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      await expect(
        this.contracts.palletToken.packBatch(
          this.signers.deployer.address,
          palletsIds,
          [
            [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address],
            [this.contracts.oliveOilBottleToken.address]
          ],
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitTokenUpgradeable.InvalidBalance);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      const addresses = [
        [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address],
        [this.contracts.oliveOilBottleToken.address]
      ];
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      await expect(
        this.contracts.palletToken
          .connect(this.signers.acc2)
          .packBatch(this.signers.deployer.address, palletsIds, addresses, tokenTypeIds, tokenIds, tokenAmounts)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
