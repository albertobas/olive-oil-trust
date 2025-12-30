import { expect } from 'chai';
import { ErrorsInitializable } from '@test/shared/errors';

export default function shouldBehaveLikeInitialize(memberName: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      expect(await this.contracts.retailerCompany.name()).to.be.equal(memberName);
      expect(await this.contracts.retailerCompany.owner()).to.be.equal(this.signers.deployer.address);
    });
  });

  context('modifiers', function () {
    it('initializer', async function () {
      await expect(
        this.contracts.retailerCompany.initialize(this.contracts.retailerCompanyEscrow.address)
      ).to.be.revertedWith(ErrorsInitializable.AlreadyInitialized);
    });
  });
}
