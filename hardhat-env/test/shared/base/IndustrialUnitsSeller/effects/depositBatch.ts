import { expect } from 'chai';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsERC1155, EventsEscrow, EventsIndustrialUnitToken } from 'hardhat-env/test/shared/events';
import { IndustrialUnitsSellerContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeDepositBatch(
  contract: IndustrialUnitsSellerContract,
  escrowId: number,
  tokenIds: string[],
  tokenAmounts: number[],
  batchPrice: string
): void {
  context('succeeds', function () {
    it('depositing multiple tokens to the escrow', async function () {
      const tx = await this.contracts[contract].depositBatch(tokenIds, batchPrice, this.signers.deployer.address);
      const ids = await Promise.all(
        tokenIds.map(async (id) => {
          return await this.contracts.palletToken.bytesToIntId(id);
        })
      );
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.BatchDeposited)
        .withArgs(
          this.contracts[contract].address,
          this.signers.deployer.address,
          escrowId,
          this.contracts.palletToken.address,
          tokenIds,
          batchPrice
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts[contract].address,
          this.contracts.industrialUnitsEscrow.address,
          ids,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchTransferred)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts[contract].address,
          this.contracts.industrialUnitsEscrow.address,
          tokenIds,
          tokenAmounts
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .depositBatch(tokenIds, batchPrice, this.signers.deployer.address)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
