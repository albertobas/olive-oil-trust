import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsCertificate, ErrorsOwnable } from '@test/shared/errors';
import { EventsCertificate } from '@test/shared/events';
import { CreationTokenContract } from '@test/shared/types';

export default function shouldBehaveLikeCertifyBatch(
  tokenContract: CreationTokenContract,
  certificateIds: string[],
  tokenTypeIds: string[]
): void {
  context('succeeds', function () {
    it('certifying multiple tokens', async function () {
      const tx = await this.contracts.certificate
        .connect(this.signers.acc2)
        .certifyBatch(
          certificateIds,
          [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
          tokenTypeIds
        );
      await expect(tx)
        .to.emit(this.contracts.certificate, EventsCertificate.BatchCertified)
        .withArgs(
          this.signers.acc2.address,
          certificateIds,
          [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
          tokenTypeIds
        );
    });
  });

  context('fails', function () {
    it('if arguments arrays length do not match', async function () {
      await expect(
        this.contracts.certificate
          .connect(this.signers.acc2)
          .certifyBatch(certificateIds, [this.contracts[tokenContract].address], tokenTypeIds)
      ).to.be.revertedWith(ErrorsCertificate.InvalidArray);
    });

    it('if at least one of the addresses is the zero address', async function () {
      await expect(
        this.contracts.certificate
          .connect(this.signers.acc2)
          .certifyBatch(certificateIds, [this.contracts[tokenContract].address, constants.AddressZero], tokenTypeIds)
      ).to.be.revertedWith(ErrorsCertificate.InvalidAddress);
    });

    it('if at least one of the tokens has already been certified', async function () {
      await this.contracts.certificate
        .connect(this.signers.acc2)
        .certifyBatch(
          certificateIds,
          [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
          tokenTypeIds
        );
      await expect(
        this.contracts.certificate
          .connect(this.signers.acc2)
          .certifyBatch(
            certificateIds,
            [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
            tokenTypeIds
          )
      ).to.be.revertedWith(ErrorsCertificate.TokenAlreadyCertified);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.certificate
          .connect(this.signers.acc3)
          .certifyBatch(
            certificateIds,
            [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
            tokenTypeIds
          )
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
