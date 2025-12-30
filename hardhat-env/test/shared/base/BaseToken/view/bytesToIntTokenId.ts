import { expect } from 'chai';
import { CreationTokenContract } from '@test/shared/types';

export default function shouldBehaveLikeBytesToIntTokenId(
  contract: CreationTokenContract,
  bytesTokenTypeId: string,
  bytesTokenId: string,
  intTokenId: number
): void {
  context('succeeds', function () {
    it('retrieving the token integer id', async function () {
      const intTokenId_ = await this.contracts[contract].bytesToIntTokenId(bytesTokenTypeId, bytesTokenId);
      expect(intTokenId_).to.be.equal(intTokenId);
    });
  });
}
