import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsCertificate, ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsCertificate } from 'hardhat-env/test/shared/events';
import { CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeCertifyToken(
  tokenContract: CreationTokenContract,
  certificateId: string,
  tokenTypeId1: string,
  tokenTypeId2: string
): void {
  context('succeeds', function () {
    it('certifying a token and confirming a certificate does not get multiple ids', async function () {
      const tx = await this.contracts.certificate
        .connect(this.signers.acc2)
        .certifyToken(certificateId, this.contracts[tokenContract].address, tokenTypeId1);
      await expect(tx)
        .to.emit(this.contracts.certificate, EventsCertificate.TokenCertified)
        .withArgs(this.signers.acc2.address, certificateId, this.contracts[tokenContract].address, tokenTypeId1);
      await this.contracts.certificate
        .connect(this.signers.acc2)
        .certifyToken(certificateId, this.contracts[tokenContract].address, tokenTypeId2);
      const token1Certificates = await this.contracts.certificate.certificatesOf(
        this.contracts[tokenContract].address,
        tokenTypeId1
      );
      const token2Certificates = await this.contracts.certificate.certificatesOf(
        this.contracts[tokenContract].address,
        tokenTypeId2
      );
      expect(token1Certificates).to.be.deep.equal(token2Certificates);
    });
  });

  context('fails', function () {
    it('if the token has already been certified', async function () {
      await this.contracts.certificate
        .connect(this.signers.acc2)
        .certifyToken(certificateId, this.contracts[tokenContract].address, tokenTypeId1);
      await expect(
        this.contracts.certificate
          .connect(this.signers.acc2)
          .certifyToken(certificateId, this.contracts[tokenContract].address, tokenTypeId1)
      ).to.be.revertedWith(ErrorsCertificate.TokenAlreadyCertified);
    });

    it('if the address is the zero address', async function () {
      await expect(
        this.contracts.certificate
          .connect(this.signers.acc2)
          .certifyToken(certificateId, constants.AddressZero, tokenTypeId1)
      ).to.be.revertedWith(ErrorsCertificate.InvalidAddress);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.certificate
          .connect(this.signers.acc3)
          .certifyToken(certificateId, this.contracts[tokenContract].address, tokenTypeId1)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
