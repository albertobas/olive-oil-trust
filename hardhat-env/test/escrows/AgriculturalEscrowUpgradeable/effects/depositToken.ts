import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsAgriculturalEscrowUpgradeable, ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from 'hardhat-env/test/shared/events';
import { IndependentTokenUpgradeableContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeDepositToken(
  tokenContract: IndependentTokenUpgradeableContract,
  escrowId: number,
  tokenTypeId: string,
  tokenId: string,
  tokenAmount: number
): void {
  context('succeeds', function () {
    it('depositing a token to the escrow', async function () {
      const id = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeId, tokenId);
      const tx = await this.contracts.agriculturalEscrow.depositToken(
        this.contracts[tokenContract].address,
        tokenTypeId,
        tokenId,
        tokenAmount,
        this.signers.deployer.address
      );
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.TokenDeposited)
        .withArgs(
          this.signers.deployer.address,
          this.signers.deployer.address,
          escrowId,
          this.contracts[tokenContract].address,
          tokenTypeId,
          tokenId,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.signers.deployer.address,
          this.contracts.agriculturalEscrow.address,
          id,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.signers.deployer.address,
          this.contracts.agriculturalEscrow.address,
          tokenTypeId,
          tokenId,
          tokenAmount
        );
    });
  });

  context('fails', function () {
    it('if either tokenAddress or sellerWallet are the zero address', async function () {
      await expect(
        this.contracts.agriculturalEscrow.depositToken(
          constants.AddressZero,
          tokenTypeId,
          tokenId,
          tokenAmount,
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsAgriculturalEscrowUpgradeable.InvalidAddress);
      await expect(
        this.contracts.agriculturalEscrow.depositToken(
          this.contracts[tokenContract].address,
          tokenTypeId,
          tokenId,
          tokenAmount,
          constants.AddressZero
        )
      ).to.be.revertedWith(ErrorsAgriculturalEscrowUpgradeable.InvalidAddress);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.agriculturalEscrow
          .connect(this.signers.acc2)
          .depositToken(
            this.contracts[tokenContract].address,
            tokenTypeId,
            tokenId,
            tokenAmount,
            this.signers.acc2.address
          )
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
