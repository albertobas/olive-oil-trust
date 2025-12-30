import { expect } from 'chai';
import { ErrorsBaseEscrow, ErrorsOwnable } from '@test/shared/errors';
import { EventsERC1155, EventsEscrow, EventsIndustrialUnitToken } from '@test/shared/events';
import { StatesEscrow } from '@test/shared/states';

export default function shouldBehaveLikeRevertBeforePayment(
  escrowIds: number[],
  tokenIdEscrow0: string,
  tokenIdsEscrow1: string[],
  tokenAmountEscrow0: number,
  tokenAmountsEscrow1: number[]
): void {
  context('succeeds', function () {
    it('reverting escrow before depositing ether and withdrawing tokens', async function () {
      const tx = await this.contracts.industrialUnitsEscrow.revertBeforePayment(escrowIds[0]);
      const tx2 = await this.contracts.industrialUnitsEscrow.revertBeforePayment(escrowIds[1]);
      const idEscrow0 = await this.contracts.palletToken.bytesToIntId(tokenIdEscrow0);
      const idsEscrow1 = await Promise.all(
        tokenIdsEscrow1.map(async (id) => {
          return await this.contracts.palletToken.bytesToIntId(id);
        })
      );
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.RevertedBeforePayment)
        .withArgs(this.signers.deployer.address, escrowIds[0]);
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.TokenWithdrawn)
        .withArgs(escrowIds[0], this.signers.deployer.address, this.contracts.palletToken.address, tokenIdEscrow0);
      await expect(tx2)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.TokensWithdrawn)
        .withArgs(escrowIds[1], this.signers.deployer.address, this.contracts.palletToken.address, tokenIdsEscrow1);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts.industrialUnitsEscrow.address,
          this.signers.deployer.address,
          idEscrow0,
          tokenAmountEscrow0
        );
      await expect(tx2)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferBatch)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts.industrialUnitsEscrow.address,
          this.signers.deployer.address,
          idsEscrow1,
          tokenAmountsEscrow1
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.TokenTransferred)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts.industrialUnitsEscrow.address,
          this.signers.deployer.address,
          tokenIdEscrow0,
          tokenAmountEscrow0
        );
      await expect(tx2)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.BatchTransferred)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts.industrialUnitsEscrow.address,
          this.signers.deployer.address,
          tokenIdsEscrow1,
          tokenAmountsEscrow1
        );
    });

    it('setting state of the contract to RevertedBeforePayment', async function () {
      expect(await this.contracts.industrialUnitsEscrow.state(escrowIds[0])).to.be.equal(
        StatesEscrow.RevertedBeforePayment
      );
    });
  });

  context('fails', function () {
    it('if state is not Active', async function () {
      await expect(this.contracts.industrialUnitsEscrow.revertBeforePayment(escrowIds[0])).to.be.revertedWith(
        ErrorsBaseEscrow.InvalidState
      );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.industrialUnitsEscrow.connect(this.signers.acc2).revertBeforePayment(escrowIds[0])
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
