import { expect } from 'chai';
import { BigNumber, constants } from 'ethers';
import { ErrorsDependentCreator, ErrorsOwnable, ErrorsValidationLibrary } from '@test/shared/errors';
import {
  DependentCreatorContract,
  DependentTokenUpgradeableContract,
  IndependentTokenUpgradeableContract
} from '@test/shared/types';
import { EventsBaseToken, EventsDependentCreator, EventsERC1155 } from '@test/shared/events';

export default function shouldBehaveLikeMintBatch(
  contract: DependentCreatorContract,
  contractCertificate: DependentCreatorContract,
  tokenContract: DependentTokenUpgradeableContract,
  instructedTokenContracts: Array<DependentTokenUpgradeableContract | IndependentTokenUpgradeableContract>,
  tokenContractCertificate: DependentTokenUpgradeableContract,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenUnitsToMint: number[],
  inputTypeIds: string[][][],
  inputIds: string[][][],
  inputTypeIdsNonCertified: string[][][],
  inputIdsNonCertified: string[][][],
  inpuTokenAmounts: BigNumber[][][],
  oobAmount: number
): void {
  context('succeeds', function () {
    it('minting multiple dependent tokens', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      const tx = await this.contracts[contract].mintBatch(tokenTypeIds, tokenIds, tokenUnitsToMint, [
        {
          inputTokenAddresses,
          inputTokenTypeIds: inputTypeIds[0],
          inputTokenIds: inputIds[0],
          inputTokenAmounts: inpuTokenAmounts[0]
        },
        {
          inputTokenAddresses,
          inputTokenTypeIds: inputTypeIds[1],
          inputTokenIds: inputIds[1],
          inputTokenAmounts: inpuTokenAmounts[1]
        }
      ]);
      const ids: BigNumber[] = [];
      for (let i = 0; i < inputTypeIds.length; i++) {
        await expect(tx).to.emit(this.contracts[contract], EventsDependentCreator.TokenAncestrySet);
        ids.push(await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]));
        // Burn events
        for (let j = 0; j < inputTypeIds[i].length; j++) {
          for (let k = 0; k < inputTypeIds[i][j].length; k++) {
            const inputId = await this.contracts[instructedTokenContracts[j]].bytesToIntTokenId(
              inputTypeIds[i][j][k],
              inputIds[i][j][k]
            );
            await expect(tx)
              .to.emit(this.contracts[instructedTokenContracts[j]], EventsERC1155.TransferSingle)
              .withArgs(
                this.contracts[contract].address,
                this.contracts[contract].address,
                constants.AddressZero,
                inputId,
                inpuTokenAmounts[i][j][k]
              );
          }
        }
      }

      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts[contract].address,
          constants.AddressZero,
          this.contracts[contract].address,
          ids,
          tokenUnitsToMint
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts[contract].address,
          constants.AddressZero,
          this.contracts[contract].address,
          tokenTypeIds,
          tokenIds,
          tokenUnitsToMint
        );
    });

    it('minting a dependent token with a certificate/s in the instructions', async function () {
      const inputTokenAddresses = this.token.addressesCertificate.map((addr) => [addr]);
      const tx = await this.contracts[contractCertificate].mintBatch(tokenTypeIds, tokenIds, tokenUnitsToMint, [
        {
          inputTokenAddresses,
          inputTokenTypeIds: inputTypeIds[0],
          inputTokenIds: inputIds[0],
          inputTokenAmounts: inpuTokenAmounts[0]
        },
        {
          inputTokenAddresses,
          inputTokenTypeIds: inputTypeIds[1],
          inputTokenIds: inputIds[1],
          inputTokenAmounts: inpuTokenAmounts[1]
        }
      ]);
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts[tokenContractCertificate].bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      await expect(tx)
        .to.emit(this.contracts[tokenContractCertificate], EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts[contractCertificate].address,
          constants.AddressZero,
          this.contracts[contractCertificate].address,
          ids,
          tokenUnitsToMint
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContractCertificate], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts[contractCertificate].address,
          constants.AddressZero,
          this.contracts[contractCertificate].address,
          tokenTypeIds,
          tokenIds,
          tokenUnitsToMint
        );
    });
  });

  context('fails', function () {
    it('if an array of the arguments has a length that differs from the rest', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      await expect(
        this.contracts[contract].mintBatch(tokenTypeIds, [tokenIds[0]], tokenUnitsToMint, [
          {
            inputTokenAddresses,
            inputTokenTypeIds: inputTypeIds[0],
            inputTokenIds: inputIds[0],
            inputTokenAmounts: inpuTokenAmounts[0]
          },
          {
            inputTokenAddresses,
            inputTokenTypeIds: inputTypeIds[1],
            inputTokenIds: inputIds[1],
            inputTokenAmounts: inpuTokenAmounts[1]
          }
        ])
      ).to.be.revertedWith(ErrorsDependentCreator.InvalidArray);
    });

    it('if an array of the data struct has a length that differs from the rest', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      await expect(
        this.contracts[contract].mintBatch(tokenTypeIds, tokenIds, tokenUnitsToMint, [
          {
            inputTokenAddresses,
            inputTokenTypeIds: [],
            inputTokenIds: inputIds[0],
            inputTokenAmounts: inpuTokenAmounts[0]
          },
          {
            inputTokenAddresses,
            inputTokenTypeIds: [],
            inputTokenIds: inputIds[1],
            inputTokenAmounts: inpuTokenAmounts[1]
          }
        ])
      ).to.be.revertedWith(ErrorsValidationLibrary.InvalidArray);
    });

    it('if calling mint with a different array of contract addresses to the contract specification and a non-certified address', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      await expect(
        this.contracts[contractCertificate].mintBatch(tokenTypeIds, tokenIds, tokenUnitsToMint, [
          {
            inputTokenAddresses,
            inputTokenTypeIds: inputTypeIdsNonCertified[0],
            inputTokenIds: inputIdsNonCertified[0],
            inputTokenAmounts: inpuTokenAmounts[0]
          },
          {
            inputTokenAddresses,
            inputTokenTypeIds: inputTypeIdsNonCertified[1],
            inputTokenIds: inputIdsNonCertified[1],
            inputTokenAmounts: inpuTokenAmounts[1]
          }
        ])
      ).to.be.revertedWith(ErrorsValidationLibrary.InvalidInputToken);
    });

    it('if minting more units than available supply permits', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      await expect(
        this.contracts[contract].mintBatch(
          tokenTypeIds,
          tokenIds,
          [oobAmount, oobAmount],
          [
            {
              inputTokenAddresses,
              inputTokenTypeIds: inputTypeIds[0],
              inputTokenIds: inputIds[0],
              inputTokenAmounts: inpuTokenAmounts[0]
            },
            {
              inputTokenAddresses,
              inputTokenTypeIds: inputTypeIds[1],
              inputTokenIds: inputIds[1],
              inputTokenAmounts: inpuTokenAmounts[1]
            }
          ]
        )
      ).to.be.revertedWith(ErrorsValidationLibrary.InvalidAmount);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      const inputTokenAddresses = this.token.addresses.map((addr) => [addr]);
      await expect(
        this.contracts[contract].connect(this.signers.acc2).mintBatch(tokenTypeIds, tokenIds, tokenUnitsToMint, [
          {
            inputTokenAddresses,
            inputTokenTypeIds: inputTypeIds[0],
            inputTokenIds: inputIds[0],
            inputTokenAmounts: inpuTokenAmounts[0]
          },
          {
            inputTokenAddresses,
            inputTokenTypeIds: inputTypeIds[1],
            inputTokenIds: inputIds[1],
            inputTokenAmounts: inpuTokenAmounts[1]
          }
        ])
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
