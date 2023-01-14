import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsIndependentTokenUpgradeable, ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { IndependentTokenUpgradeableContract } from 'hardhat-env/test/shared/types';
import { EventsBaseToken, EventsERC1155 } from 'hardhat-env/test/shared/events';

export default function shouldBehaveLikeMintBatch(
  contract: IndependentTokenUpgradeableContract,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenUnitsToMint: number[]
): void {
  context('succeeds', function () {
    it('minting multiple independent tokens', async function () {
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
      ).to.be.revertedWith(ErrorsIndependentTokenUpgradeable.InvalidArray);
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
