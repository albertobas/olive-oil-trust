import { expect } from 'chai';
import { ErrorsInitializable } from '@test/shared/errors';

export default function shouldBehaveLikeInitialize(memberName: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      expect(await this.contracts.oliveGrowerOne.name()).to.be.equal(memberName);
      expect(await this.contracts.oliveGrowerOne.owner()).to.be.equal(this.signers.deployer.address);
    });
  });

  context('modifiers', function () {
    it('initializer', async function () {
      await expect(
        this.contracts.oliveGrowerOne.initialize(
          this.contracts.oliveGrowerOneOlives.address,
          this.contracts.oliveGrowerOneEscrow.address
        )
      ).to.be.revertedWith(ErrorsInitializable.AlreadyInitialized);
    });
  });
}
