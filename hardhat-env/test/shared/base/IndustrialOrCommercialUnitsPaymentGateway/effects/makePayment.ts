import { expect } from 'chai';
import { EventsEscrow } from '@test/shared/events';
import { StatesEscrow } from '@test/shared/states';
import { ErrorsOwnable } from '@test/shared//errors';
import {
  IndustrialOrCommercialUnitsEscrowContract,
  IndustrialOrCommercialUnitsPaymentGatewayContract
} from '@test/shared//types';

export default function shouldBehaveLikeMakePayment(
  contract: IndustrialOrCommercialUnitsPaymentGatewayContract,
  escrowContract: IndustrialOrCommercialUnitsEscrowContract,
  escrowId: number,
  tokenPrice: string
): void {
  const options = { value: tokenPrice };
  context('succeeds', function () {
    it('depositing ether', async function () {
      await expect(
        this.contracts[contract].makePayment(
          this.contracts[escrowContract].address,
          escrowId,
          this.signers.deployer.address,
          options
        )
      )
        .to.emit(this.contracts[escrowContract], EventsEscrow.EtherDeposited)
        .withArgs(this.contracts[contract].address, this.signers.deployer.address, escrowId, tokenPrice);
    });
    it('setting buyer address, buyer wallet address and price', async function () {
      await this.contracts[contract].makePayment(
        this.contracts[escrowContract].address,
        escrowId,
        this.signers.deployer.address,
        options
      );
      const escrow = await this.contracts[escrowContract].escrow(escrowId);
      expect(escrow.state_).to.be.equal(StatesEscrow.EtherDeposited);
      expect(escrow.buyer).to.be.equal(this.contracts[contract].address);
      expect(escrow.buyerWallet).to.be.equal(this.signers.deployer.address);
      expect(escrow.price).to.be.equal(tokenPrice);
      expect(escrow.balance).to.be.equal(tokenPrice);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .makePayment(this.contracts[escrowContract].address, escrowId, this.signers.deployer.address, options)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
