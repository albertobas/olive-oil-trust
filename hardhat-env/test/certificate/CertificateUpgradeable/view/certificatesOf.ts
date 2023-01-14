import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsCertificate } from 'hardhat-env/test/shared/errors';
import { CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeCertificatesOf(
  tokenContract: CreationTokenContract,
  certificate: string,
  tokenTypeId: string
): void {
  context('succeeds', function () {
    it('retrieving the certificates of a token', async function () {
      const certificates = await this.contracts.certificate.certificatesOf(
        this.contracts[tokenContract].address,
        tokenTypeId
      );
      expect(certificates).to.be.deep.equal([certificate]);
    });
  });

  context('fails', function () {
    it('if the address is the zero address', async function () {
      await expect(this.contracts.certificate.certificatesOf(constants.AddressZero, tokenTypeId)).to.be.revertedWith(
        ErrorsCertificate.InvalidAddress
      );
    });
  });
}
