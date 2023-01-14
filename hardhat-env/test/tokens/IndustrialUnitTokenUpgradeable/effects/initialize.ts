import { expect } from 'chai';
import { ErrorsInitializable } from 'hardhat-env/test/shared/errors';

export default function shouldBehaveLikeInitialize(tokenUri: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      expect(await this.contracts.palletToken.uri(0)).to.be.equal(tokenUri);
    });
  });
  context('modifiers', function () {
    it('initializer', async function () {
      await expect(this.contracts.palletToken.initialize(tokenUri)).to.be.revertedWith(
        ErrorsInitializable.AlreadyInitialized
      );
    });
  });
}
