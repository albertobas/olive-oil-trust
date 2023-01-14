import { expect } from 'chai';
import { BigNumber } from 'ethers';

export default function shouldBehaveLikeGetTokens(
  palletId: string,
  tokenTypeIds: string[],
  tokenIds: string[],
  amounts: number[]
): void {
  context('succeeds', function () {
    it('retrieving the addresses, ids and amounts of the tokens in the pallet', async function () {
      const bigAmounts = amounts.map((am) => BigNumber.from(am));
      const tokens = await this.contracts.palletToken.getTokens(palletId);
      expect(tokens).to.be.deep.equal([this.token.addresses, tokenTypeIds, tokenIds, bigAmounts]);
    });
  });
}
