import { deployOliveGrowerAndDeps } from '@shared/helpers';
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
      const { oliveGrower } = await deployOliveGrowerAndDeps(actor, token, escrow, uri, this.signers.deployer, opts);
      await upgrades.upgradeProxy(oliveGrower.proxy.address, oliveGrower.factory, opts);
    });
  });
}
