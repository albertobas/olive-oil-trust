import { expect } from 'chai';
import { ErrorsInitializable } from 'hardhat-env/test/shared/errors';

export default function shouldBehaveLikeInitialize(memberName: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      expect(await this.contracts.bottlingCompany.name()).to.be.equal(memberName);
      expect(await this.contracts.bottlingCompany.owner()).to.be.equal(this.signers.deployer.address);
    });
  });

  context('modifiers', function () {
    it('initializer', async function () {
      await expect(
        this.contracts.bottlingCompany.initialize(
          this.contracts.bottlingCompanyOliveOilBottle.address,
          this.contracts.bottlingCompanyPallet.address,
          this.contracts.bottlingCompanyEscrow.address
        )
      ).to.be.revertedWith(ErrorsInitializable.AlreadyInitialized);
    });
  });
}
