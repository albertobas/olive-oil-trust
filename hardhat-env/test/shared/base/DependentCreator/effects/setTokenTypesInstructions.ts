import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { DependentCreatorContract, DependentTokenUpgradeableContract } from 'hardhat-env/test/shared/types';
import { EventsDependentTokenUpgradeable } from 'hardhat-env/test/shared/events';

export default function shouldBehaveLikeSetTokenTypesInstructions(
  contract: DependentCreatorContract,
  tokenContract: DependentTokenUpgradeableContract,
  tokenTypeIds: string[],
  instructedTokenTypeIds: string[][],
  instructedTokenAmounts: BigNumber[][]
): void {
  context('succeeds', function () {
    it('setting instructions to multiple tokens', async function () {
      const tx = await this.contracts[contract].setTokenTypesInstructions(
        tokenTypeIds,
        [this.token.addresses, this.token.addresses],
        instructedTokenTypeIds,
        instructedTokenAmounts
      );
      for (let i = 0; i < instructedTokenTypeIds.length; i++) {
        const instructions = await this.contracts[tokenContract].getInstructions(tokenTypeIds[i]);
        expect(instructions).to.be.deep.equal([
          this.token.addresses,
          instructedTokenTypeIds[i],
          instructedTokenAmounts[i]
        ]);
      }
      await expect(tx).to.emit(
        this.contracts[tokenContract],
        EventsDependentTokenUpgradeable.TokenTypesInstructionsSet
      );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .setTokenTypesInstructions(
            tokenTypeIds,
            [this.token.addresses, this.token.addresses],
            instructedTokenTypeIds,
            instructedTokenAmounts
          )
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
