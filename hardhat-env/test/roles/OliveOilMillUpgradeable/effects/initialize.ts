import { expect } from 'chai';
import { ErrorsInitializable } from 'hardhat-env/test/shared/errors';
import { EventsBaseMember } from 'hardhat-env/test/shared/events';

export default function shouldBehaveLikeInitialize(memberName: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      const tx = await this.contracts.oliveOilMill.initialize(
        this.contracts.oliveOilToken.address,
        this.contracts.commercialUnitsEscrow.address
      );
      expect(await this.contracts.oliveOilMill.name()).to.be.equal(memberName);
      expect(await this.contracts.oliveOilMill.owner()).to.be.equal(this.signers.deployer.address);
      await expect(tx).to.emit(this.contracts.oliveOilMill, EventsBaseMember.NameSet);
    });
  });
  context('modifiers', function () {
    it('initializer', async function () {
      await expect(
        this.contracts.oliveOilMill.initialize(
          this.contracts.oliveOilToken.address,
          this.contracts.commercialUnitsEscrow.address
        )
      ).to.be.revertedWith(ErrorsInitializable.AlreadyInitialized);
    });
  });
}
