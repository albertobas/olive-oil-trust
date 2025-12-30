import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsOwnable } from '@test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from '@test/shared/events';

export default function shouldBehaveLikeDepositBatch(
  escrowId: number,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[]
): void {
  context('succeeds', function () {
    it('depositing multiple tokens to the escrow', async function () {
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts.olivesToken.bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      const tx = await this.contracts.oliveGrower.depositBatch(
        tokenTypeIds,
        tokenIds,
        tokenAmounts,
        this.signers.deployer.address
      );
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.BatchDeposited)
        .withArgs(
          this.contracts.oliveGrower.address,
          this.signers.deployer.address,
          escrowId,
          this.contracts.olivesToken.address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts.olivesToken, EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.oliveGrower.address,
          this.contracts.agriculturalEscrow.address,
          ids,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts.olivesToken, EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.oliveGrower.address,
          this.contracts.agriculturalEscrow.address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.oliveGrower
          .connect(this.signers.acc2)
          .depositBatch(tokenTypeIds, tokenIds, tokenAmounts, this.signers.acc2.address)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
