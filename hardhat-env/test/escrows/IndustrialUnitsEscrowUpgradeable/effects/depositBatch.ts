import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsIndustrialUnitsEscrowUpgradeable, ErrorsOwnable } from '@test/shared/errors';
import { EventsERC1155, EventsEscrow, EventsIndustrialUnitToken } from '@test/shared/events';

export default function shouldBehaveLikeDepositBatch(
  escrowId: number,
  tokenIds: string[],
  tokenAmounts: number[],
  batchPrice: string
): void {
  context('succeeds', function () {
    it('depositing multiple tokens to the escrow', async function () {
      const ids = await Promise.all(
        tokenIds.map(async (id) => {
          return await this.contracts.palletToken.bytesToIntId(id);
        })
      );
      await this.contracts.palletToken.setApprovalForAll(this.contracts.industrialUnitsEscrow.address, true);
      const tx = await this.contracts.industrialUnitsEscrow.depositBatch(
        this.contracts.palletToken.address,
        tokenIds,
        batchPrice,
        this.signers.deployer.address
      );
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.BatchDeposited)
        .withArgs(
          this.signers.deployer.address,
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
          this.signers.deployer.address,
          this.contracts.industrialUnitsEscrow.address,
          ids,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchTransferred)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.signers.deployer.address,
          this.contracts.industrialUnitsEscrow.address,
          tokenIds,
          tokenAmounts
        );
    });
  });

  context('fails', function () {
    it('if either tokenAddress or sellerWallet are the zero address', async function () {
      await this.contracts.palletToken.setApprovalForAll(this.contracts.industrialUnitsEscrow.address, true);
      await expect(
        this.contracts.industrialUnitsEscrow.depositBatch(
          constants.AddressZero,
          tokenIds,
          batchPrice,
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitsEscrowUpgradeable.InvalidAddress);
      await expect(
        this.contracts.industrialUnitsEscrow.depositBatch(
          this.contracts.palletToken.address,
          tokenIds,
          batchPrice,
          constants.AddressZero
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitsEscrowUpgradeable.InvalidAddress);
    });

    it('if setting token price to zero', async function () {
      await expect(
        this.contracts.industrialUnitsEscrow.depositBatch(
          this.contracts.palletToken.address,
          tokenIds,
          '0',
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitsEscrowUpgradeable.InvalidPrice);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.industrialUnitsEscrow
          .connect(this.signers.acc2)
          .depositBatch(this.contracts.palletToken.address, tokenIds, batchPrice, this.signers.deployer.address)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
