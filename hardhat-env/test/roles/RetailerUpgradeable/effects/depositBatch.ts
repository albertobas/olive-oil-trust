import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from 'hardhat-env/test/shared/events';
import { CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeDepositBatch(
  tokenContract: CreationTokenContract,
  escrowId: number,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[],
  batchPrice: string
): void {
  context('succeeds', function () {
    it('depositing multiple tokens to the escrow', async function () {
      const tx = await this.contracts.retailer.depositBatch(
        this.contracts[tokenContract].address,
        tokenTypeIds,
        tokenIds,
        tokenAmounts,
        batchPrice,
        this.signers.deployer.address
      );
      const tx2 = await this.contracts.retailer.depositBatch(
        this.contracts[tokenContract].address,
        tokenTypeIds,
        tokenIds,
        tokenAmounts,
        batchPrice,
        this.signers.deployer.address
      );
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.ApprovalForAll)
        .withArgs(this.contracts.retailer.address, this.contracts.commercialUnitsEscrow.address, true);
      await expect(tx2).to.not.emit(this.contracts[tokenContract], EventsERC1155.ApprovalForAll);
      await expect(tx)
        .to.emit(this.contracts.commercialUnitsEscrow, EventsEscrow.BatchDeposited)
        .withArgs(
          this.contracts.retailer.address,
          this.signers.deployer.address,
          escrowId,
          this.contracts[tokenContract].address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts,
          batchPrice
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.contracts.retailer.address,
          this.contracts.commercialUnitsEscrow.address,
          ids,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.contracts.retailer.address,
          this.contracts.commercialUnitsEscrow.address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.retailer
          .connect(this.signers.acc2)
          .depositBatch(
            this.contracts[tokenContract].address,
            tokenTypeIds,
            tokenIds,
            tokenAmounts,
            batchPrice,
            this.signers.deployer.address
          )
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
