import { expect } from 'chai';
import { ErrorsInitializable } from '@test/shared/errors';

export default function shouldBehaveLikeInitialize(memberName: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      expect(await this.contracts.oliveOilMillCompany.name()).to.be.equal(memberName);
      expect(await this.contracts.oliveOilMillCompany.owner()).to.be.equal(this.signers.deployer.address);
    });
  });

  context('modifiers', function () {
    it('initializer', async function () {
      await expect(
        this.contracts.oliveOilMillCompany.initialize(
          this.contracts.oliveOilMillCompanyOliveOil.address,
          this.contracts.oliveOilMillCompanyEscrow.address
        )
      ).to.be.revertedWith(ErrorsInitializable.AlreadyInitialized);
    });
  });
}
