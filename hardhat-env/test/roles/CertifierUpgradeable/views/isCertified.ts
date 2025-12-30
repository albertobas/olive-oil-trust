import { expect } from 'chai';
import { CreationTokenContract } from '@test/shared/types';

export default function shouldBehaveLikeIsCertified(
  tokenContract: CreationTokenContract,
  certificateId: string,
  tokenId: string
): void {
  context('succeeds', function () {
    it('retrieving certification confirmation', async function () {
      expect(
        await this.contracts.certifier.isCertified(certificateId, this.contracts[tokenContract].address, tokenId)
      ).to.be.equal(false);
      await this.contracts.certifier.certifyToken(certificateId, this.contracts[tokenContract].address, tokenId);
      expect(
        await this.contracts.certifier.isCertified(certificateId, this.contracts[tokenContract].address, tokenId)
      ).to.be.equal(true);
    });
  });
}
