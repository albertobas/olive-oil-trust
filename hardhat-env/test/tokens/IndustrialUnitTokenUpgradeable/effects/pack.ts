import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsOwnable, ErrorsIndustrialUnitTokenUpgradeable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsIndustrialUnitToken } from 'hardhat-env/test/shared/events';
import { bytes32Data } from 'hardhat-env/test/shared/constants';

export default function shouldBehaveLikePack(
  palletId: string,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[]
): void {
  context('succeeds', function () {
    it('packing a pallet', async function () {
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      const addresses = [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address];
      const tx = await this.contracts.palletToken.pack(
        this.signers.deployer.address,
        palletId,
        addresses,
        tokenTypeIds,
        tokenIds,
        tokenAmounts
      );
      const intPalletId = await this.contracts.palletToken.bytesToIntId(palletId);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.SinglePacked)
        .withArgs(this.signers.deployer.address, palletId, addresses, tokenTypeIds, tokenIds, tokenAmounts);
      for (let i = 0; i < tokenIds.length; i++) {
        const intTokenId = await this.contracts.oliveOilBottleToken.bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
        await expect(tx)
          .to.emit(this.contracts.oliveOilBottleToken, EventsERC1155.TransferSingle)
          .withArgs(
            this.contracts.palletToken.address,
            this.signers.deployer.address,
            this.contracts.palletToken.address,
            intTokenId,
            tokenAmounts[i]
          );
        await expect(tx)
          .to.emit(this.contracts.oliveOilBottleToken, EventsBaseToken.TokenTransferred)
          .withArgs(
            this.contracts.palletToken.address,
            this.signers.deployer.address,
            this.contracts.palletToken.address,
            tokenTypeIds[i],
            tokenIds[i],
            tokenAmounts[i]
          );
      }
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferSingle)
        .withArgs(this.signers.deployer.address, constants.AddressZero, this.signers.deployer.address, intPalletId, 1);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.TokenTransferred)
        .withArgs(this.signers.deployer.address, constants.AddressZero, this.signers.deployer.address, palletId, 1);
    });
  });

  context('fails', function () {
    it("if packing a pallet with invalid arrays' lengths", async function () {
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      await expect(
        this.contracts.palletToken.pack(
          this.signers.deployer.address,
          palletId,
          [this.contracts.oliveOilBottleToken.address],
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitTokenUpgradeable.InvalidArray);
    });

    it('if packing a pallet with an id that already exists', async function () {
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      await this.contracts.palletToken.pack(
        this.signers.deployer.address,
        palletId,
        [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address],
        tokenTypeIds,
        tokenIds,
        tokenAmounts
      );
      await expect(
        this.contracts.palletToken.pack(
          this.signers.deployer.address,
          palletId,
          [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address],
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitTokenUpgradeable.DuplicatedId);
    });

    it('if packing a pallet but failing to have the required items', async function () {
      const id_ = await this.contracts.oliveOilBottleToken.bytesToIntTokenId(tokenTypeIds[0], tokenIds[0]);
      const balanceId0 = await this.contracts.oliveOilBottleToken.balanceOf(this.signers.deployer.address, id_);
      await this.contracts.oliveOilBottleToken.safeTransferFrom(
        this.signers.deployer.address,
        this.signers.acc2.address,
        id_,
        balanceId0,
        bytes32Data
      );
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      await expect(
        this.contracts.palletToken.pack(
          this.signers.deployer.address,
          palletId,
          [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address],
          tokenTypeIds,
          tokenIds,
          tokenAmounts
        )
      ).to.be.revertedWith(ErrorsIndustrialUnitTokenUpgradeable.InvalidBalance);
    });
  });

  context('modifiers', function () {
    it('onlyOwner', async function () {
      await this.contracts.oliveOilBottleToken.setApprovalForAll(this.contracts.palletToken.address, true);
      await expect(
        this.contracts.palletToken
          .connect(this.signers.acc2)
          .pack(
            this.signers.deployer.address,
            palletId,
            [this.contracts.oliveOilBottleToken.address, this.contracts.oliveOilBottleToken.address],
            tokenTypeIds,
            tokenIds,
            tokenAmounts
          )
      ).to.be.revertedWith(ErrorsOwnable.InvalidCaller);
    });
  });
}
