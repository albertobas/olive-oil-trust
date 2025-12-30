import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsOwnable, ErrorsValidationLibrary } from '@test/shared/errors';
import {
  DependentCreatorContract,
  DependentTokenUpgradeableContract,
  IndependentTokenUpgradeableContract
} from '@test/shared/types';
import { EventsBaseToken, EventsDependentCreator, EventsERC1155 } from '@test/shared/events';

export default function shouldBehaveLikeMint(
  contract: DependentCreatorContract,
  contractCertificate: DependentCreatorContract,
  tokenContract: DependentTokenUpgradeableContract,
  instructedTokenContracts: Array<DependentTokenUpgradeableContract | IndependentTokenUpgradeableContract>,
  tokenContractCertificate: DependentTokenUpgradeableContract,
  tokenTypeId: string,
  tokenId: string,
  tokenUnitsToMint: number,
  inputTypeIds: string[][],
  inputIds: string[][],
  inputTypeIdsNonCertified: string[][],
  inputIdsNonCertified: string[][],
  inpuTokenAmounts: BigNumber[][],
  oobAmount: number
): void {
  context('succeeds', function () {
    it('minting a dependent token', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      const tx = await this.contracts[contract].mint(tokenTypeId, tokenId, tokenUnitsToMint, {
        inputTokenAddresses,
        inputTokenTypeIds: inputTypeIds,
        inputTokenIds: inputIds,
        inputTokenAmounts: inpuTokenAmounts
      });
      const id = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeId, tokenId);
      await expect(tx).to.emit(this.contracts[contract], EventsDependentCreator.TokenAncestrySet);
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts[contract].address,
          constants.AddressZero,
          this.contracts[contract].address,
          id,
          tokenUnitsToMint
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts[contract].address,
          constants.AddressZero,
          this.contracts[contract].address,
          tokenTypeId,
          tokenId,
          tokenUnitsToMint
        );

      // Burn events
      for (let i = 0; i < inputTypeIds.length; i++) {
        for (let j = 0; j < inputTypeIds[i].length; j++) {
          const inputId = await this.contracts[instructedTokenContracts[i]].bytesToIntTokenId(
            inputTypeIds[i][j],
            inputIds[i][j]
          );
          await expect(tx)
            .to.emit(this.contracts[instructedTokenContracts[i]], EventsERC1155.TransferSingle)
            .withArgs(
              this.contracts[contract].address,
              this.contracts[contract].address,
              constants.AddressZero,
              inputId,
              inpuTokenAmounts[i][j]
            );
        }
      }
    });

    it('minting a dependent token with a certificate/s in the instructions', async function () {
      const inputTokenAddresses = this.token.addressesCertificate.map((addr) => [addr]);
      const tx = await this.contracts[contractCertificate].mint(tokenTypeId, tokenId, tokenUnitsToMint, {
        inputTokenAddresses,
        inputTokenTypeIds: inputTypeIds,
        inputTokenIds: inputIds,
        inputTokenAmounts: inpuTokenAmounts
      });

      const id = await this.contracts[tokenContractCertificate].bytesToIntTokenId(tokenTypeId, tokenId);
      await expect(tx)
        .to.emit(this.contracts[tokenContractCertificate], EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts[contractCertificate].address,
          constants.AddressZero,
          this.contracts[contractCertificate].address,
          id,
          tokenUnitsToMint
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContractCertificate], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts[contractCertificate].address,
          constants.AddressZero,
          this.contracts[contractCertificate].address,
          tokenTypeId,
          tokenId,
          tokenUnitsToMint
        );
    });
  });

  context('fails', function () {
    it('if input addresses and ids lengths differ', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      await expect(
        this.contracts[contract].mint(tokenTypeId, tokenId, tokenUnitsToMint, {
          inputTokenAddresses,
          inputTokenTypeIds: inputTypeIdsNonCertified,
          inputTokenIds: [],
          inputTokenAmounts: inpuTokenAmounts
        })
      ).to.be.revertedWith(ErrorsValidationLibrary.InvalidArray);
    });

    it('if input addresses and type ids lengths differ', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      await expect(
        this.contracts[contract].mint(tokenTypeId, tokenId, tokenUnitsToMint, {
          inputTokenAddresses,
          inputTokenTypeIds: [],
          inputTokenIds: inputIdsNonCertified,
          inputTokenAmounts: inpuTokenAmounts
        })
      ).to.be.revertedWith(ErrorsValidationLibrary.InvalidArray);
    });

    it('if calling mint with a different array of contract addresses to the contract specification and a non-certified address', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      await expect(
        this.contracts[contractCertificate].mint(tokenTypeId, tokenId, tokenUnitsToMint, {
          inputTokenAddresses,
          inputTokenTypeIds: inputTypeIdsNonCertified,
          inputTokenIds: inputIdsNonCertified,
          inputTokenAmounts: inpuTokenAmounts
        })
      ).to.be.revertedWith(ErrorsValidationLibrary.InvalidInputToken);
    });

    it('if minting more units than available supply permits', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      await expect(
        this.contracts[contract].mint(tokenTypeId, tokenId, oobAmount, {
          inputTokenAddresses,
          inputTokenTypeIds: inputTypeIds,
          inputTokenIds: inputIds,
          inputTokenAmounts: inpuTokenAmounts
        })
      ).to.be.revertedWith(ErrorsValidationLibrary.InvalidAmount);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      await expect(
        this.contracts[contract].connect(this.signers.acc2).mint(tokenTypeId, tokenId, tokenUnitsToMint, {
          inputTokenAddresses,
          inputTokenTypeIds: inputTypeIds,
          inputTokenIds: inputIds,
          inputTokenAmounts: inpuTokenAmounts
        })
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
