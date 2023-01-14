import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsActor, EventsEscrow } from 'hardhat-env/test/shared/events';
import { StatesEscrow } from 'hardhat-env/test/shared/states';
import {
  IndustrialOrCommercialUnitsEscrowContract,
  IndustrialOrCommercialUnitsPaymentGatewayContract
} from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeCancelPayment(
  contract: IndustrialOrCommercialUnitsPaymentGatewayContract,
  escrowContract: IndustrialOrCommercialUnitsEscrowContract,
  escrowId: number,
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('cancelling a payment', async function () {
      const tx = await this.contracts[contract].cancelPayment(this.contracts[escrowContract].address, escrowId);
      await expect(tx)
        .to.emit(this.contracts[escrowContract], EventsEscrow.PaymentCancelled)
        .withArgs(this.contracts[contract].address, this.contracts[contract].address, escrowId, tokenPrice);
      await expect(tx)
        .to.emit(this.contracts[escrowContract], EventsEscrow.EtherWithdrawn)
        .withArgs(escrowId, this.contracts[contract].address, tokenPrice);
      await expect(tx)
        .to.emit(this.contracts[contract], EventsActor.Received)
        .withArgs(this.contracts[escrowContract].address, tokenPrice);
    });

    it('setting state, buyer address, buyer wallet address and price', async function () {
      await this.contracts[contract].cancelPayment(this.contracts[escrowContract].address, escrowId);
      const escrow = await this.contracts[escrowContract].escrow(escrowId);
      expect(escrow.state_).to.be.equal(StatesEscrow.Active);
      expect(escrow.buyer).to.be.equal(constants.AddressZero);
      expect(escrow.buyerWallet).to.be.equal(constants.AddressZero);
      expect(escrow.price).to.be.equal(tokenPrice);
      expect(escrow.balance).to.be.equal(0);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .cancelPayment(this.contracts[escrowContract].address, escrowId)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
