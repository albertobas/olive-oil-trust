import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsBaseEscrow, ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from 'hardhat-env/test/shared/events';
import { StatesEscrow } from 'hardhat-env/test/shared/states';

export default function shouldBehaveLikeRevertAfterPayment(
  escrowIds: number[],
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[],
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('reverting after a payment, withdrawing a token or tokens and sending back ether to the buyer candidate', async function () {
      const price = BigNumber.from(tokenPrice);
      const tx = await this.contracts.oliveGrower.revertAfterPayment(escrowIds[0]);
      const tx2 = await this.contracts.oliveGrower.revertAfterPayment(escrowIds[1]);
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts.olivesToken.bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.RevertedAfterPayment)
        .withArgs(this.contracts.oliveGrower.address, this.signers.acc2.address, escrowIds[0], price);
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.TokenWithdrawn)
        .withArgs(
          escrowIds[0],
          this.contracts.oliveGrower.address,
          this.contracts.olivesToken.address,
          tokenIds[0],
          tokenAmounts[0]
        );
      await expect(tx2)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.TokensWithdrawn)
        .withArgs(
          escrowIds[1],
          this.contracts.oliveGrower.address,
          this.contracts.olivesToken.address,
          tokenIds,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.EtherWithdrawn)
        .withArgs(escrowIds[0], this.signers.acc2.address, price);
      await expect(tx)
        .to.emit(this.contracts.olivesToken, EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.agriculturalEscrow.address,
          this.contracts.oliveGrower.address,
          ids[0],
          tokenAmounts[0]
        );
      await expect(tx)
        .to.emit(this.contracts.olivesToken, EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.agriculturalEscrow.address,
          this.contracts.oliveGrower.address,
          tokenTypeIds[0],
          tokenIds[0],
          tokenAmounts[0]
        );
      await expect(tx2)
        .to.emit(this.contracts.olivesToken, EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.agriculturalEscrow.address,
          this.contracts.oliveGrower.address,
          ids,
          tokenAmounts
        );
      await expect(tx2)
        .to.emit(this.contracts.olivesToken, EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.agriculturalEscrow.address,
          this.contracts.oliveGrower.address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
    });

    it('setting state of the contract to RevertedAfterPayment', async function () {
      await this.contracts.oliveGrower.revertAfterPayment(escrowIds[0]);
      const state = await this.contracts.agriculturalEscrow.state(escrowIds[0]);
      expect(state).to.be.equal(StatesEscrow.RevertedAfterPayment);
    });
  });

  context('fails', function () {
    it('if state is not EtherDeposited', async function () {
      await this.contracts.oliveGrower.revertAfterPayment(escrowIds[0]);
      await expect(this.contracts.oliveGrower.revertAfterPayment(escrowIds[0])).to.be.revertedWith(
        ErrorsBaseEscrow.InvalidState
      );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await this.contracts.oliveGrower.revertAfterPayment(escrowIds[0]);
      await expect(
        this.contracts.oliveGrower.connect(this.signers.acc2).revertAfterPayment(escrowIds[0])
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
