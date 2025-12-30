import { expect } from 'chai';
import { CreationTokenContract } from '@test/shared/types';

export default function shouldBehaveLikeIntToBytesTokenId(
  contract: CreationTokenContract,
  intTokenId: number,
  bytesTokenId: string
): void {
  context('succeeds', function () {
    it('retrieving the token bytes id', async function () {
      const bytesTokenId_ = await this.contracts[contract].intToBytesTokenId(intTokenId);
      expect(bytesTokenId_).to.be.equal(bytesTokenId);
    });
  });
}
