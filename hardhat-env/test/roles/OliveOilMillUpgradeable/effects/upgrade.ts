import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';
import { upgrades } from 'hardhat';
import { deployOliveOilMillAndDeps } from '@shared/helpers';

export default function shouldUpgrade(
  actor: string,
  token: string,
  escrow: string,
  uri: string,
  opts: DeployProxyOptions,
  libs: string[]
): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const { oliveOilMill } = await deployOliveOilMillAndDeps(
        actor,
        token,
        escrow,
        uri,
        this.signers.deployer,
        opts,
        libs
      );
      await upgrades.upgradeProxy(oliveOilMill.proxy.address, oliveOilMill.factory, opts);
    });
  });
}
