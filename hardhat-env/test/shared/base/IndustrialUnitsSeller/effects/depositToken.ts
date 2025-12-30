import { expect } from 'chai';
import { ErrorsOwnable } from '@test/shared/errors';
import { EventsERC1155, EventsEscrow, EventsIndustrialUnitToken } from '@test/shared/events';
import { IndustrialUnitsSellerContract } from '@test/shared/types';

export default function shouldBehaveLikeDepositToken(
  contract: IndustrialUnitsSellerContract,
  escrowId: number,
  tokenId: string,
  tokenAmount: number,
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('depositing a token to the escrow', async function () {
      const tx = await this.contracts[contract].depositToken(tokenId, tokenPrice, this.signers.deployer.address);
      const id = await this.contracts.palletToken.bytesToIntId(tokenId);
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.TokenDeposited)
        .withArgs(
          this.contracts[contract].address,
          this.signers.deployer.address,
          escrowId,
          this.contracts.palletToken.address,
          tokenId,
          tokenPrice
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferSingle)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts[contract].address,
          this.contracts.industrialUnitsEscrow.address,
          id,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.TokenTransferred)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.contracts[contract].address,
          this.contracts.industrialUnitsEscrow.address,
          tokenId,
          tokenAmount
        );
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts[contract]
          .connect(this.signers.acc2)
          .depositToken(tokenId, tokenPrice, this.signers.deployer.address)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
