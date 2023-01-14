import { expect } from 'chai';
import { ErrorsInitializable } from 'hardhat-env/test/shared/errors';

export default function shouldBehaveLikeInitialize(memberName: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      expect(await this.contracts.certifier.name()).to.be.equal(memberName);
      expect(await this.contracts.certifier.owner()).to.be.equal(this.signers.deployer.address);
    });
  });
  context('modifiers', function () {
    it('initializer', async function () {
      await expect(this.contracts.certifier.initialize(this.contracts.certificate.address)).to.be.revertedWith(
        ErrorsInitializable.AlreadyInitialized
      );
    });
  });
}
