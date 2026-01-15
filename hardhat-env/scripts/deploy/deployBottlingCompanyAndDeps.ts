import { baseUri, dictAccounts, dictContracts, dictInheritedModules, uupsLibOpts } from '@shared/constants';
import { IDeployedActorAndDeps } from '@shared/types';
import { deployBottlingPlantAndDeps } from '@shared/helpers';
import { ethers } from 'hardhat';

export async function deployBottlingCompanyAndDeps(): Promise<IDeployedActorAndDeps[]> {
  const { bottlingCompany, bottlingCompanyOliveOilBottle, bottlingCompanyPallet, bottlingCompanyEscrow, validation } =
    dictContracts;
  const bottlingCompanyContractName = bottlingCompany.v1;
  const bottlingCompanyOliveOilBottleContractName = bottlingCompanyOliveOilBottle.v1;
  const bottlingCompanyPalletContractName = bottlingCompanyPallet.v1;
  const bottlingCompanyEscrowContractName = bottlingCompanyEscrow.v1;
  const signers = await ethers.getSigners();
  const { bottlingPlant, bottlingPlantOilBottle, bottlingPlantPallet, bottlingPlantEscrow } =
    await deployBottlingPlantAndDeps(
      bottlingCompanyContractName,
      bottlingCompanyOliveOilBottleContractName,
      bottlingCompanyPalletContractName,
      bottlingCompanyEscrowContractName,
      validation.v1,
      baseUri,
      signers[dictAccounts.BottlingCompany],
      uupsLibOpts
    );
  return [
    {
      id: bottlingCompanyContractName,
      address: bottlingPlant.proxy.address,
      blockNumber: bottlingPlant.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.bottlingCompany.v1.bottlingPlant
    },
    {
      id: bottlingCompanyOliveOilBottleContractName,
      address: bottlingPlantOilBottle.proxy.address,
      blockNumber: bottlingPlantOilBottle.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.bottlingCompany.v1.dependentToken
    },
    {
      id: bottlingCompanyPalletContractName,
      address: bottlingPlantPallet.proxy.address,
      blockNumber: bottlingPlantPallet.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.bottlingCompany.v1.industrialUnitToken
    },
    {
      id: bottlingCompanyEscrowContractName,
      address: bottlingPlantEscrow.proxy.address,
      blockNumber: bottlingPlantEscrow.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.bottlingCompany.v1.industrialUnitsEscrow
    }
  ];
}
