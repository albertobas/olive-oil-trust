import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { DependentTokenUpgradeableContract } from '@test/shared/types';
import { ErrorsDependentTokenUpgradeable, ErrorsOwnable } from '@test/shared/errors';
import { EventsDependentTokenUpgradeable } from '@test/shared/events';

export default function shouldBehaveLikeSetTokenTypesInstructions(
  contract: DependentTokenUpgradeableContract,
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
        const amounts = instructedTokenAmounts[i].map((amount) => BigNumber.from(amount));
        const instructions = await this.contracts[contract].getInstructions(tokenTypeIds[i]);
        expect(instructions).to.be.deep.equal([this.token.addresses, instructedTokenTypeIds[i], amounts]);
      }
      await expect(tx).to.emit(this.contracts[contract], EventsDependentTokenUpgradeable.TokenTypesInstructionsSet);
    });
  });
  context('fails', function () {
    it('if length of any of the arrays is zero or different to the other lengths', async function () {
      await expect(
        this.contracts[contract].setTokenTypesInstructions(
          tokenTypeIds,
          [this.token.addresses, this.token.addresses],
          instructedTokenTypeIds,
          []
        )
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidArray);
    });

    it('if token id already has instructions set in the contract', async function () {
      await this.contracts[contract].setTokenTypesInstructions(
        tokenTypeIds,
        [this.token.addresses, this.token.addresses],
        instructedTokenTypeIds,
        instructedTokenAmounts
      );
      await expect(
        this.contracts[contract].setTokenTypesInstructions(
          tokenTypeIds,
          [this.token.addresses, this.token.addresses],
          instructedTokenTypeIds,
          instructedTokenAmounts
        )
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.DuplicatedTokenTypeId);
    });

    it('if length of any of the arrays in the second dimension is zero or different to the other lengths', async function () {
      await expect(
        this.contracts[contract].setTokenTypesInstructions(
          tokenTypeIds,
          [[...this.token.addresses, ...this.token.addresses], this.token.addresses],
          instructedTokenTypeIds,
          instructedTokenAmounts
        )
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidArray);
    });

    it('if at least one of the instructed addresses is the zero address', async function () {
      await expect(
        this.contracts[contract].setTokenTypesInstructions(
          tokenTypeIds,
          [[constants.AddressZero], this.token.addresses],
          [[instructedTokenTypeIds[0][0]], instructedTokenTypeIds[1]],
          [[instructedTokenAmounts[0][0]], instructedTokenAmounts[1]]
        )
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidAddress);
    });

    it('if at least more than one instruction share instructed addresses and type ids', async function () {
      await expect(
        this.contracts[contract].setTokenTypesInstructions(
          tokenTypeIds,
          [[this.token.addresses[0], this.token.addresses[0]], this.token.addresses],
          [[instructedTokenTypeIds[0][0], instructedTokenTypeIds[0][0]], instructedTokenTypeIds[1]],
          [[instructedTokenAmounts[0][0], instructedTokenAmounts[0][0]], instructedTokenAmounts[1]]
        )
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidAddress);
    });

    it('if at least one of the instructed amounts is zero', async function () {
      await expect(
        this.contracts[contract].setTokenTypesInstructions(
          tokenTypeIds,
          [[this.token.addresses[0]], this.token.addresses],
          [[instructedTokenTypeIds[0][0]], instructedTokenTypeIds[1]],
          [[0], instructedTokenAmounts[1]]
        )
      ).to.be.revertedWith(ErrorsDependentTokenUpgradeable.InvalidAmount);
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
