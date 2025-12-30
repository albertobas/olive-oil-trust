import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ErrorsOwnable } from '@test/shared/errors';
import { EventsERC1155, EventsEscrow, EventsIndustrialUnitToken } from '@test/shared/events';
import { IndustrialUnitsSellerContract } from '@test/shared/types';

export default function shouldBehaveLikeCloseEscrow(
  contract: IndustrialUnitsSellerContract,
  escrowIds: number[],
  tokenIdEscrow0: string,
  tokenIdsEscrow1: string[],
  tokenAmountEscrow0: number,
  tokenAmountsEscrow1: number[],
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('closing the escrow, sending the token or tokens to the buyer and sending ether to the seller', async function () {
      const price = BigNumber.from(tokenPrice);
      const tx = await this.contracts[contract].closeEscrow(escrowIds[0]);
      const tx2 = await this.contracts[contract].closeEscrow(escrowIds[1]);
      const idEscrow0 = await this.contracts.palletToken.bytesToIntId(tokenIdEscrow0);
      const idsEscrow1 = await Promise.all(
        tokenIdsEscrow1.map(async (id) => {
          return await this.contracts.palletToken.bytesToIntId(id);
        })
      );
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.Closed)
        .withArgs(
          this.contracts[contract].address,
          this.signers.acc2.address,
          this.signers.deployer.address,
          escrowIds[0],
          tokenPrice
        );
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.TokenWithdrawn)
        .withArgs(escrowIds[0], this.signers.acc2.address, this.contracts.palletToken.address, tokenIdEscrow0);
      await expect(tx2)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.TokensWithdrawn)
        .withArgs(escrowIds[1], this.signers.acc2.address, this.contracts.palletToken.address, tokenIdsEscrow1);
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.EtherWithdrawn)
        .withArgs(escrowIds[0], this.signers.deployer.address, price);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts.industrialUnitsEscrow.address,
          this.signers.acc2.address,
          idEscrow0,
          tokenAmountEscrow0
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.TokenTransferred)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts.industrialUnitsEscrow.address,
          this.signers.acc2.address,
          tokenIdEscrow0,
          tokenAmountEscrow0
        );
      await expect(tx2)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts.industrialUnitsEscrow.address,
          this.signers.acc2.address,
          idsEscrow1,
          tokenAmountsEscrow1
        );
      await expect(tx2)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchTransferred)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts.industrialUnitsEscrow.address,
          this.signers.acc2.address,
          tokenIdsEscrow1,
          tokenAmountsEscrow1
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(this.contracts[contract].connect(this.signers.acc2).closeEscrow(escrowIds[0])).to.be.revertedWith(
        ErrorsOwnable.InvalidCaller
      );
    });
  });
}
