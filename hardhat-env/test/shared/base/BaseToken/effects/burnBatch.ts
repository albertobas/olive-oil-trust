import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsBaseToken } from '@test/shared/errors';
import { EventsBaseToken, EventsERC1155 } from '@test/shared/events';
import { CreationTokenContract } from '@test/shared/types';

export default function shouldBehaveLikeBurnBatch(
  contract: CreationTokenContract,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenUnitsToBurn: number[]
): void {
  context('succeeds', function () {
    it('burning multiple tokens', async function () {
      const tx = await this.contracts[contract].burnBatch(
        this.signers.deployer.address,
        tokenTypeIds,
        tokenIds,
        tokenUnitsToBurn
      );
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts[contract].bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      await expect(tx)
        .to.emit(this.contracts[contract], EventsERC1155.TransferBatch)
        .withArgs(
          this.signers.deployer.address,
          this.signers.deployer.address,
          constants.AddressZero,
          ids,
          tokenUnitsToBurn
        );
      await expect(tx)
        .to.emit(this.contracts[contract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.signers.deployer.address,
          this.signers.deployer.address,
          constants.AddressZero,
          tokenTypeIds,
          tokenIds,
          tokenUnitsToBurn
        );
    });
  });

  context('fails', function () {
    it('if caller is not the tokens owner nor approved', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .burnBatch(this.signers.deployer.address, tokenTypeIds, tokenIds, tokenUnitsToBurn)
      ).to.be.revertedWith(ErrorsBaseToken.InvalidCaller);
    });
  });
}
