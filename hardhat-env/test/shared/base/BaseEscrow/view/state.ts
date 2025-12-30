import { expect } from 'chai';
import { StatesEscrow } from '@test/shared/states';
import { BaseEscrowContract } from '@test/shared/types';

export default function shouldBehaveLikeState(contract: BaseEscrowContract, escrowId: number): void {
  context('succeeds', function () {
    it('retrieving state', async function () {
      expect(await this.contracts[contract].state(escrowId)).to.be.equal(StatesEscrow.Active);
    });
  });
}
