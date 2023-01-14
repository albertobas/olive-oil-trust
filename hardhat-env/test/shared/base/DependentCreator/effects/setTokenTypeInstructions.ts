import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { DependentCreatorContract, DependentTokenUpgradeableContract } from 'hardhat-env/test/shared/types';
import { EventsDependentTokenUpgradeable } from 'hardhat-env/test/shared/events';

export default function shouldBehaveLikeSetTokenTypeInstructions(
  contract: DependentCreatorContract,
  tokenContract: DependentTokenUpgradeableContract,
  tokenTypeId: string,
  instructedTokenTypeIds: string[],
  instructedTokenAmounts: BigNumber[]
): void {
  context('succeeds', function () {
    it('setting instructions to a token', async function () {
      const tx = await this.contracts[contract].setTokenTypeInstructions(
        tokenTypeId,
        this.token.addresses,
        instructedTokenTypeIds,
        instructedTokenAmounts
      );
      const instructions = await this.contracts[tokenContract].getInstructions(tokenTypeId);
      expect(instructions).to.be.deep.equal([this.token.addresses, instructedTokenTypeIds, instructedTokenAmounts]);
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsDependentTokenUpgradeable.TokenTypeInstructionsSet)
        .withArgs(
          this.contracts[contract].address,
          tokenTypeId,
          this.token.addresses,
          instructedTokenTypeIds,
          instructedTokenAmounts
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .setTokenTypeInstructions(tokenTypeId, this.token.addresses, instructedTokenTypeIds, instructedTokenAmounts)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
