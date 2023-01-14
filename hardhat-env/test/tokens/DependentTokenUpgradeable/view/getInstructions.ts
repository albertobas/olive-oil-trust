import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { DependentTokenUpgradeableContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeGetInstructions(
  contract: DependentTokenUpgradeableContract,
  tokenTypeId: string,
  instructedTokenTypeIds: string[],
  instructedTokenAmounts: BigNumber[]
): void {
  context('succeeds', function () {
    it('retrieving the instructions of a type of token', async function () {
      const instructions = await this.contracts[contract].getInstructions(tokenTypeId);
      expect(instructions).to.be.deep.equal([
        [this.contracts.olivesToken.address],
        instructedTokenTypeIds,
        instructedTokenAmounts
      ]);
    });
  });
}
