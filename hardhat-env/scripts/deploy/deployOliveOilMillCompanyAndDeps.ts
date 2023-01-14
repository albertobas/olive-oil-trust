import { ethers } from 'hardhat';
import { baseUri, dictAccounts, dictContracts, dictInheritedModules, uupsLibOpts } from 'hardhat-env/shared/constants';
import { deployOliveOilMillAndDeps } from 'hardhat-env/shared/helpers';
import { IDeployedActorAndDeps } from 'hardhat-env/shared/types';

export async function deployOliveOilMillCompanyAndDeps(): Promise<IDeployedActorAndDeps[]> {
  const oliveOilMillCompanyContractName = dictContracts.oliveOilMillCompany.v1;
  const oliveOilMillCompanyOliveOilContractName = dictContracts.oliveOilMillCompanyOliveOil.v1;
  const oliveOilMillCompanyEscrowContractName = dictContracts.oliveOilMillCompanyEscrow.v1;
  const signers = await ethers.getSigners();
  const { oliveOilMill, oliveOilMillOil, oliveOilMillEscrow } = await deployOliveOilMillAndDeps(
    oliveOilMillCompanyContractName,
    oliveOilMillCompanyOliveOilContractName,
    oliveOilMillCompanyEscrowContractName,
    baseUri,
    signers[dictAccounts.OliveOilMillCompany],
    uupsLibOpts,
    [dictContracts.validation.v1]
  );
  return [
    {
      id: oliveOilMillCompanyContractName,
      address: oliveOilMill.proxy.address,
      blockNumber: oliveOilMill.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.oliveOilMillCompany.v1.oliveOilMill
    },
    {
      id: oliveOilMillCompanyOliveOilContractName,
      address: oliveOilMillOil.proxy.address,
      blockNumber: oliveOilMillOil.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.oliveOilMillCompany.v1.dependentToken
    },
    {
      id: oliveOilMillCompanyEscrowContractName,
      address: oliveOilMillEscrow.proxy.address,
      blockNumber: oliveOilMillEscrow.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.oliveOilMillCompany.v1.commercialUnitsEscrow
    }
  ];
}
