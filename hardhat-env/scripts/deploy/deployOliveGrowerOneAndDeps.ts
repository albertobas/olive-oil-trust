import { ethers } from 'hardhat';
import { baseUri, dictAccounts, dictContracts, dictInheritedModules, uupsOpts } from 'hardhat-env/shared/constants';
import { deployOliveGrowerAndDeps } from 'hardhat-env/shared/helpers';
import { IDeployedActorAndDeps } from 'hardhat-env/shared/types';

export async function deployOliveGrowerOneAndDeps(): Promise<IDeployedActorAndDeps[]> {
  const oliveGrowerOneContractName = dictContracts.oliveGrowerOne.v1;
  const oliveGrowerOneOlivesContractName = dictContracts.oliveGrowerOneOlives.v1;
  const oliveGrowerOneEscrowContractName = dictContracts.oliveGrowerOneEscrow.v1;
  const signers = await ethers.getSigners();
  const { oliveGrower, oliveGrowerOlives, oliveGrowerEscrow } = await deployOliveGrowerAndDeps(
    oliveGrowerOneContractName,
    oliveGrowerOneOlivesContractName,
    oliveGrowerOneEscrowContractName,
    baseUri,
    signers[dictAccounts.OliveGrowerOne],
    uupsOpts
  );
  return [
    {
      id: oliveGrowerOneContractName,
      address: oliveGrower.proxy.address,
      blockNumber: oliveGrower.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.oliveGrowerOne.v1.oliveGrower
    },
    {
      id: oliveGrowerOneOlivesContractName,
      address: oliveGrowerOlives.proxy.address,
      blockNumber: oliveGrowerOlives.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.oliveGrowerOne.v1.independentToken
    },
    {
      id: oliveGrowerOneEscrowContractName,
      address: oliveGrowerEscrow.proxy.address,
      blockNumber: oliveGrowerEscrow.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.oliveGrowerOne.v1.agriculturalEscrow
    }
  ];
}
