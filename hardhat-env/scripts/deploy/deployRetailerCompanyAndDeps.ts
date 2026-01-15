import { ethers } from 'hardhat';
import { dictAccounts, dictContracts, dictInheritedModules } from '@shared/constants';
import { deployRetailerAndDeps } from '@shared/helpers';
import { IDeployedActorAndDeps } from '@shared/types';

export async function deployRetailerCompanyAndDeps(): Promise<IDeployedActorAndDeps[]> {
  const { retailerCompany, retailerCompanyEscrow } = dictContracts;
  const retailerCompanyContractName = retailerCompany.v1;
  const retailerCompanyEscrowContractName = retailerCompanyEscrow.v1;
  const signers = await ethers.getSigners();
  const { retailer, retailerEscrow } = await deployRetailerAndDeps(
    retailerCompanyContractName,
    retailerCompanyEscrowContractName,
    signers[dictAccounts.RetailerCompany]
  );
  return [
    {
      id: retailerCompanyContractName,
      address: retailer.proxy.address,
      blockNumber: retailer.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.retailerCompany.v1.retailer
    },
    {
      id: retailerCompanyEscrowContractName,
      address: retailerEscrow.proxy.address,
      blockNumber: retailerEscrow.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.retailerCompany.v1.commercialUnitsEscrow
    }
  ];
}
