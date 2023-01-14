import { baseUri, dictAccounts, dictContracts, dictInheritedModules, uupsLibOpts } from 'hardhat-env/shared/constants';
import { IDeployedActorAndDeps } from 'hardhat-env/shared/types';
import { deployBottlingPlantAndDeps } from 'hardhat-env/shared/helpers';
import { ethers } from 'hardhat';

export async function deployBottlingCompanyAndDeps(): Promise<IDeployedActorAndDeps[]> {
  const bottlingCompanyContractName = dictContracts.bottlingCompany.v1;
  const bottlingCompanyOliveOilBottleContractName = dictContracts.bottlingCompanyOliveOilBottle.v1;
  const bottlingCompanyPalletContractName = dictContracts.bottlingCompanyPallet.v1;
  const bottlingCompanyEscrowContractName = dictContracts.bottlingCompanyEscrow.v1;
  const signers = await ethers.getSigners();
  const { bottlingPlant, bottlingPlantOilBottle, bottlingPlantPallet, bottlingPlantEscrow } =
    await deployBottlingPlantAndDeps(
      bottlingCompanyContractName,
      bottlingCompanyOliveOilBottleContractName,
      bottlingCompanyPalletContractName,
      bottlingCompanyEscrowContractName,
      baseUri,
      signers[dictAccounts.BottlingCompany],
      uupsLibOpts,
      [dictContracts.validation.v1]
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
