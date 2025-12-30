import { expect } from 'chai';
import { ErrorsOwnable } from '@test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from '@test/shared/events';
import { CreationTokenContract, ManufacturedUnitsSellerContract } from '@test/shared/types';

export default function shouldBehaveLikeDepositToken(
  contract: ManufacturedUnitsSellerContract,
  tokenContract: CreationTokenContract,
  escrowId: number,
  tokenTypeId: string,
  tokenId: string,
  tokenAmount: number,
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('depositing a token to the escrow', async function () {
      const tx = await this.contracts[contract].depositToken(
        tokenTypeId,
        tokenId,
        tokenAmount,
        tokenPrice,
        this.signers.deployer.address
      );
      const id = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeId, tokenId);
      await expect(tx)
        .to.emit(this.contracts.commercialUnitsEscrow, EventsEscrow.TokenDeposited)
        .withArgs(
          this.contracts[contract].address,
          this.signers.deployer.address,
          escrowId,
          this.contracts[tokenContract].address,
          tokenTypeId,
          tokenId,
          tokenAmount,
          tokenPrice
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.contracts[contract].address,
          this.contracts.commercialUnitsEscrow.address,
          id,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.contracts[contract].address,
          this.contracts.commercialUnitsEscrow.address,
          tokenTypeId,
          tokenId,
          tokenAmount
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .depositToken(tokenTypeId, tokenId, tokenAmount, tokenPrice, this.signers.deployer.address)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
