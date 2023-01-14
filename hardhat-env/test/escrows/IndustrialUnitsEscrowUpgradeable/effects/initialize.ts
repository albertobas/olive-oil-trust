import { expect } from 'chai';
import { ErrorsInitializable } from 'hardhat-env/test/shared/errors';

export default function shouldBehaveLikeInitialize(): void {
  context('succeeds', function () {
    it('initializing', async function () {
      expect(await this.contracts.industrialUnitsEscrow.owner()).to.be.equal(this.signers.deployer.address);
    });
  });

  context('modifiers', function () {
    it('initializer', async function () {
      await expect(this.contracts.industrialUnitsEscrow.initialize()).to.be.revertedWith(
        ErrorsInitializable.AlreadyInitialized
      );
    });
  });
}
