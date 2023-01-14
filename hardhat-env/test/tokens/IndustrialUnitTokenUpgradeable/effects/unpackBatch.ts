import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsIndustrialUnitTokenUpgradeable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsIndustrialUnitToken } from 'hardhat-env/test/shared/events';
import { bytes32Data } from 'hardhat-env/test/shared/constants';

export default function shouldBehaveLikeUnpackBatch(
  palletsIds: string[],
  tokenTypeIds: string[][],
  tokenIds: string[][],
  tokenAmounts: number[][]
): void {
  context('succeeds', function () {
    it('unpacking multiple pallets', async function () {
      const tx = await this.contracts.palletToken.unpackBatch(this.signers.deployer.address, palletsIds);
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
              this.signers.deployer.address,
              intTokenId,
              tokenAmounts[i][j]
            );
          await expect(tx)
            .to.emit(this.contracts.oliveOilBottleToken, EventsBaseToken.TokenTransferred)
            .withArgs(
              this.contracts.palletToken.address,
              this.contracts.palletToken.address,
              this.signers.deployer.address,
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
        .withArgs(this.signers.deployer.address, palletsIds);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferBatch)
        .withArgs(
          this.signers.deployer.address,
          this.signers.deployer.address,
          constants.AddressZero,
          intPalletsIds,
          palletsAmounts
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchTransferred)
        .withArgs(
          this.signers.deployer.address,
          this.signers.deployer.address,
          constants.AddressZero,
          palletsIds,
          palletsAmounts
        );
    });
  });

  context('fails', function () {
    it('if caller is not the tokens owner', async function () {
      await expect(this.contracts.palletToken.unpackBatch(this.signers.acc2.address, palletsIds)).to.be.revertedWith(
        ErrorsIndustrialUnitTokenUpgradeable.InvalidCaller
      );
    });

    it('if unpacking multiple pallets but failing to have the ownership of at least one of them', async function () {
      const id_ = await this.contracts.palletToken.bytesToIntId(palletsIds[0]);
      const balanceId = await this.contracts.palletToken.balanceOf(this.signers.deployer.address, id_);
      await this.contracts.palletToken.safeTransferFrom(
        this.signers.deployer.address,
        this.signers.acc2.address,
        id_,
        balanceId,
        bytes32Data
      );
      await expect(
        this.contracts.palletToken.unpackBatch(this.signers.deployer.address, palletsIds)
      ).to.be.revertedWith(ErrorsIndustrialUnitTokenUpgradeable.InvalidBalance);
    });
  });
}
