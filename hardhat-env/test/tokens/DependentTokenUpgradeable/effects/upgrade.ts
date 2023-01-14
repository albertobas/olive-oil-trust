import { ethers, upgrades } from 'hardhat';
import { dictContracts } from 'hardhat-env/shared/constants';
import { DependentTokenUpgradeableContract } from 'hardhat-env/test/shared/types';

export default function shouldUpgrade(contract: DependentTokenUpgradeableContract): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const DependentTokenFactory = await ethers.getContractFactory(dictContracts.dependentTokenWithInit.v1);
      await upgrades.upgradeProxy(this.contracts[contract].address, DependentTokenFactory);
    });
  });
}
