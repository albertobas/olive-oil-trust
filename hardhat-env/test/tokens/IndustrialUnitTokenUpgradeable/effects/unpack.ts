import { expect } from 'chai';
import { constants } from 'ethers';
import { ErrorsIndustrialUnitTokenUpgradeable } from 'hardhat-env/test/shared/errors';
import { EventsBaseToken, EventsERC1155, EventsIndustrialUnitToken } from 'hardhat-env/test/shared/events';
import { bytes32Data } from 'hardhat-env/test/shared/constants';

export default function shouldBehaveLikeUnpack(
  palletId: string,
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[]
): void {
  context('succeeds', function () {
    it('unpacking a pallet', async function () {
      const tx = await this.contracts.palletToken.unpack(this.signers.deployer.address, palletId);
      for (let i = 0; i < tokenIds.length; i++) {
        const intTokenId = await this.contracts.oliveOilBottleToken.bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
        await expect(tx)
          .to.emit(this.contracts.oliveOilBottleToken, EventsERC1155.TransferSingle)
          .withArgs(
            this.contracts.palletToken.address,
            this.contracts.palletToken.address,
            this.signers.deployer.address,
            intTokenId,
            tokenAmounts[i]
          );
        await expect(tx)
          .to.emit(this.contracts.oliveOilBottleToken, EventsBaseToken.TokenTransferred)
          .withArgs(
            this.contracts.palletToken.address,
            this.contracts.palletToken.address,
            this.signers.deployer.address,
            tokenTypeIds[i],
            tokenIds[i],
            tokenAmounts[i]
          );
      }
      const intPalletId = await this.contracts.palletToken.bytesToIntId(palletId);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsERC1155.TransferSingle)
        .withArgs(this.signers.deployer.address, this.signers.deployer.address, constants.AddressZero, intPalletId, 1);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.TokenTransferred)
        .withArgs(this.signers.deployer.address, this.signers.deployer.address, constants.AddressZero, palletId, 1);
      await expect(tx)
        .to.emit(this.contracts.palletToken, EventsIndustrialUnitToken.SingleUnpacked)
        .withArgs(this.signers.deployer.address, palletId);
    });
  });

  context('fails', function () {
    it('if caller is not the tokens owner', async function () {
      await expect(this.contracts.palletToken.unpack(this.signers.acc2.address, palletId)).to.be.revertedWith(
        ErrorsIndustrialUnitTokenUpgradeable.InvalidCaller
      );
    });

    it('if unpacking a pallet but failing to have the ownership', async function () {
      const id_ = await this.contracts.palletToken.bytesToIntId(palletId);
      const balanceId = await this.contracts.palletToken.balanceOf(this.signers.deployer.address, id_);
      await this.contracts.palletToken.safeTransferFrom(
        this.signers.deployer.address,
        this.signers.acc2.address,
        id_,
        balanceId,
        bytes32Data
      );
      await expect(this.contracts.palletToken.unpack(this.signers.deployer.address, palletId)).to.be.revertedWith(
        ErrorsIndustrialUnitTokenUpgradeable.InvalidBalance
      );
    });
  });
}
