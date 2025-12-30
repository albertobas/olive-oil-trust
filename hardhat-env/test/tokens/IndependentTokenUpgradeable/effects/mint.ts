import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsOwnable } from '@test/shared/errors';
import { IndependentTokenUpgradeableContract } from '@test/shared/types';
import { EventsBaseToken, EventsERC1155 } from '@test/shared/events';

export default function shouldBehaveLikeMint(
  contract: IndependentTokenUpgradeableContract,
  tokenTypeId: string,
  tokenId: string,
  tokenAmount: number
): void {
  context('succeeds', function () {
    it('minting a token', async function () {
      const tx = await this.contracts[contract].mint(this.signers.deployer.address, tokenTypeId, tokenId, tokenAmount);
      const id = await this.contracts[contract].bytesToIntTokenId(tokenTypeId, tokenId);
      await expect(tx)
        .to.emit(this.contracts[contract], EventsERC1155.TransferSingle)
        .withArgs(this.signers.deployer.address, constants.AddressZero, this.signers.deployer.address, id, tokenAmount);
      await expect(tx)
        .to.emit(this.contracts[contract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.signers.deployer.address,
          constants.AddressZero,
          this.signers.deployer.address,
          tokenTypeId,
          tokenId,
          tokenAmount
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .mint(this.signers.deployer.address, tokenTypeId, tokenId, tokenAmount)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
