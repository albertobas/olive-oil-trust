import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsBaseEscrow, ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from 'hardhat-env/test/shared/events';
import { StatesEscrow } from 'hardhat-env/test/shared/states';
import { BaseEscrowContract, CreationTokenContract } from 'hardhat-env/test/shared/types';

export default function shouldBehaveLikeRevertBeforePayment(
  contract: BaseEscrowContract,
  tokenContract: CreationTokenContract,
  escrowIds: number[],
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[]
): void {
  context('succeeds', function () {
    it('reverting escrow before depositing ether and withdrawing tokens', async function () {
      const tx = await this.contracts[contract].revertBeforePayment(escrowIds[0]);
      const tx2 = await this.contracts[contract].revertBeforePayment(escrowIds[1]);
      const ids: BigNumber[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        ids[i] = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
      }
      await expect(tx)
        .to.emit(this.contracts[contract], EventsEscrow.RevertedBeforePayment)
        .withArgs(this.signers.deployer.address, escrowIds[0]);
      await expect(tx)
        .to.emit(this.contracts[contract], EventsEscrow.TokenWithdrawn)
        .withArgs(
          escrowIds[0],
          this.signers.deployer.address,
          this.contracts[tokenContract].address,
          tokenIds[0],
          tokenAmounts[0]
        );
      await expect(tx2)
        .to.emit(this.contracts[contract], EventsEscrow.TokensWithdrawn)
        .withArgs(
          escrowIds[1],
          this.signers.deployer.address,
          this.contracts[tokenContract].address,
          tokenIds,
          tokenAmounts
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts[contract].address,
          this.contracts[contract].address,
          this.signers.deployer.address,
          ids[0],
          tokenAmounts[0]
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts[contract].address,
          this.contracts[contract].address,
          this.signers.deployer.address,
          tokenTypeIds[0],
          tokenIds[0],
          tokenAmounts[0]
        );
      await expect(tx2)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts[contract].address,
          this.contracts[contract].address,
          this.signers.deployer.address,
          ids,
          tokenAmounts
        );
      await expect(tx2)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts[contract].address,
          this.contracts[contract].address,
          this.signers.deployer.address,
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        );
    });

    it('setting state of the contract to RevertedBeforePayment', async function () {
      expect(await this.contracts[contract].state(escrowIds[0])).to.be.equal(StatesEscrow.RevertedBeforePayment);
    });
  });

  context('fails', function () {
    it('if state is not Active', async function () {
      await expect(this.contracts[contract].revertBeforePayment(escrowIds[0])).to.be.revertedWith(
        ErrorsBaseEscrow.InvalidState
      );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract].connect(this.signers.acc2).revertBeforePayment(escrowIds[0])
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
