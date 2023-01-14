import { expect } from 'chai';
import { ErrorsBaseEscrow, ErrorsOwnable } from 'hardhat-env/test/shared/errors';
import { EventsIndustrialUnitToken, EventsERC1155, EventsEscrow } from 'hardhat-env/test/shared/events';
import { StatesEscrow } from 'hardhat-env/test/shared/states';

export default function shouldBehaveLikeClose(
  escrowIds: number[],
  tokenIdEscrow0: string,
  tokenIdsEscrow1: string[],
  tokenAmountEscrow0: number,
  tokenAmountsEscrow1: number[],
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('closing the escrow, transfering token/s to the buyer and ether to the seller', async function () {
      const tx = await this.contracts.industrialUnitsEscrow.close(escrowIds[0]);
      const tx2 = await this.contracts.industrialUnitsEscrow.close(escrowIds[1]);
      const idEscrow0 = await this.contracts.palletToken.bytesToIntId(tokenIdEscrow0);
      const idsEscrow1 = await Promise.all(
        tokenIdsEscrow1.map(async (id) => {
          return await this.contracts.palletToken.bytesToIntId(id);
        })
      );
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.Closed)
        .withArgs(
          this.signers.deployer.address,
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
        .withArgs(escrowIds[0], this.signers.deployer.address, tokenPrice);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts.industrialUnitsEscrow.address,
          this.signers.acc2.address,
          idEscrow0,
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
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchTransferred)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts.industrialUnitsEscrow.address,
          this.signers.acc2.address,
          tokenIdsEscrow1,
          tokenAmountsEscrow1
        );
    });

    it('setting state of the contract to Closed', async function () {
      expect(await this.contracts.industrialUnitsEscrow.state(escrowIds[0])).to.be.equal(StatesEscrow.Closed);
    });
  });

  context('fails', function () {
    it('if state is not EtherDeposited', async function () {
      await expect(this.contracts.industrialUnitsEscrow.close(escrowIds[0])).to.be.revertedWith(
        ErrorsBaseEscrow.InvalidState
      );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.industrialUnitsEscrow.connect(this.signers.acc2).close(escrowIds[0])
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
