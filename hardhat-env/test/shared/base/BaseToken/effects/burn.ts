import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsBaseToken } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155 } from 'hardhat-env/test/shared/events';
import { CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeBurn(
  contract: CreationTokenContract,
  tokenTypeId: string,
  tokenId: string,
  tokenUnitsToBurn: number
): void {
  context('succeeds', function () {
    it('burning tokens', async function () {
      const tx = await this.contracts[contract].burn(
        this.signers.deployer.address,
        tokenTypeId,
        tokenId,
        tokenUnitsToBurn
      );
      const id = await this.contracts[contract].bytesToIntTokenId(tokenTypeId, tokenId);
      await expect(tx)
        .to.emit(this.contracts[contract], EventsERC1155.TransferSingle)
        .withArgs(
          this.signers.deployer.address,
          this.signers.deployer.address,
          constants.AddressZero,
          id,
          tokenUnitsToBurn
        );
      await expect(tx)
        .to.emit(this.contracts[contract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.signers.deployer.address,
          this.signers.deployer.address,
          constants.AddressZero,
          tokenTypeId,
          tokenId,
          tokenUnitsToBurn
        );
    });
  });

  context('fails', function () {
    it('if caller is not the tokens owner nor approved', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .burn(this.signers.deployer.address, tokenTypeId, tokenId, tokenUnitsToBurn)
      ).to.be.revertedWith(ErrorsBaseToken.InvalidCaller);
    });
  });
}
