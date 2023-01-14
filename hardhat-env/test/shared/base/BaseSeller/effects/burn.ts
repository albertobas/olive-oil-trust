import { expect } from 'chai';
import { constants } from 'ethers';
import { EventsBaseToken, EventsERC1155 } from 'hardhat-env/test/shared/events';
import { BaseSellerContract, CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeBurn(
  contract: BaseSellerContract,
  tokenContract: CreationTokenContract,
  tokenTypeId: string,
  tokenId: string,
  tokenAmount: number
): void {
  context('succeeds', function () {
    it('burning tokens', async function () {
      const tx = await this.contracts[contract].burn(
        this.contracts[tokenContract].address,
        tokenTypeId,
        tokenId,
        tokenAmount
      );
      const intId = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeId, tokenId);
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts[contract].address,
          this.contracts[contract].address,
          constants.AddressZero,
          intId,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts[contract].address,
          this.contracts[contract].address,
          constants.AddressZero,
          tokenTypeId,
          tokenId,
          tokenAmount
        );
    });
  });
}
