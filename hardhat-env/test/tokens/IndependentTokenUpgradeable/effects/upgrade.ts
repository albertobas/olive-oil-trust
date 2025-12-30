import { ethers, upgrades } from 'hardhat';
import { dictContracts } from '@shared/constants';
import { IndependentTokenUpgradeableContract } from '@test/shared/types';

export default function shouldUpgrade(contract: IndependentTokenUpgradeableContract): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const IndependentTokenFactory = await ethers.getContractFactory(dictContracts.independentTokenWithInit.v1);
      await upgrades.upgradeProxy(this.contracts[contract].address, IndependentTokenFactory);
    });
  });
}
