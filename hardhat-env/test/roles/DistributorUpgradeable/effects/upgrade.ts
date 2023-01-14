import { deployDistributorAndDeps } from 'hardhat-env/shared/helpers';
import { upgrades } from 'hardhat';
import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';

export default function shouldUpgrade(
  actor: string,
  token: string,
  escrow: string,
  uri: string,
  opts: DeployProxyOptions
): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const { distributor } = await deployDistributorAndDeps(actor, token, escrow, uri, this.signers.deployer, opts);
      await upgrades.upgradeProxy(distributor.proxy.address, distributor.factory, opts);
    });
  });
}
