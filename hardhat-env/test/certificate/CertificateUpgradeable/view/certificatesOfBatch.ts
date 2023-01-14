import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsCertificate } from 'hardhat-env/test/shared/errors';
import { CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeCertificatesOfBatch(
  tokenContract: CreationTokenContract,
  certificates: string[],
  tokenIds: string[]
): void {
  context('succeeds', function () {
    it('retrieving the certificates of multiple tokens', async function () {
      await this.contracts.certificate
        .connect(this.signers.acc2)
        .certifyBatch(
          certificates,
          [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
          tokenIds
        );
      const certificates_ = await this.contracts.certificate.certificatesOfBatch(
        [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
        tokenIds
      );
      expect(certificates_.flat()).to.be.deep.equal(certificates);
    });
  });

  context('fails', function () {
    it('if addresses and ids arrays lengths do not match', async function () {
      await expect(
        this.contracts.certificate.certificatesOfBatch([this.contracts[tokenContract].address], tokenIds)
      ).to.revertedWith(ErrorsCertificate.InvalidArray);
    });

    it('if at least one of the addresses is the zero address', async function () {
      await expect(
        this.contracts.certificate.certificatesOfBatch(
          [this.contracts[tokenContract].address, constants.AddressZero],
          tokenIds
        )
      ).to.revertedWith(ErrorsCertificate.InvalidAddress);
    });
  });
}
