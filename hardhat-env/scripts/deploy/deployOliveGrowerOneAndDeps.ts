import { ethers } from 'hardhat';
import { baseUri, dictAccounts, dictContracts, dictInheritedModules, uupsOpts } from '@shared/constants';
import { deployOliveGrowerAndDeps } from '@shared/helpers';
import { IDeployedActorAndDeps } from '@shared/types';

export async function deployOliveGrowerOneAndDeps(): Promise<IDeployedActorAndDeps[]> {
  const { oliveGrowerOne, oliveGrowerOneEscrow, oliveGrowerOneOlives } = dictContracts;
  const oliveGrowerOneContractName = oliveGrowerOne.v1;
  const oliveGrowerOneOlivesContractName = oliveGrowerOneOlives.v1;
  const oliveGrowerOneEscrowContractName = oliveGrowerOneEscrow.v1;
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
