import { expect } from 'chai';
import { ErrorsInitializable } from 'hardhat-env/test/shared/errors';

export default function shouldBehaveLikeInitialize(baseUri: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      expect(await this.contracts.certificate.uri()).to.be.equal(baseUri);
      expect(await this.contracts.certificate.owner()).to.be.equal(this.signers.acc2.address);
    });
  });

  context('modifiers', function () {
    it('initializer', async function () {
      await expect(this.contracts.certificate.connect(this.signers.acc2).initialize(baseUri)).to.be.revertedWith(
        ErrorsInitializable.AlreadyInitialized
      );
    });
  });
}
