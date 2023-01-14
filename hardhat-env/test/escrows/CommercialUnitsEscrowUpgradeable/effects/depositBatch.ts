import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsCommercialUnitsEscrowUpgradeable, ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from 'hardhat-env/test/shared/events';
import { DependentTokenUpgradeableContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeDepositBatch(
  tokenContract: DependentTokenUpgradeableContract,
  escrowId: number,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[],
  batchPrice: string
): void {
  context('succeeds', function () {
    it('depositing multiple tokens to the escrow', async function () {
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      await this.contracts[tokenContract].setApprovalForAll(this.contracts.commercialUnitsEscrow.address, true);
      const tx = await this.contracts.commercialUnitsEscrow.depositBatch(
        this.contracts[tokenContract].address,
        tokenTypeIds,
        tokenIds,
        tokenAmounts,
        batchPrice,
        this.signers.deployer.address
      );
      await expect(tx)
        .to.emit(this.contracts.commercialUnitsEscrow, EventsEscrow.BatchDeposited)
        .withArgs(
          this.signers.deployer.address,
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
          this.signers.deployer.address,
          this.contracts.commercialUnitsEscrow.address,
          ids,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.signers.deployer.address,
          this.contracts.commercialUnitsEscrow.address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
    });
  });

  context('fails', function () {
    it('if either tokenAddress or sellerWallet are the zero address', async function () {
      await expect(
        this.contracts.commercialUnitsEscrow.depositBatch(
          constants.AddressZero,
          tokenTypeIds,
          tokenIds,
          tokenAmounts,
          batchPrice,
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsCommercialUnitsEscrowUpgradeable.InvalidAddress);
      await expect(
        this.contracts.commercialUnitsEscrow.depositBatch(
          this.contracts[tokenContract].address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts,
          batchPrice,
          constants.AddressZero
        )
      ).to.be.revertedWith(ErrorsCommercialUnitsEscrowUpgradeable.InvalidAddress);
    });

    it('if ids and amounts array lengths differ', async function () {
      await expect(
        this.contracts.commercialUnitsEscrow.depositBatch(
          this.contracts[tokenContract].address,
          tokenTypeIds,
          tokenIds,
          [],
          batchPrice,
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsCommercialUnitsEscrowUpgradeable.InvalidArray);
    });

    it('if the same batch is deposited twice in the same escrow', async function () {
      await expect(
        this.contracts.commercialUnitsEscrow.depositBatch(
          this.contracts[tokenContract].address,
          [tokenTypeIds[0], tokenTypeIds[0]],
          [tokenIds[0], tokenIds[0]],
          [tokenAmounts[0], tokenAmounts[0]],
          batchPrice,
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsCommercialUnitsEscrowUpgradeable.InvalidArray);
    });

    it('if setting batch price to zero', async function () {
      await expect(
        this.contracts.commercialUnitsEscrow.depositBatch(
          this.contracts[tokenContract].address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts,
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
          .depositBatch(
            this.contracts[tokenContract].address,
            tokenTypeIds,
            tokenIds,
            tokenAmounts,
            batchPrice,
            this.signers.deployer.address
          )
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
