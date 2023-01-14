import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsBaseEscrow } from 'hardhat-env/test/shared/errors';
import { EventsEscrow } from 'hardhat-env/test/shared/events';
import { StatesEscrow } from 'hardhat-env/test/shared/states';

export default function shouldBehaveLikeCancelPayment(escrowId: number, tokenPrice: string): void {
  context('succeeds', function () {
    it('cancelling a payment and sending back the ether to the buyer candidate', async function () {
      const tx = await this.contracts.industrialUnitsEscrow.connect(this.signers.acc2).cancelPayment(escrowId);
      const price = BigNumber.from(tokenPrice);
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.PaymentCancelled)
        .withArgs(this.signers.acc2.address, this.signers.acc3.address, escrowId, price);
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.EtherWithdrawn)
        .withArgs(escrowId, this.signers.acc3.address, price);
    });

    it('setting state back to Active, buyer address, buyer wallet address and price', async function () {
      await this.contracts.industrialUnitsEscrow.connect(this.signers.acc2).cancelPayment(escrowId);
      const escrow = await this.contracts.industrialUnitsEscrow.connect(this.signers.acc2).escrow(escrowId);
      expect(await this.contracts.industrialUnitsEscrow.state(escrowId)).to.be.equal(StatesEscrow.Active);
      expect(escrow.buyer).to.be.equal(constants.AddressZero);
      expect(escrow.buyerWallet).to.be.equal(constants.AddressZero);
      expect(escrow.price).to.be.equal(tokenPrice);
      expect(escrow.balance).to.be.equal(0);
    });
  });

  context('fails', function () {
    it('if state is not EtherDeposited', async function () {
      await this.contracts.industrialUnitsEscrow.connect(this.signers.acc2).cancelPayment(escrowId);
      await expect(
        this.contracts.industrialUnitsEscrow.connect(this.signers.acc2).cancelPayment(escrowId)
      ).to.be.revertedWith(ErrorsBaseEscrow.InvalidState);
    });
    it('if caller is not the buyer address', async function () {
      await expect(this.contracts.industrialUnitsEscrow.cancelPayment(escrowId)).to.be.revertedWith(
        ErrorsBaseEscrow.InvalidBuyer
      );
    });
  });
}
