import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsBaseEscrow, ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from 'hardhat-env/test/shared/events';
import { StatesEscrow } from 'hardhat-env/test/shared/states';

export default function shouldBehaveLikeCloseEscrow(
  escrowIds: number[],
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[],
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('closing the escrow, transfering a token or tokens to the buyer and ether to the seller', async function () {
      const price = BigNumber.from(tokenPrice);
      const tx = await this.contracts.oliveGrower.closeEscrow(escrowIds[0]);
      const tx2 = await this.contracts.oliveGrower.closeEscrow(escrowIds[1]);
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts.olivesToken.bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.Closed)
        .withArgs(
          this.contracts.oliveGrower.address,
          this.signers.acc2.address,
          this.contracts.oliveGrower.address,
          escrowIds[0],
          tokenPrice
        );
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.TokenWithdrawn)
        .withArgs(
          escrowIds[0],
          this.signers.acc2.address,
          this.contracts.olivesToken.address,
          tokenIds[0],
          tokenAmounts[0]
        );
      await expect(tx2)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.TokensWithdrawn)
        .withArgs(escrowIds[1], this.signers.acc2.address, this.contracts.olivesToken.address, tokenIds, tokenAmounts);
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.EtherWithdrawn)
        .withArgs(escrowIds[0], this.contracts.oliveGrower.address, price);
      await expect(tx)
        .to.emit(this.contracts.olivesToken, EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.agriculturalEscrow.address,
          this.signers.acc2.address,
          ids[0],
          tokenAmounts[0]
        );
      await expect(tx)
        .to.emit(this.contracts.olivesToken, EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.agriculturalEscrow.address,
          this.signers.acc2.address,
          tokenTypeIds[0],
          tokenIds[0],
          tokenAmounts[0]
        );
      await expect(tx2)
        .to.emit(this.contracts.olivesToken, EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.agriculturalEscrow.address,
          this.signers.acc2.address,
          ids,
          tokenAmounts
        );
      await expect(tx2)
        .to.emit(this.contracts.olivesToken, EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.agriculturalEscrow.address,
          this.signers.acc2.address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
    });

    it('setting state of the contract to Closed', async function () {
      await this.contracts.oliveGrower.closeEscrow(escrowIds[0]);
      const state = await this.contracts.agriculturalEscrow.state(escrowIds[0]);
      expect(state).to.be.equal(StatesEscrow.Closed);
    });
  });

  context('fails', function () {
    it('if state is not EtherDeposited', async function () {
      await this.contracts.oliveGrower.closeEscrow(escrowIds[0]);
      await expect(this.contracts.oliveGrower.closeEscrow(escrowIds[0])).to.be.revertedWith(
        ErrorsBaseEscrow.InvalidState
      );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await this.contracts.oliveGrower.closeEscrow(escrowIds[0]);
      await expect(this.contracts.oliveGrower.connect(this.signers.acc2).closeEscrow(escrowIds[0])).to.be.revertedWith(
        ErrorsOwnable.InvalidCaller
      );
    });
  });
}
