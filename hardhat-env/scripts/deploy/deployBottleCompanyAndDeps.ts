import { baseUri, dictAccounts, dictContracts, dictInheritedModules, uupsOpts } from '@shared/constants';
import { IDeployedActorAndDeps } from '@shared/types';
import { deployBottleManufacturerAndDeps } from '@shared/helpers';
import { ethers } from 'hardhat';

export async function deployBottleCompanyAndDeps(): Promise<IDeployedActorAndDeps[]> {
  const { bottleCompany, bottleCompanyBottle, bottleCompanyEscrow } = dictContracts;
  const bottleCompanyContractName = bottleCompany.v1;
  const bottleCompanyBottleContractName = bottleCompanyBottle.v1;
  const bottleCompanyEscrowContractName = bottleCompanyEscrow.v1;
  const signers = await ethers.getSigners();
  const { bottleManufacturer, bottleManufacturerBottle, bottleManufacturerEscrow } =
    await deployBottleManufacturerAndDeps(
      bottleCompanyContractName,
      bottleCompanyBottleContractName,
      bottleCompanyEscrowContractName,
      baseUri,
      signers[dictAccounts.BottleCompany],
      uupsOpts
    );
  return [
    {
      id: bottleCompanyContractName,
      address: bottleManufacturer.proxy.address,
      blockNumber: bottleManufacturer.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.bottleCompany.v1.bottleManufacturer
    },
    {
      id: bottleCompanyBottleContractName,
      address: bottleManufacturerBottle.proxy.address,
      blockNumber: bottleManufacturerBottle.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.bottleCompany.v1.independentToken
    },
    {
      id: bottleCompanyEscrowContractName,
      address: bottleManufacturerEscrow.proxy.address,
      blockNumber: bottleManufacturerEscrow.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.bottleCompany.v1.commercialUnitsEscrow
    }
  ];
}
