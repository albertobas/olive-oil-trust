import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { artifacts, ethers } from 'hardhat';
import { join } from 'path';
import { dictAccounts } from '@shared/constants';
import { IDeployedContractsJson } from '@shared/types';
import globby = require('globby');

interface IAccountRecord {
  [signerAddress: string]: { address: string; moduleId: string; name: string } | null;
}
interface IAccount {
  [chainId: string]: IAccountRecord;
}
async function share(): Promise<void> {
  const deploymentsPath = join(__dirname, '../deployments');
  if (!existsSync(deploymentsPath)) {
    throw new Error('No deployments folder');
  }
  const networksList = readdirSync(deploymentsPath);
  if (networksList.length === 0) {
    throw new Error('There have been no deployments so far');
  }
  const hardhatContractsTypePath = join(__dirname, '../types');
  const reactContractsPath = join(__dirname, '../../next-app/src/generated/contracts');
  const reactContractsJsonPath = join(reactContractsPath, 'hardhat_contracts.json');
  const reactAccountsJsonPath = join(reactContractsPath, 'accounts.json');
  const reactContractsTypesPath = join(__dirname, '../../next-app/src/generated/types');
  const subgraphAbisPath = join(__dirname, '../../subgraph/src/generated/abis');
  const subgraphConfigPath = join(__dirname, '../../subgraph/src/generated/config');
  const typesList = globby.sync([
    hardhatContractsTypePath + '/contracts/members/*.ts',
    hardhatContractsTypePath + '/contracts/certificates/*.ts',
    hardhatContractsTypePath + '/contracts/escrows/*.ts',
    hardhatContractsTypePath + '/contracts/tokens/*.ts',
    '!' + hardhatContractsTypePath + '/**/index.ts'
  ]);
  const deployedContractsJson: IDeployedContractsJson = {};
  const accountsJson: IAccount = {};
  const signers = await ethers.getSigners();
  const signerList = signers.slice(0, Object.keys(dictAccounts).length).map((signer) => signer.address);
  for (let i = 0; i < networksList.length; i++) {
    const deploymentsNetworkPath = join(deploymentsPath, networksList[i]);
    const contractsJsonsList = readdirSync(deploymentsNetworkPath).filter((path) => /\.json$/.test(path));
    if (contractsJsonsList.length === 0) {
      throw new Error('There have been no deployments so far');
    }
    const chainId = readFileSync(join(deploymentsNetworkPath, '.chainId.txt'), 'utf-8');
    if (!Object.keys(deployedContractsJson).includes(chainId)) {
      deployedContractsJson[chainId] = [];
    }
    if (!Object.keys(accountsJson).includes(chainId)) {
      accountsJson[chainId] = {};
    }
    const subgraphConfigJsonPath = join(subgraphConfigPath, networksList[i] + '.json');
    let configSubgraph = { network: networksList[i] };
    const configReact = { name: networksList[i], chainId, contracts: {} };
    let configContracts = {};
    const accountsMembers: IAccountRecord = {};
    for (let j = 0; j < contractsJsonsList.length; j++) {
      const contractJson = JSON.parse(readFileSync(join(deploymentsNetworkPath, contractsJsonsList[j]), 'utf-8'));
      const contractName = contractJson.contractName;
      const contractSlug = contractsJsonsList[j].replace(/\.json/, '');
      const typePath = typesList.filter((path) => path.includes(contractName))[0];
      const typePathArray = typePath.split('/');
      configContracts = {
        ...configContracts,
        [contractSlug]: { address: contractJson.address, abi: contractJson.abi }
      };
      // write types to front-end workspace
      const reactContractTypePath = join(
        reactContractsTypesPath,
        ...typePath.split('/').slice(typePathArray.length - 3, typePathArray.length - 1)
      );
      const reactContractTypeFilePath = join(reactContractTypePath, (contractName as string) + '.ts');
      const typeData = readFileSync(typePath, 'utf8');
      if (!existsSync(reactContractTypeFilePath)) {
        if (!existsSync(reactContractTypePath)) {
          mkdirSync(reactContractTypePath, { recursive: true });
        }
        writeFileSync(reactContractTypeFilePath, typeData);
      }
      // write abi to subgraph workspace
      const subgraphAbiPath = join(subgraphAbisPath, (contractJson.module as string) + '.json');
      if (!existsSync(subgraphAbiPath)) {
        if (!existsSync(subgraphAbisPath)) {
          mkdirSync(subgraphAbisPath, { recursive: true });
        }
        const artifact = artifacts.readArtifactSync(contractJson.module);
        writeFileSync(subgraphAbiPath, JSON.stringify(artifact, null, 2));
      }
      // populate network config file
      configSubgraph = {
        ...configSubgraph,
        [contractSlug + 'Address']: contractJson.address,
        [contractSlug + 'StartBlock']: contractJson.startBlock,
        [contractSlug + 'Module']: contractJson.module
      };
      if (
        !contractSlug.endsWith('Bottle') &&
        !contractSlug.endsWith('Olives') &&
        !contractSlug.endsWith('OliveOil') &&
        !contractSlug.endsWith('Certificate') &&
        !contractSlug.endsWith('Escrow') &&
        !contractSlug.endsWith('Pallet')
      ) {
        const signerIdx = dictAccounts[contractSlug as keyof typeof dictAccounts];
        const signerAddress = signerList[signerIdx].toLowerCase();
        accountsMembers[signerAddress] = {
          address: contractJson.address.toLowerCase(),
          moduleId: contractJson.module,
          name: contractSlug
        };
      }
    }
    // write abi to subgraph workspace
    if (!existsSync(subgraphConfigPath)) {
      mkdirSync(subgraphConfigPath, { recursive: true });
    }
    writeFileSync(subgraphConfigJsonPath, JSON.stringify(configSubgraph, null, 2));
    // populate config for front-end
    configReact.contracts = configContracts;
    accountsJson[chainId] = accountsMembers;
    deployedContractsJson[chainId].push(configReact);
  }
  // write contracts json to front-end workspace
  if (!existsSync(reactContractsPath)) {
    mkdirSync(reactContractsPath, { recursive: true });
  }
  writeFileSync(reactContractsJsonPath, JSON.stringify(deployedContractsJson, null, 2));
  writeFileSync(reactAccountsJsonPath, JSON.stringify(accountsJson, null, 2));
  // write common.ts file to front-end workspace
  const contractTypeCommon = 'common.ts';
  const contractTypeCommonPath = join(reactContractsTypesPath, contractTypeCommon);
  const typeCommonData = readFileSync(join(hardhatContractsTypePath, contractTypeCommon), 'utf8');
  writeFileSync(contractTypeCommonPath, typeCommonData);
  console.log(`  ✓ Contracts types have been copied to ${reactContractsTypesPath}`);
  console.log(`  ✓ Contracts ABIs have been copied to ${subgraphAbisPath}`);
  console.log(
    `  ✓ A network config JSON file has been populated for every deployment network with the contracts' addresses, modules and start blocks and copied to ${subgraphConfigPath}`
  );
  console.log(
    `  ✓ Accounts addresses and contract addresses and ABIs for every chain have been copied to ${reactContractsPath}`
  );
  console.log(`  ✓ Contract type required module common.ts copied to ${reactContractsTypesPath}`);
}

share()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
