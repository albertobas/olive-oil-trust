import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';
import { upgrades } from 'hardhat';
import { deployRetailerAndDeps } from 'hardhat-env/shared/helpers';

export default function shouldUpgrade(actor: string, escrow: string, opts: DeployProxyOptions): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const { retailer } = await deployRetailerAndDeps(actor, escrow, this.signers.deployer);
      await upgrades.upgradeProxy(retailer.proxy.address, retailer.factory, opts);
    });
  });
}
