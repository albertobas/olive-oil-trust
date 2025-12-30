import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsBaseEscrow, ErrorsIndustrialUnitsEscrowUpgradeable } from '@test/shared/errors';
import { EventsEscrow } from '@test/shared/events';
import { StatesEscrow } from '@test/shared/states';

export default function shouldBehaveLikeMakePayment(escrowId: number, tokenPrice: string): void {
  const options = { value: tokenPrice };
  const wrongOptions = { value: '0' };
  context('succeeds', function () {
    it('depositing ether', async function () {
      await expect(
        this.contracts.industrialUnitsEscrow
          .connect(this.signers.acc2)
          .makePayment(escrowId, this.signers.acc3.address, options)
      )
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.EtherDeposited)
        .withArgs(this.signers.acc2.address, this.signers.acc3.address, escrowId, tokenPrice);
    });

    it('setting state, buyer address, buyer wallet address and price', async function () {
      await this.contracts.industrialUnitsEscrow
        .connect(this.signers.acc2)
        .makePayment(escrowId, this.signers.acc3.address, options);
      const escrow = await this.contracts.industrialUnitsEscrow.escrow(escrowId);
      expect(escrow.state_).to.be.equal(StatesEscrow.EtherDeposited);
      expect(escrow.buyer).to.be.equal(this.signers.acc2.address);
      expect(escrow.buyerWallet).to.be.equal(this.signers.acc3.address);
      expect(escrow.price).to.be.equal(tokenPrice);
      expect(escrow.balance).to.be.equal(tokenPrice);
    });
  });

  context('fails', function () {
    it('if state is not Active', async function () {
      await this.contracts.industrialUnitsEscrow
        .connect(this.signers.acc2)
        .makePayment(escrowId, this.signers.acc3.address, options);
      await expect(
        this.contracts.industrialUnitsEscrow
          .connect(this.signers.acc2)
          .makePayment(escrowId, this.signers.acc3.address, options)
      ).to.be.revertedWith(ErrorsBaseEscrow.InvalidState);
    });

    it('if msg.value does not match price', async function () {
      await expect(
        this.contracts.industrialUnitsEscrow
          .connect(this.signers.acc2)
          .makePayment(escrowId, this.signers.acc3.address, wrongOptions)
      ).to.be.revertedWith(ErrorsIndustrialUnitsEscrowUpgradeable.InvalidPrice);
    });

    it('if wallet is zero address', async function () {
      await expect(
        this.contracts.industrialUnitsEscrow
          .connect(this.signers.acc2)
          .makePayment(escrowId, constants.AddressZero, options)
      ).to.be.revertedWith(ErrorsIndustrialUnitsEscrowUpgradeable.InvalidAddress);
    });
  });
}
