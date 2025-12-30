import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsBaseToken, ErrorsDependentTokenUpgradeable, ErrorsOwnable } from '@test/shared/errors';
import { DependentTokenUpgradeableContract } from '@test/shared/types';
import { EventsBaseToken, EventsERC1155 } from '@test/shared/events';

export default function shouldBehaveLikeMint(
  contract: DependentTokenUpgradeableContract,
  tokenTypeId: string,
  tokenId: string,
  tokenUnitsToMint: number,
  instructedTokenTypeIds: string[],
  instructedTokenAmounts: BigNumber[]
): void {
  context('succeeds', function () {
    it('minting a token', async function () {
      await this.contracts[contract].setTokenTypeInstructions(
        tokenTypeId,
        this.token.addresses,
        instructedTokenTypeIds,
        instructedTokenAmounts
      );
      const tx = await this.contracts[contract].mint(
        this.signers.deployer.address,
        tokenTypeId,
        tokenId,
        tokenUnitsToMint
      );
      const id = await this.contracts[contract].bytesToIntTokenId(tokenTypeId, tokenId);
      await expect(tx)
        .to.emit(this.contracts[contract], EventsERC1155.TransferSingle)
        .withArgs(
          this.signers.deployer.address,
          constants.AddressZero,
          this.signers.deployer.address,
          id,
          tokenUnitsToMint
        );
      await expect(tx)
        .to.emit(this.contracts[contract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.signers.deployer.address,
          constants.AddressZero,
          this.signers.deployer.address,
          tokenTypeId,
          tokenId,
          tokenUnitsToMint
        );
    });
  });

  context('fails', function () {
    it('if no addresses nor amounts have been instructed to the contract for this token id', async function () {
      await expect(
        this.contracts[contract].mint(this.signers.deployer.address, tokenTypeId, tokenId, tokenUnitsToMint)
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.NonExistentTokenTypeId);
    });

    it('if the given token id already exists', async function () {
      await this.contracts[contract].setTokenTypeInstructions(
        tokenTypeId,
        this.token.addresses,
        instructedTokenTypeIds,
        instructedTokenAmounts
      );
      await this.contracts[contract].mint(this.signers.deployer.address, tokenTypeId, tokenId, tokenUnitsToMint);
      await expect(
        this.contracts[contract].mint(this.signers.deployer.address, tokenTypeId, tokenId, tokenUnitsToMint)
      ).to.be.revertedWith(ErrorsBaseToken.DuplicatedTokenId);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .mint(this.signers.deployer.address, tokenTypeId, tokenId, tokenUnitsToMint)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
