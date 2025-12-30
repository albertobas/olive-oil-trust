import { expect } from 'chai';
import { ErrorsOwnable } from '@test/shared/errors';
import { EventsCertificate } from '@test/shared/events';
import { CreationTokenContract } from '@test/shared/types';

export default function shouldBehaveLikeCertifyToken(
  tokenContract: CreationTokenContract,
  certificateId: string,
  tokenId: string
): void {
  context('succeeds', function () {
    it('certifying a token', async function () {
      const tx = await this.contracts.certifier.certifyToken(
        certificateId,
        this.contracts[tokenContract].address,
        tokenId
      );
      await expect(tx)
        .to.emit(this.contracts.certificate, EventsCertificate.TokenCertified)
        .withArgs(this.contracts.certifier.address, certificateId, this.contracts[tokenContract].address, tokenId);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.certifier
          .connect(this.signers.acc2)
          .certifyToken(certificateId, this.contracts[tokenContract].address, tokenId)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
