import { expect } from 'chai';
import { ErrorsInitializable } from '@test/shared/errors';
import { EventsBaseMember } from '@test/shared/events';

export default function shouldBehaveLikeInitialize(memberName: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      const tx = await this.contracts.distributor.initialize(
        this.contracts.palletToken.address,
        this.contracts.industrialUnitsEscrow.address
      );
      expect(await this.contracts.distributor.name()).to.be.equal(memberName);
      expect(await this.contracts.distributor.owner()).to.be.equal(this.signers.deployer.address);
      await expect(tx).to.emit(this.contracts.distributor, EventsBaseMember.NameSet);
    });
  });
  context('modifiers', function () {
    it('initializer', async function () {
      await expect(
        this.contracts.distributor.initialize(
          this.contracts.palletToken.address,
          this.contracts.industrialUnitsEscrow.address
        )
      ).to.be.revertedWith(ErrorsInitializable.AlreadyInitialized);
    });
  });
}
