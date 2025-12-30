import { baseUri, dictAccounts, dictContracts, dictInheritedModules, uupsOpts } from '@shared/constants';
import { IDeployedActorAndDeps } from '@shared/types';
import { deployBottleManufacturerAndDeps } from '@shared/helpers';
import { ethers } from 'hardhat';

export async function deployBottleCompany2AndDeps(): Promise<IDeployedActorAndDeps[]> {
  const bottleCompany2ContractName = dictContracts.bottleCompany2.v1;
  const bottleCompany2BottleContractName = dictContracts.bottleCompany2Bottle.v1;
  const bottleCompany2EscrowContractName = dictContracts.bottleCompany2Escrow.v1;
  const signers = await ethers.getSigners();
  const { bottleManufacturer, bottleManufacturerBottle, bottleManufacturerEscrow } =
    await deployBottleManufacturerAndDeps(
      bottleCompany2ContractName,
      bottleCompany2BottleContractName,
      bottleCompany2EscrowContractName,
      baseUri,
      signers[dictAccounts.BottleCompany2],
      uupsOpts
    );
  return [
    {
      id: bottleCompany2ContractName,
      address: bottleManufacturer.proxy.address,
      blockNumber: bottleManufacturer.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.bottleCompany2.v1.bottleManufacturer
    },
    {
      id: bottleCompany2BottleContractName,
      address: bottleManufacturerBottle.proxy.address,
      blockNumber: bottleManufacturerBottle.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.bottleCompany2.v1.independentToken
    },
    {
      id: bottleCompany2EscrowContractName,
      address: bottleManufacturerEscrow.proxy.address,
      blockNumber: bottleManufacturerEscrow.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.bottleCompany2.v1.commercialUnitsEscrow
    }
  ];
}
