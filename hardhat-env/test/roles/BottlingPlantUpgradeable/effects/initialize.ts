import { expect } from 'chai';
import { ErrorsInitializable } from 'hardhat-env/test/shared/errors';
import { EventsBaseMember } from 'hardhat-env/test/shared/events';

export default function shouldBehaveLikeInitialize(memberName: string): void {
  context('succeeds', function () {
    it('initializing', async function () {
      const tx = await this.contracts.bottlingPlant.initialize(
        this.contracts.oliveOilBottleToken.address,
        this.contracts.palletToken.address,
        this.contracts.industrialUnitsEscrow.address
      );
      expect(await this.contracts.bottlingPlant.name()).to.be.equal(memberName);
      expect(await this.contracts.bottlingPlant.owner()).to.be.equal(this.signers.deployer.address);
      await expect(tx).to.emit(this.contracts.bottlingPlant, EventsBaseMember.NameSet);
    });
  });

  context('modifiers', function () {
    it('initializer', async function () {
      await expect(
        this.contracts.bottlingPlant.initialize(
          this.contracts.oliveOilBottleToken.address,
          this.contracts.palletToken.address,
          this.contracts.industrialUnitsEscrow.address
        )
      ).to.be.revertedWith(ErrorsInitializable.AlreadyInitialized);
    });
  });
}
