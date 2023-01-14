import { expect } from 'chai';
import { StatesEscrow } from 'hardhat-env/test/shared/states';

export default function shouldBehaveLikeEscrow(escrowId: number, tokenIds: string[], tokenPrice: string): void {
  context('succeeds', function () {
    it('retrieving escrow struct', async function () {
      const escrow = await this.contracts.industrialUnitsEscrow.escrow(escrowId);
      expect(escrow.addr).to.be.equal(this.contracts.palletToken.address);
      expect(escrow.state_).to.be.equal(StatesEscrow.EtherDeposited);
      expect(escrow.seller).to.be.equal(this.signers.deployer.address);
      expect(escrow.sellerWallet).to.be.equal(this.signers.deployer.address);
      expect(escrow.buyer).to.be.equal(this.signers.acc2.address);
      expect(escrow.buyerWallet).to.be.equal(this.signers.acc3.address);
      expect(escrow.ids).to.be.deep.equal(tokenIds);
      expect(escrow.price).to.be.equal(tokenPrice);
      expect(escrow.balance).to.be.equal(tokenPrice);
    });
  });
}
