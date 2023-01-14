import { expect } from 'chai';
import { StatesEscrow } from 'hardhat-env/test/shared/states';
import { BaseEscrowContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeState(contract: BaseEscrowContract, escrowId: number): void {
  context('succeeds', function () {
    it('retrieving state', async function () {
      expect(await this.contracts[contract].state(escrowId)).to.be.equal(StatesEscrow.Active);
    });
  });
}
