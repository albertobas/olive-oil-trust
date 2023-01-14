import { expect } from 'chai';
import { ErrorsInitializable } from 'hardhat-env/test/shared/errors';
import { BaseEscrowContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeInitialize(contract: BaseEscrowContract): void {
  context('succeeds', function () {
    it('initializing', async function () {
      expect(await this.contracts[contract].owner()).to.be.equal(this.signers.deployer.address);
    });
  });

  context('modifiers', function () {
    it('initializer', async function () {
      await expect(this.contracts[contract].initialize()).to.be.revertedWith(ErrorsInitializable.AlreadyInitialized);
    });
  });
}
