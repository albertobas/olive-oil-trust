import { expect } from 'chai';
import { CreationTokenContract } from '@test/shared/types';

export default function shouldBehaveLikeBytesToIntTokenTypeId(
  contract: CreationTokenContract,
  bytesTokenTypeId: string,
  intTokenTypeId: number
): void {
  context('succeeds', function () {
    it('retrieving the token type integer id', async function () {
      const intTokenTypeId_ = await this.contracts[contract].bytesToIntTokenTypeId(bytesTokenTypeId);
      expect(intTokenTypeId_).to.be.equal(intTokenTypeId);
    });
  });
}
