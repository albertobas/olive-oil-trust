import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsDependentTokenUpgradeable, ErrorsOwnable } from '@test/shared/errors';
import { DependentTokenUpgradeableContract } from '@test/shared/types';
import { EventsDependentTokenUpgradeable } from '@test//shared/events';

export default function shouldBehaveLikeSetTokenTypeInstructions(
  contract: DependentTokenUpgradeableContract,
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
      await expect(tx)
        .to.emit(this.contracts[contract], EventsDependentTokenUpgradeable.TokenTypeInstructionsSet)
        .withArgs(
          this.signers.deployer.address,
          tokenTypeId,
          this.token.addresses,
          instructedTokenTypeIds,
          instructedTokenAmounts
        );
      const instructions = await this.contracts[contract].getInstructions(tokenTypeId);
      expect(instructions).to.be.deep.equal([this.token.addresses, instructedTokenTypeIds, instructedTokenAmounts]);
    });
  });

  context('fails', function () {
    it('if token id already has instructions set in the contract', async function () {
      await this.contracts[contract].setTokenTypeInstructions(
        tokenTypeId,
        this.token.addresses,
        instructedTokenTypeIds,
        instructedTokenAmounts
      );
      await expect(
        this.contracts[contract].setTokenTypeInstructions(
          tokenTypeId,
          this.token.addresses,
          instructedTokenTypeIds,
          instructedTokenAmounts
        )
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.DuplicatedTokenTypeId);
    });

    it('if length of any of the arrays is zero or different to the other lengths', async function () {
      await expect(
        this.contracts[contract].setTokenTypeInstructions(tokenTypeId, this.token.addresses, instructedTokenTypeIds, [])
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidArray);
    });

    it('if length of any of the arrays is zero or different to the other lengths', async function () {
      await expect(
        this.contracts[contract].setTokenTypeInstructions(tokenTypeId, this.token.addresses, instructedTokenTypeIds, [])
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidArray);
    });

    it('if at least one of the instructed addresses is the zero address', async function () {
      await expect(
        this.contracts[contract].setTokenTypeInstructions(
          tokenTypeId,
          [constants.AddressZero],
          [instructedTokenTypeIds[0]],
          instructedTokenAmounts
        )
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidAddress);
    });

    it('if at least more than one instruction share instructed addresses and type ids', async function () {
      await expect(
        this.contracts[contract].setTokenTypeInstructions(
          tokenTypeId,
          [this.token.addresses[0], this.token.addresses[0]],
          [instructedTokenTypeIds[0], instructedTokenTypeIds[0]],
          [instructedTokenAmounts[0], instructedTokenAmounts[0]]
        )
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidAddress);
    });

    it('if at least one of the instructed amounts is zero', async function () {
      await expect(
        this.contracts[contract].setTokenTypeInstructions(
          tokenTypeId,
          [this.token.addresses[0]],
          [instructedTokenTypeIds[0]],
          [0]
        )
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidAmount);
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
