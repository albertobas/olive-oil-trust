import { expect } from 'chai';

export default function shouldBehaveLikeUri(certificateUri: string): void {
  context('succeeds', function () {
    it("retrieving the certificate's URI", async function () {
      expect(await this.contracts.certificate.uri()).to.be.equal(certificateUri);
    });
  });
}
