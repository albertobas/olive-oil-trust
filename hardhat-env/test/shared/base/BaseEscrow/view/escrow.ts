import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { StatesEscrow } from 'hardhat-env/test/shared/states';
import { BaseEscrowContract, CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeEscrow(
  contract: BaseEscrowContract,
  tokenContract: CreationTokenContract,
  escrowId: number,
  tokenIds: string[],
  tokenAmounts: number[],
  tokenPrice: string
): void {
  const amounts = tokenAmounts.map((am) => {
    return BigNumber.from(am);
  });
  context('succeeds', function () {
    it('retrieving escrow struct', async function () {
      const escrow = await this.contracts[contract].escrow(escrowId);
      expect(escrow.addr).to.be.equal(this.contracts[tokenContract].address);
      expect(escrow.state_).to.be.equal(StatesEscrow.EtherDeposited);
      expect(escrow.seller).to.be.equal(this.signers.deployer.address);
      expect(escrow.sellerWallet).to.be.equal(this.signers.deployer.address);
      expect(escrow.buyer).to.be.equal(this.signers.acc2.address);
      expect(escrow.buyerWallet).to.be.equal(this.signers.acc3.address);
      expect(escrow.ids).to.be.deep.equal(tokenIds);
      expect(escrow.amounts).to.be.deep.equal(amounts);
      expect(escrow.price).to.be.equal(tokenPrice);
      expect(escrow.balance).to.be.equal(tokenPrice);
    });
  });
}
