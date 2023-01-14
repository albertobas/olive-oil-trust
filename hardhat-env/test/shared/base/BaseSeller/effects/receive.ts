import { expect } from 'chai';
import { EventsActor } from 'hardhat-env/test/shared/events';
import { BaseSellerContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeReceive(contract: BaseSellerContract, amount: string): void {
  context('succeeds', function () {
    it('receiving funds', async function () {
      const tx = await this.signers.deployer.sendTransaction({
        to: this.contracts[contract].address,
        value: amount
      });
      await expect(tx)
        .to.emit(this.contracts[contract], EventsActor.Received)
        .withArgs(this.signers.deployer.address, amount);
    });
  });
}
