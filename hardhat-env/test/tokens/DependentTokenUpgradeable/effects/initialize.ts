import { expect } from 'chai';
import { ErrorsInitializable } from 'hardhat-env/test/shared/errors';
import { DependentTokenUpgradeableContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeInitialize(
  contract: DependentTokenUpgradeableContract,
  tokenUri: string
): void {
  context('succeeds', function () {
    it('initializing', async function () {
      expect(await this.contracts[contract].uri(0)).to.be.equal(tokenUri);
      expect(await this.contracts[contract].owner()).to.be.equal(this.signers.deployer.address);
    });
  });

  context('modifiers', function () {
    it('initializer', async function () {
      await expect(this.contracts[contract].initialize(tokenUri)).to.be.revertedWith(
        ErrorsInitializable.AlreadyInitialized
      );
    });
  });
}
