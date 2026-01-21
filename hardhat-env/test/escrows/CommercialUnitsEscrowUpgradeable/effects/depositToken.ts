import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsBaseEscrow, ErrorsCommercialUnitsEscrowUpgradeable, ErrorsOwnable } from '@test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from '@test/shared/events';
import { DependentTokenUpgradeableContract } from '@test/shared/types';

export default function shouldBehaveLikeDepositToken(
  tokenContract: DependentTokenUpgradeableContract,
  escrowId: number,
  tokenTypeId: string,
  tokenId: string,
  tokenAmount: number,
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('depositing a token to the escrow', async function () {
      const id = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeId, tokenId);
      await this.contracts[tokenContract].setApprovalForAll(this.contracts.commercialUnitsEscrow.address, true);
      const tx = await this.contracts.commercialUnitsEscrow.depositToken(
        this.contracts[tokenContract].address,
        tokenTypeId,
        tokenId,
        tokenAmount,
        tokenPrice,
        this.signers.deployer.address
      );
      await expect(tx)
        .to.emit(this.contracts.commercialUnitsEscrow, EventsEscrow.TokenDeposited)
        .withArgs(
          this.signers.deployer.address,
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
          this.signers.deployer.address,
          this.contracts.commercialUnitsEscrow.address,
          id,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.signers.deployer.address,
          this.contracts.commercialUnitsEscrow.address,
          tokenTypeId,
          tokenId,
          tokenAmount
        );
    });
  });

  context('fails', function () {
    it('if either tokenAddress or sellerWallet are the zero address', async function () {
      await expect(
        this.contracts.commercialUnitsEscrow.depositToken(
          constants.AddressZero,
          tokenTypeId,
          tokenId,
          tokenAmount,
          tokenPrice,
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsBaseEscrow.InvalidAddress);
      await expect(
        this.contracts.commercialUnitsEscrow.depositToken(
          this.contracts[tokenContract].address,
          tokenTypeId,
          tokenId,
          tokenAmount,
          tokenPrice,
          constants.AddressZero
        )
      ).to.be.revertedWith(ErrorsCommercialUnitsEscrowUpgradeable.InvalidAddress);
    });

    it('if setting token price to zero', async function () {
      await expect(
        this.contracts.commercialUnitsEscrow.depositToken(
          this.contracts[tokenContract].address,
          tokenTypeId,
          tokenId,
          tokenAmount,
          '0',
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsCommercialUnitsEscrowUpgradeable.InvalidPrice);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.commercialUnitsEscrow
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
