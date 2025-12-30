import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsAgriculturalEscrowUpgradeable } from '@test/shared/errors';
import { EventsEscrow } from '@test/shared/events';
import { StatesEscrow } from '@test/shared/states';

export default function shouldBehaveLikeMakeOffer(escrowId: number, tokenPrice: string): void {
  const options = { value: tokenPrice };
  const wrongOptions = { value: '0' };

  context('succeeds', function () {
    it('making an offer to the seller', async function () {
      await expect(
        this.contracts.agriculturalEscrow
          .connect(this.signers.acc2)
          .makeOffer(escrowId, this.signers.acc3.address, options)
      )
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.EtherDeposited)
        .withArgs(this.signers.acc2.address, this.signers.acc3.address, escrowId, tokenPrice);
    });

    it('setting buyer address, buyer wallet address and price', async function () {
      await this.contracts.agriculturalEscrow
        .connect(this.signers.acc2)
        .makeOffer(escrowId, this.signers.acc3.address, options);
      const escrow = await this.contracts.agriculturalEscrow.escrow(escrowId);
      expect(escrow.state_).to.be.equal(StatesEscrow.EtherDeposited);
      expect(escrow.buyer).to.be.equal(this.signers.acc2.address);
      expect(escrow.buyerWallet).to.be.equal(this.signers.acc3.address);
      expect(escrow.price).to.be.equal(tokenPrice);
      expect(escrow.balance).to.be.equal(tokenPrice);
    });
  });

  context('fails', function () {
    it('if state is not Active', async function () {
      await this.contracts.agriculturalEscrow
        .connect(this.signers.acc2)
        .makeOffer(escrowId, this.signers.acc3.address, options);
      await expect(
        this.contracts.agriculturalEscrow
          .connect(this.signers.acc2)
          .makeOffer(escrowId, this.signers.acc3.address, options)
      ).to.be.revertedWith(ErrorsAgriculturalEscrowUpgradeable.InvalidState);
    });

    it('if wallet is zero address', async function () {
      await expect(
        this.contracts.agriculturalEscrow.connect(this.signers.acc2).makeOffer(escrowId, constants.AddressZero, options)
      ).to.be.revertedWith(ErrorsAgriculturalEscrowUpgradeable.InvalidAddress);
    });

    it('offering zero ether', async function () {
      await expect(
        this.contracts.agriculturalEscrow
          .connect(this.signers.acc2)
          .makeOffer(escrowId, this.signers.acc3.address, wrongOptions)
      ).to.be.revertedWith(ErrorsAgriculturalEscrowUpgradeable.InvalidPrice);
    });
  });
}
