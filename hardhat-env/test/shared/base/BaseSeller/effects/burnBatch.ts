import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { EventsBaseToken, EventsERC1155 } from 'hardhat-env/test/shared/events';
import { BaseSellerContract, CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeBurnBatch(
  contract: BaseSellerContract,
  tokenContract: CreationTokenContract,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[]
): void {
  context('succeeds', function () {
    it('burning multiple tokens', async function () {
      const tx = await this.contracts[contract].burnBatch(
        this.contracts[tokenContract].address,
        tokenTypeIds,
        tokenIds,
        tokenAmounts
      );
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts[contract].address,
          this.contracts[contract].address,
          constants.AddressZero,
          ids,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts[contract].address,
          this.contracts[contract].address,
          constants.AddressZero,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
    });
  });
}
