import { ethers, upgrades } from 'hardhat';
import { dictContracts } from '@shared/constants';

export default function shouldUpgrade(): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const IndustrialUnitTokenFactory = await ethers.getContractFactory(dictContracts.industrialUnitTokenWithInit.v1);
      await upgrades.upgradeProxy(this.contracts.palletToken.address, IndustrialUnitTokenFactory);
    });
  });
}
