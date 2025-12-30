import { ethers } from 'hardhat';
import { baseUri, dictAccounts, dictContracts, dictInheritedModules, uupsOpts } from '@shared/constants';
import { deployDistributorAndDeps } from '@shared/helpers';
import { IDeployedActorAndDeps } from '@shared/types';

export async function deployDistributorCompanyAndDeps(): Promise<IDeployedActorAndDeps[]> {
  const distributorCompanyContractName = dictContracts.distributorCompany.v1;
  const distributorCompanyPalletContractName = dictContracts.distributorCompanyPallet.v1;
  const distributorCompanyEscrowContractName = dictContracts.distributorCompanyEscrow.v1;
  const signers = await ethers.getSigners();
  const { distributor, distributorPallet, distributorEscrow } = await deployDistributorAndDeps(
    distributorCompanyContractName,
    distributorCompanyPalletContractName,
    distributorCompanyEscrowContractName,
    baseUri,
    signers[dictAccounts.DistributorCompany],
    uupsOpts
  );
  return [
    {
      id: distributorCompanyContractName,
      address: distributor.proxy.address,
      blockNumber: distributor.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.distributorCompany.v1.distributor
    },
    {
      id: distributorCompanyPalletContractName,
      address: distributorPallet.proxy.address,
      blockNumber: distributorPallet.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.distributorCompany.v1.industrialUnitToken
    },
    {
      id: distributorCompanyEscrowContractName,
      address: distributorEscrow.proxy.address,
      blockNumber: distributorEscrow.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.distributorCompany.v1.industrialUnitsEscrow
    }
  ];
}
