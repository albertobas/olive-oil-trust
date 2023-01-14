import { expect } from 'chai';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from 'hardhat-env/test/shared/events';
import { CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeDepositToken(
  tokenContract: CreationTokenContract,
  escrowId: number,
  tokenTypeId: string,
  tokenId: string,
  tokenAmount: number,
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('depositing a token to the escrow', async function () {
      const tx = await this.contracts.retailer.depositToken(
        this.contracts[tokenContract].address,
        tokenTypeId,
        tokenId,
        tokenAmount,
        tokenPrice,
        this.signers.deployer.address
      );
      const tx2 = await this.contracts.retailer.depositToken(
        this.contracts[tokenContract].address,
        tokenTypeId,
        tokenId,
        tokenAmount,
        tokenPrice,
        this.signers.deployer.address
      );
      const id = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeId, tokenId);
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.ApprovalForAll)
        .withArgs(this.contracts.retailer.address, this.contracts.commercialUnitsEscrow.address, true);
      await expect(tx2).to.not.emit(this.contracts[tokenContract], EventsERC1155.ApprovalForAll);
      await expect(tx)
        .to.emit(this.contracts.commercialUnitsEscrow, EventsEscrow.TokenDeposited)
        .withArgs(
          this.contracts.retailer.address,
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
          this.contracts.retailer.address,
          this.contracts.commercialUnitsEscrow.address,
          id,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.contracts.retailer.address,
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
        this.contracts.retailer
          .connect(this.signers.acc2)
          .depositToken(
            this.contracts[tokenContract].address,
            tokenTypeId,
            tokenId,
            tokenAmount,
            tokenPrice,
            this.signers.deployer.address
          )
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
