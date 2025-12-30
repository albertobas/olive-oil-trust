import { expect } from 'chai';
import { CreationTokenContract } from '@test/shared/types';

export default function shouldBehaveLikeIsCertified(
  tokenContract: CreationTokenContract,
  certificateId: string,
  tokenTypeId: string
): void {
  context('succeeds', function () {
    it('retrieving certification confirmation', async function () {
      expect(
        await this.contracts.certificate.isCertified(certificateId, this.contracts[tokenContract].address, tokenTypeId)
      ).to.be.equal(false);
      await this.contracts.certificate
        .connect(this.signers.acc2)
        .certifyToken(certificateId, this.contracts[tokenContract].address, tokenTypeId);
      expect(
        await this.contracts.certificate.isCertified(certificateId, this.contracts[tokenContract].address, tokenTypeId)
      ).to.be.equal(true);
    });
  });
}
