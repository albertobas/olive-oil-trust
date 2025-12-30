import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsOwnable } from '@test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsEscrow } from '@test/shared/events';
import { CreationTokenContract, BaseSellerContract } from '@test/shared/types';

export default function shouldBehaveLikeRevertAfterPayment(
  contract: BaseSellerContract,
  tokenContract: CreationTokenContract,
  escrowIds: number[],
  tokenTypeIdEscrow0: string,
  tokenIdEscrow0: string,
  tokenTypeIdsEscrow1: string[],
  tokenIdsEscrow1: string[],
  tokenAmountEscrow0: number,
  tokenAmountsEscrow1: number[],
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('reverting after a payment, withdrawing token or tokens and sending back ether to buyer candidate', async function () {
      const price = BigNumber.from(tokenPrice);
      const tx = await this.contracts[contract].revertAfterPayment(escrowIds[0]);
      const tx2 = await this.contracts[contract].revertAfterPayment(escrowIds[1]);
      const idEscrow0 = await this.contracts[tokenContract].bytesToIntTokenId(tokenTypeIdEscrow0, tokenIdEscrow0);
      const idsEscrow1: BigNumber[] = [];
      for (let i = 0; i < tokenIdsEscrow1.length; i++) {
        idsEscrow1[i] = await this.contracts[tokenContract].bytesToIntTokenId(
          tokenTypeIdsEscrow1[i],
          tokenIdsEscrow1[i]
        );
      }
      await expect(tx)
        .to.emit(this.contracts.commercialUnitsEscrow, EventsEscrow.RevertedAfterPayment)
        .withArgs(this.contracts[contract].address, this.signers.acc2.address, escrowIds[0], price);
      await expect(tx)
        .to.emit(this.contracts.commercialUnitsEscrow, EventsEscrow.TokenWithdrawn)
        .withArgs(
          escrowIds[0],
          this.contracts[contract].address,
          this.contracts[tokenContract].address,
          tokenIdEscrow0,
          tokenAmountEscrow0
        );
      await expect(tx2)
        .to.emit(this.contracts.commercialUnitsEscrow, EventsEscrow.TokensWithdrawn)
        .withArgs(
          escrowIds[1],
          this.contracts[contract].address,
          this.contracts[tokenContract].address,
          tokenIdsEscrow1,
          tokenAmountsEscrow1
        );
      await expect(tx)
        .to.emit(this.contracts.commercialUnitsEscrow, EventsEscrow.EtherWithdrawn)
        .withArgs(escrowIds[0], this.signers.acc3.address, price);
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.contracts.commercialUnitsEscrow.address,
          this.contracts[contract].address,
          idEscrow0,
          tokenAmountEscrow0
        );
      await expect(tx)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.TokenTransferred)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.contracts.commercialUnitsEscrow.address,
          this.contracts[contract].address,
          tokenTypeIdEscrow0,
          tokenIdEscrow0,
          tokenAmountEscrow0
        );
      await expect(tx2)
        .to.emit(this.contracts[tokenContract], EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.contracts.commercialUnitsEscrow.address,
          this.contracts[contract].address,
          idsEscrow1,
          tokenAmountsEscrow1
        );
      await expect(tx2)
        .to.emit(this.contracts[tokenContract], EventsBaseToken.BatchTransferred)
        .withArgs(
          this.contracts.commercialUnitsEscrow.address,
          this.contracts.commercialUnitsEscrow.address,
          this.contracts[contract].address,
          tokenTypeIdsEscrow1,
          tokenIdsEscrow1,
          tokenAmountsEscrow1
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract].connect(this.signers.acc2).revertAfterPayment(escrowIds[0])
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
