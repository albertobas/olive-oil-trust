import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsActor, EventsEscrow } from 'hardhat-env/test/shared/events';
import { StatesEscrow } from 'hardhat-env/test/shared/states';

export default function shouldBehaveLikeCancelPayment(escrowId: number, tokenPrice: string): void {
  context('succeeds', function () {
    it('cancelling a payment and sending back ether to the buyer candidate', async function () {
      const tx = await this.contracts.oliveOilMill.cancelPayment(this.contracts.agriculturalEscrow.address, escrowId);
      const price = BigNumber.from(tokenPrice);
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.PaymentCancelled)
        .withArgs(this.contracts.oliveOilMill.address, this.contracts.oliveOilMill.address, escrowId, price);
      await expect(tx)
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.EtherWithdrawn)
        .withArgs(escrowId, this.contracts.oliveOilMill.address, price);
      await expect(tx)
        .to.emit(this.contracts.oliveOilMill, EventsActor.Received)
        .withArgs(this.contracts.agriculturalEscrow.address, price);
    });

    it('setting state of the contract back to Active', async function () {
      await this.contracts.oliveOilMill.cancelPayment(this.contracts.agriculturalEscrow.address, escrowId);
      expect(await this.contracts.agriculturalEscrow.state(escrowId)).to.be.equal(StatesEscrow.Active);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.oliveOilMill
          .connect(this.signers.acc2)
          .cancelPayment(this.contracts.agriculturalEscrow.address, escrowId)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
