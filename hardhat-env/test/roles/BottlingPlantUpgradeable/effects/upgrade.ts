import { deployBottlingPlantAndDeps } from '@shared/helpers';
import { upgrades } from 'hardhat';
import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';

export default function shouldUpgrade(
  actor: string,
  dependentToken: string,
  industrialUnitToken: string,
  escrow: string,
  uri: string,
  opts: DeployProxyOptions,
  validationLib: string
): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const { bottlingPlant } = await deployBottlingPlantAndDeps(
        actor,
        dependentToken,
        industrialUnitToken,
        escrow,
        validationLib,
        uri,
        this.signers.deployer,
        opts
      );
      await upgrades.upgradeProxy(bottlingPlant.proxy.address, bottlingPlant.factory, opts);
    });
  });
}
