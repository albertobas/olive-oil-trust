import { expect } from 'chai';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsCertificate } from 'hardhat-env/test/shared/events';
import { CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeCertifyBatch(
  tokenContract: CreationTokenContract,
  certificateIds: string[],
  tokenIds: string[]
): void {
  context('succeeds', function () {
    it('certifying multiple tokens', async function () {
      const tx = await this.contracts.certifier.certifyBatch(
        certificateIds,
        [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
        tokenIds
      );
      await expect(tx)
        .to.emit(this.contracts.certificate, EventsCertificate.BatchCertified)
        .withArgs(
          this.contracts.certifier.address,
          certificateIds,
          [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
          tokenIds
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.certifier
          .connect(this.signers.acc2)
          .certifyBatch(
            certificateIds,
            [this.contracts[tokenContract].address, this.contracts[tokenContract].address],
            tokenIds
          )
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
