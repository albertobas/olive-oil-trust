import { expect } from 'chai';
import { ErrorsInitializable } from '@test/shared/errors';
import { EventsBaseMember } from '@test/shared/events';

export default function shouldBehaveLikeInitialize(memberName: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      const tx = await this.contracts.retailer.initialize(this.contracts.commercialUnitsEscrow.address);
      expect(await this.contracts.retailer.name()).to.be.equal(memberName);
      expect(await this.contracts.retailer.owner()).to.be.equal(this.signers.deployer.address);
      await expect(tx).to.emit(this.contracts.retailer, EventsBaseMember.NameSet);
    });
  });
  context('modifiers', function () {
    it('initializer', async function () {
      await expect(this.contracts.retailer.initialize(this.contracts.commercialUnitsEscrow.address)).to.be.revertedWith(
        ErrorsInitializable.AlreadyInitialized
      );
    });
  });
}
