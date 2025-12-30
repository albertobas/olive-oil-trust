import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsOwnable } from '@test/shared/errors';
import { EventsBaseToken, EventsERC1155 } from '@test/shared/events';
import { IndependentCreatorContract, IndependentTokenUpgradeableContract } from '@test/shared/types';

export default function shouldBehaveLikeMintBatch(
  contract: IndependentCreatorContract,
  tokenContract: IndependentTokenUpgradeableContract,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[]
): void {
  context('succeeds', function () {
    it('minting multiple independent tokens', async function () {
      const tx = await this.contracts[contract]
        .connect(this.signers.deployer)
        .mintBatch(tokenTypeIds, tokenIds, tokenAmounts);
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts[contract].address,
          constants.AddressZero,
          this.contracts[contract].address,
          ids,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts[contract].address,
          constants.AddressZero,
          this.contracts[contract].address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract].connect(this.signers.acc2).mintBatch(tokenTypeIds, tokenIds, tokenAmounts)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
