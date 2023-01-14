import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsBaseEscrow } from 'hardhat-env/test/shared/errors';
import { EventsEscrow } from 'hardhat-env/test/shared/events';
import { StatesEscrow } from 'hardhat-env/test/shared/states';
import { BaseEscrowContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeCancelPayment(
  contract: BaseEscrowContract,
  escrowId: number,
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('cancelling a payment and sending back ether to the buyer candidate', async function () {
      const tx = await this.contracts[contract].connect(this.signers.acc2).cancelPayment(escrowId);
      await expect(tx)
        .to.emit(this.contracts[contract], EventsEscrow.PaymentCancelled)
        .withArgs(this.signers.acc2.address, this.signers.acc3.address, escrowId, tokenPrice);
      await expect(tx)
        .to.emit(this.contracts[contract], EventsEscrow.EtherWithdrawn)
        .withArgs(escrowId, this.signers.acc3.address, tokenPrice);
    });

    it('setting state of the contract back to Active, buyer address, buyer wallet address and price', async function () {
      await this.contracts[contract].connect(this.signers.acc2).cancelPayment(escrowId);
      const escrow = await this.contracts[contract].connect(this.signers.acc2).escrow(escrowId);
      expect(await this.contracts[contract].state(escrowId)).to.be.equal(StatesEscrow.Active);
      expect(escrow.buyer).to.be.equal(constants.AddressZero);
      expect(escrow.buyerWallet).to.be.equal(constants.AddressZero);
      expect(escrow.price).to.be.equal(tokenPrice);
      expect(escrow.balance).to.be.equal(0);
    });
  });

  context('fails', function () {
    it('if state is not EtherDeposited', async function () {
      await this.contracts[contract].connect(this.signers.acc2).cancelPayment(escrowId);
      await expect(this.contracts[contract].connect(this.signers.acc2).cancelPayment(escrowId)).to.be.revertedWith(
        ErrorsBaseEscrow.InvalidState
      );
    });
    it('cancelling the deposit if caller is not the buyer candidate of the escrow', async function () {
      await expect(this.contracts[contract].cancelPayment(escrowId)).to.be.revertedWith(ErrorsBaseEscrow.InvalidBuyer);
    });
  });
}
