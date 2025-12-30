import { expect } from 'chai';
import { CreationTokenContract } from '@test/shared/types';

export default function shouldBehaveLikeCertificatesOfBatch(
  tokenContract: CreationTokenContract,
  certificates: string[],
  tokenIds: string[]
): void {
  context('succeeds', function () {
    it('retrieving the certificates of multiple tokens', async function () {
      await this.contracts.certifier.certifyBatch(
        certificates,
        [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
        tokenIds
      );
      const certificates_ = await this.contracts.certifier.certificatesOfBatch(
        [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
        tokenIds
      );
      expect(certificates_.flat()).to.be.deep.equal(certificates);
    });
  });
}
