import { expect } from 'chai';
import { MemberContract } from '@test/shared/types';

export default function shouldBehaveLikeName(contract: MemberContract, memberName: string): void {
  context('succeeds', function () {
    it('retrieving the name', async function () {
      expect(await this.contracts[contract].name()).to.be.equal(memberName);
    });
  });
}
