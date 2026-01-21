import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsBaseEscrow, ErrorsIndustrialUnitsEscrowUpgradeable, ErrorsOwnable } from '@test/shared/errors';
import { EventsERC1155, EventsEscrow, EventsIndustrialUnitToken } from '@test/shared/events';

export default function shouldBehaveLikeDepositToken(
  escrowId: number,
  tokenId: string,
  tokenAmount: number,
  tokenPrice: string
): void {
  context('succeeds', function () {
    it('depositing a token to the escrow', async function () {
      const id = await this.contracts.palletToken.bytesToIntId(tokenId);
      await this.contracts.palletToken.setApprovalForAll(this.contracts.industrialUnitsEscrow.address, true);
      const tx = await this.contracts.industrialUnitsEscrow.depositToken(
        this.contracts.palletToken.address,
        tokenId,
        tokenPrice,
        this.signers.deployer.address
      );
      await expect(tx)
        .to.emit(this.contracts.industrialUnitsEscrow, EventsEscrow.TokenDeposited)
        .withArgs(
          this.signers.deployer.address,
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
          this.signers.deployer.address,
          this.contracts.industrialUnitsEscrow.address,
          id,
          tokenAmount
        );
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.TokenTransferred)
        .withArgs(
          this.contracts.industrialUnitsEscrow.address,
          this.signers.deployer.address,
          this.contracts.industrialUnitsEscrow.address,
          tokenId,
          tokenAmount
        );
    });
  });

  context('fails', function () {
    it('if either tokenAddress or sellerWallet are the zero address', async function () {
      await this.contracts.palletToken.setApprovalForAll(this.contracts.industrialUnitsEscrow.address, true);
      await expect(
        this.contracts.industrialUnitsEscrow.depositToken(
          constants.AddressZero,
          tokenId,
          tokenPrice,
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsBaseEscrow.InvalidAddress);
      await expect(
        this.contracts.industrialUnitsEscrow.depositToken(
          this.contracts.palletToken.address,
          tokenId,
          tokenPrice,
          constants.AddressZero
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitsEscrowUpgradeable.InvalidAddress);
    });

    it('if setting token price to zero', async function () {
      await expect(
        this.contracts.industrialUnitsEscrow.depositToken(
          this.contracts.palletToken.address,
          tokenId,
          '0',
          this.signers.deployer.address
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitsEscrowUpgradeable.InvalidPrice);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await expect(
        this.contracts.industrialUnitsEscrow
          .connect(this.signers.acc2)
          .depositToken(this.contracts.palletToken.address, tokenId, tokenPrice, this.signers.deployer.address)
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
