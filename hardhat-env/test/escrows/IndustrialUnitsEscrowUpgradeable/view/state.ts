import { expect } from 'chai';
import { StatesEscrow } from '@test/shared/states';

export default function shouldBehaveLikeState(escrowId: number): void {
  context('succeeds', function () {
    it('retrieving state', async function () {
      expect(await this.contracts.industrialUnitsEscrow.state(escrowId)).to.be.equal(StatesEscrow.Active);
    });
  });
}
