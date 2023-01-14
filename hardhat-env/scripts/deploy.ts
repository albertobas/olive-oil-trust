import { artifacts, network, upgrades } from 'hardhat';
import { deployCertifierCompanyAndDeps } from 'hardhat-env/scripts/deploy/deployCertifierCompanyAndDeps';
import { deployOliveGrowerOneAndDeps } from 'hardhat-env/scripts/deploy/deployOliveGrowerOneAndDeps';
import { deployBottleCompanyAndDeps } from 'hardhat-env/scripts/deploy/deployBottleCompanyAndDeps';
import { deployOliveOilMillCompanyAndDeps } from 'hardhat-env/scripts/deploy/deployOliveOilMillCompanyAndDeps';
import { deployBottlingCompanyAndDeps } from 'hardhat-env/scripts/deploy/deployBottlingCompanyAndDeps';
import { deployDistributorCompanyAndDeps } from 'hardhat-env/scripts/deploy/deployDistributorCompanyAndDeps';
import { deployRetailerCompanyAndDeps } from 'hardhat-env/scripts/deploy/deployRetailerCompanyAndDeps';
import { deployBottleCompany2AndDeps } from 'hardhat-env/scripts/deploy/deployBottleCompany2AndDeps';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

async function main(): Promise<void> {
  if (network.name === 'hardhat') {
    console.warn(
      'The contract has been deployed to the Hardhat Network, so it got automatically created ' +
        "and destroyed. Use the Hardhat option '--network localhost'"
    );
  }
  console.log(
    "Silencing warnings after getting 'Warning: A proxy admin was previously deployed on this network'.\n" +
      'Deploy scripts 4, 5, 6 and 7 deploy both transparent and UUPS proxies and openzeppelin warns us\n' +
      'that changes in administration of transparent proxies have no effect on UUPS proxies.'
  );
  upgrades.silenceWarnings();
  const deploymentsPath = join(__dirname, '../deployments', network.name);
  await Promise.all([
    deployCertifierCompanyAndDeps(),
    deployOliveGrowerOneAndDeps(),
    deployBottleCompanyAndDeps(),
    deployBottleCompany2AndDeps(),
    deployOliveOilMillCompanyAndDeps(),
    deployBottlingCompanyAndDeps(),
    deployDistributorCompanyAndDeps(),
    deployRetailerCompanyAndDeps()
  ])
    .then((deploymentArray) => {
      const deployments = deploymentArray.flat();
      for (let i = 0; i < deployments.length; i++) {
        if (network.name !== 'hardhat') {
          const deploymentPath = join(deploymentsPath, deployments[i].id + '.json');
          const artifact = artifacts.readArtifactSync(deployments[i].id);
          const deployment = {
            address: deployments[i].address,
            contractName: artifact.contractName,
            module: deployments[i].module,
            startBlock: deployments[i].blockNumber,
            abi: artifact.abi,
            bytecode: artifact.bytecode,
            deployedBytecode: artifact.deployedBytecode
          };
          if (!existsSync(deploymentsPath)) {
            mkdirSync(deploymentsPath, { recursive: true });
          }
          writeFileSync(deploymentPath, JSON.stringify(deployment, undefined, 2));
        }
        console.log(`  ✓ ${deployments[i].id} deployed at: ${deployments[i].address}`);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  if (network.name !== 'hardhat' && typeof network.config.chainId !== 'undefined') {
    const chainId = join(__dirname, '../deployments', network.name, '.chainId.txt');
    if (!existsSync(deploymentsPath)) {
      mkdirSync(deploymentsPath, { recursive: true });
    }
    writeFileSync(chainId, network.config.chainId.toString());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
