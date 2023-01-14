import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsAgriculturalEscrowUpgradeable, ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from 'hardhat-env/test/shared/events';
import { IndependentTokenUpgradeableContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeDepositBatch(
  tokenContract: IndependentTokenUpgradeableContract,
  escrowId: number,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[]
): void {
  context('succeeds', function () {
    it('depositing multiple tokens to the escrow', async function () {
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      const tx = await this.contracts.agriculturalEscrow.depositBatch(
        this.contracts[tokenContract].address,
        tokenTypeIds,
        tokenIds,
        tokenAmounts,
        this.signers.deployer.address
      );
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.BatchDeposited)
        .withArgs(
          this.signers.deployer.address,
          this.signers.deployer.address,
          escrowId,
          this.contracts[tokenContract].address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.signers.deployer.address,
          this.contracts.agriculturalEscrow.address,
          ids,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts.agriculturalEscrow.address,
          this.signers.deployer.address,
          this.contracts.agriculturalEscrow.address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
    });
  });

  context('fails', function () {
    it('if either tokenAddress or sellerWallet are the zero address', async function () {
      await expect(
        this.contracts.agriculturalEscrow.depositBatch(
          constants.AddressZero,
          tokenTypeIds,
          tokenIds,
          tokenAmounts,
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsAgriculturalEscrowUpgradeable.InvalidAddress);
      await expect(
        this.contracts.agriculturalEscrow.depositBatch(
          this.contracts[tokenContract].address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts,
          constants.AddressZero
        )
      ).to.be.revertedWith(ErrorsAgriculturalEscrowUpgradeable.InvalidAddress);
    });

    it('if ids and amounts array lengths differ', async function () {
      await expect(
        this.contracts.agriculturalEscrow.depositBatch(
          this.contracts[tokenContract].address,
          tokenTypeIds,
          tokenIds,
          [],
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsAgriculturalEscrowUpgradeable.InvalidArray);
    });

    it('if the same batch is deposited twice in the same escrow', async function () {
      await expect(
        this.contracts.agriculturalEscrow.depositBatch(
          this.contracts[tokenContract].address,
          [tokenTypeIds[0], tokenTypeIds[0]],
          [tokenIds[0], tokenIds[0]],
          [tokenAmounts[0], tokenAmounts[0]],
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsAgriculturalEscrowUpgradeable.InvalidArray);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.agriculturalEscrow
          .connect(this.signers.acc2)
          .depositBatch(
            this.contracts[tokenContract].address,
            tokenTypeIds,
            tokenIds,
            tokenAmounts,
            this.signers.acc2.address
          )
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
