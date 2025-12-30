import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsBaseToken, ErrorsDependentTokenUpgradeable, ErrorsOwnable } from '@test/shared/errors';
import { DependentTokenUpgradeableContract } from '@test/shared/types';
import { EventsBaseToken, EventsERC1155 } from '@test/shared/events';

export default function shouldBehaveLikeMintBatch(
  contract: DependentTokenUpgradeableContract,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenUnitsToMint: number[],
  instructedTokenTypeIds: string[][],
  instructedTokenAmounts: BigNumber[][]
): void {
  context('succeeds', function () {
    it('minting multiple dependent tokens', async function () {
      await this.contracts[contract].setTokenTypesInstructions(
        tokenTypeIds,
        [[this.contracts.olivesToken.address], [this.contracts.olivesToken.address]],
        instructedTokenTypeIds,
        instructedTokenAmounts
      );
      const tx = await this.contracts[contract].mintBatch(
        this.signers.deployer.address,
        tokenTypeIds,
        tokenIds,
        tokenUnitsToMint
      );
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts[contract].bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      await expect(tx)
        .to.emit(this.contracts[contract], EventsERC1155.TransferBatch)
        .withArgs(
          this.signers.deployer.address,
          constants.AddressZero,
          this.signers.deployer.address,
          ids,
          tokenUnitsToMint
        );
      await expect(tx)
        .to.emit(this.contracts[contract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.signers.deployer.address,
          constants.AddressZero,
          this.signers.deployer.address,
          tokenTypeIds,
          tokenIds,
          tokenUnitsToMint
        );
    });
  });

  context('fails', function () {
    it("if length of any of the arrays is zero or different to the other arrays' lengths", async function () {
      await expect(
        this.contracts[contract].mintBatch(this.signers.deployer.address, tokenTypeIds, [], tokenUnitsToMint)
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidArray);
    });

    it('if no addresses nor amounts have been instructed to the contract for at least one of the tokens ids', async function () {
      await this.contracts[contract].setTokenTypeInstructions(
        tokenTypeIds[0],
        [this.contracts.olivesToken.address],
        instructedTokenTypeIds[0],
        instructedTokenAmounts[0]
      );
      await expect(
        this.contracts[contract].mintBatch(this.signers.deployer.address, tokenTypeIds, tokenIds, tokenUnitsToMint)
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.NonExistentTokenTypeId);
    });

    it('if at least one of the tokens ids already exists', async function () {
      await this.contracts[contract].setTokenTypesInstructions(
        tokenTypeIds,
        [[this.contracts.olivesToken.address], [this.contracts.olivesToken.address]],
        instructedTokenTypeIds,
        instructedTokenAmounts
      );
      await expect(
        this.contracts[contract].mintBatch(
          this.signers.deployer.address,
          [tokenTypeIds[0], tokenTypeIds[0]],
          [tokenIds[0], tokenIds[0]],
          tokenUnitsToMint
        )
      ).to.be.revertedWith(ErrorsBaseToken.DuplicatedTokenId);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .mintBatch(this.signers.deployer.address, tokenTypeIds, tokenIds, tokenUnitsToMint)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
