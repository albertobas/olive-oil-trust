import { deployCertifierAndDeps } from 'hardhat-env/shared/helpers';
import { upgrades } from 'hardhat';
import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';

export default function shouldUpgrade(actor: string, certificate: string, uri: string, opts: DeployProxyOptions): void {
  context('succeeds', function () {
    it('upgrading', async function () {
      const { certifier } = await deployCertifierAndDeps(actor, certificate, uri, this.signers.deployer, opts);
      await upgrades.upgradeProxy(certifier.proxy.address, certifier.factory, opts);
    });
  });
}
