import { expect } from 'chai';
import { EventsEscrow } from 'hardhat-env/test/shared/events';
import { StatesEscrow } from 'hardhat-env/test/shared/states';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';

export default function shouldBehaveLikeMakeOffer(escrowId: number, tokenPrice: string): void {
  const options = { value: tokenPrice };

  context('succeeds', function () {
    it('making an offer to the seller', async function () {
      await expect(
        this.contracts.oliveOilMill.makeOffer(
          this.contracts.agriculturalEscrow.address,
          escrowId,
          this.signers.deployer.address,
          options
        )
      )
        .to.emit(this.contracts.agriculturalEscrow, EventsEscrow.EtherDeposited)
        .withArgs(this.contracts.oliveOilMill.address, this.signers.deployer.address, escrowId, tokenPrice);
    });

    it('setting state of the contract to EtherDeposited', async function () {
      await this.contracts.oliveOilMill.makeOffer(
        this.contracts.agriculturalEscrow.address,
        escrowId,
        this.signers.deployer.address,
        options
      );
      expect(await this.contracts.agriculturalEscrow.state(escrowId)).to.be.equal(StatesEscrow.EtherDeposited);
    });

    it('setting buyer address, buyer wallet address and price', async function () {
      await this.contracts.oliveOilMill.makeOffer(
        this.contracts.agriculturalEscrow.address,
        escrowId,
        this.signers.deployer.address,
        options
      );
      const escrow = await this.contracts.agriculturalEscrow.escrow(escrowId);
      expect(escrow.buyer).to.be.equal(this.contracts.oliveOilMill.address);
      expect(escrow.buyerWallet).to.be.equal(this.signers.deployer.address);
      expect(escrow.price).to.be.equal(tokenPrice);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.oliveOilMill
          .connect(this.signers.acc2)
          .makeOffer(this.contracts.agriculturalEscrow.address, escrowId, this.signers.acc3.address, options)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
