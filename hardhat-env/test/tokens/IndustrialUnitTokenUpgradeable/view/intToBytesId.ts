import { expect } from 'chai';

export default function shouldBehaveLikeIntToBytesId(intId: number, bytesId: string): void {
  context('succeeds', function () {
    it('retrieving the pallet bytes id', async function () {
      const bytesId_ = await this.contracts.palletToken.intToBytesId(intId);
      expect(bytesId_).to.be.equal(bytesId);
    });
  });
}
