import { ethers, upgrades } from 'hardhat';
import { dictContracts } from 'hardhat-env/shared/constants';

export default function shouldUpgrade(): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const EscrowFactory = await ethers.getContractFactory(dictContracts.commercialUnitsEscrowWithInit.v1);
      await upgrades.upgradeProxy(this.contracts.commercialUnitsEscrow.address, EscrowFactory);
    });
  });
}
