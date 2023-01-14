import { expect } from 'chai';

export default function shouldBehaveLikeBytesToIntId(bytesId: string, intId: number): void {
  context('succeeds', function () {
    it('retrieving the pallet integer id', async function () {
      const intId_ = await this.contracts.palletToken.bytesToIntId(bytesId);
      expect(intId_).to.be.equal(intId);
    });
  });
}
