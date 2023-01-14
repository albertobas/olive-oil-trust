import { ethers, upgrades } from 'hardhat';
import { dictContracts } from 'hardhat-env/shared/constants';

export default function shouldUpgrade(): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const Certificate = await ethers.getContractFactory(dictContracts.certificateWithInit.v1, this.signers.acc2);
      await upgrades.upgradeProxy(this.contracts.certificate.address, Certificate);
    });
  });
}
