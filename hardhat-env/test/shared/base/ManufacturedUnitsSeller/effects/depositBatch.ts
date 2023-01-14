import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from 'hardhat-env/test/shared/events';
import { CreationTokenContract, ManufacturedUnitsSellerContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeDepositBatch(
  contract: ManufacturedUnitsSellerContract,
  tokenContract: CreationTokenContract,
  escrowId: number,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[],
  batchPrice: string
): void {
  context('succeeds', function () {
    it('depositing multiple tokens to the escrow', async function () {
      const tx = await this.contracts[contract].depositBatch(
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
        .to.emit(this.contracts.commercialUnitsEscrow, EventsEscrow.BatchDeposited)
        .withArgs(
          this.contracts[contract].address,
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
          this.contracts[contract].address,
          this.contracts.commercialUnitsEscrow.address,
          ids,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.contracts[contract].address,
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
        this.contracts[contract]
          .connect(this.signers.acc2)
          .depositBatch(tokenTypeIds, tokenIds, tokenAmounts, batchPrice, this.signers.deployer.address)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
