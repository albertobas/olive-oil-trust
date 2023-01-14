import { expect } from 'chai';

export default function shouldBehaveLikeSupportsInterface(interfaceId: string): void {
  context('succeeds', function () {
    it('retrieving boolean for supports interface check', async function () {
      const supportedInterface = await this.contracts.palletToken.supportsInterface(interfaceId);
      expect(supportedInterface).to.be.equal(true);
    });
  });
}
