import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155 } from 'hardhat-env/test/shared/events';
import { IndependentCreatorContract, IndependentTokenUpgradeableContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeMint(
  contract: IndependentCreatorContract,
  tokenContract: IndependentTokenUpgradeableContract,
  tokenTypeId: string,
  tokenId: string,
  tokenAmount: number
): void {
  context('succeeds', function () {
    it('minting an independent token', async function () {
      const tx = await this.contracts[contract].connect(this.signers.deployer).mint(tokenTypeId, tokenId, tokenAmount);
      const id = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeId, tokenId);
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts[contract].address,
          constants.AddressZero,
          this.contracts[contract].address,
          id,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts[contract].address,
          constants.AddressZero,
          this.contracts[contract].address,
          tokenTypeId,
          tokenId,
          tokenAmount
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract].connect(this.signers.acc2).mint(tokenTypeId, tokenId, tokenAmount)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
