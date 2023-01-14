import { expect } from 'chai';
import { CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeCertificatesOf(
  tokenContract: CreationTokenContract,
  certificate: string,
  tokenId: string
): void {
  context('succeeds', function () {
    it('retrieving the certificates of a token', async function () {
      const certificates = await this.contracts.certifier.certificatesOf(
        this.contracts[tokenContract].address,
        tokenId
      );
      expect(certificates).to.be.deep.equal([certificate]);
    });
  });
}
