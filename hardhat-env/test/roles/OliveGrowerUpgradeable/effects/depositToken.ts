import { expect } from 'chai';
import { ErrorsOwnable } from '@test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from '@test/shared/events';

export default function shouldBehaveLikeDepositToken(
  escrowId: number,
  tokenTypeId: string,
  tokenId: string,
  tokenAmount: number
): void {
  context('succeeds', function () {
    it('depositing a token to the escrow', async function () {
      const tx = await this.contracts.oliveGrower.depositToken(
        tokenTypeId,
        tokenId,
        tokenAmount,
        this.signers.deployer.address
      );
      const id = await this.contracts.olivesToken.bytesToIntTokenId(tokenTypeId, tokenId);
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.TokenDeposited)
        .withArgs(
          this.contracts.oliveGrower.address,
          this.signers.deployer.address,
          escrowId,
          this.contracts.olivesToken.address,
          tokenTypeId,
          tokenId,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts.olivesToken, EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.oliveGrower.address,
          this.contracts.agriculturalEscrow.address,
          id,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts.olivesToken, EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.contracts.oliveGrower.address,
          this.contracts.agriculturalEscrow.address,
          tokenTypeId,
          tokenId,
          tokenAmount
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.oliveGrower
          .connect(this.signers.acc2)
          .depositToken(tokenTypeId, tokenId, tokenAmount, this.signers.acc2.address)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
