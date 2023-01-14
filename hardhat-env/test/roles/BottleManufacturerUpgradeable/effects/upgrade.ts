import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';
import { upgrades } from 'hardhat';
import { deployBottleManufacturerAndDeps } from 'hardhat-env/shared/helpers';

export default function shouldUpgrade(
  actor: string,
  token: string,
  escrow: string,
  uri: string,
  opts: DeployProxyOptions
): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const { bottleManufacturer } = await deployBottleManufacturerAndDeps(
        actor,
        token,
        escrow,
        uri,
        this.signers.deployer,
        opts
      );
      await upgrades.upgradeProxy(bottleManufacturer.proxy.address, bottleManufacturer.factory, opts);
    });
  });
}
