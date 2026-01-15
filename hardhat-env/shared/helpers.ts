import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';
import { Contract, ContractFactory, Signer } from 'ethers';
import { ethers, upgrades } from 'hardhat';

interface Deploy {
  name: string;
  signer: Signer;
  args?: unknown[];
  opts?: DeployProxyOptions;
  libs?: string[];
}

interface IDeploymentWithUpgrades {
  proxy: Contract;
  factory: ContractFactory;
}

async function getLibraries(signer: Signer, libraries: string[]): Promise<Record<string, string>> {
  const librariesObj: Record<string, string> = {};
  for (const lib of libraries) {
    librariesObj[lib] = (await deploy(lib, signer)).address;
  }
  return librariesObj;
}
export async function deployWithUpgrades({ name, signer, args, opts, libs }: Deploy): Promise<IDeploymentWithUpgrades> {
  const libraries = typeof libs !== 'undefined' ? await getLibraries(signer, libs) : undefined;
  const factory = await ethers.getContractFactory(name, { signer, libraries });
  const proxy = await upgrades.deployProxy(factory, args, opts);
  await proxy.deployed();
  return { proxy, factory };
}
export async function deploy(name: string, signer: Signer, args?: any[], libs?: string[]): Promise<Contract> {
  const libraries = typeof libs !== 'undefined' ? await getLibraries(signer, libs) : undefined;
  const contractFactory = await ethers.getContractFactory(name, { signer, libraries });
  const contract = args != null ? await contractFactory.deploy(...args) : await contractFactory.deploy();
  await contract.deployed();
  return contract;
}

export async function deployBottleManufacturerAndDeps(
  bottleManufacturerContractName: string,
  bottleManufacturerBottleContractName: string,
  bottleManufacturerEscrowContractName: string,
  uri: string,
  signer: Signer,
  opts: DeployProxyOptions
): Promise<{
  bottleManufacturer: IDeploymentWithUpgrades;
  bottleManufacturerBottle: IDeploymentWithUpgrades;
  bottleManufacturerEscrow: IDeploymentWithUpgrades;
}> {
  // deploy token, escrow and actor
  const bottleManufacturerBottle = await deployWithUpgrades({
    name: bottleManufacturerBottleContractName,
    signer,
    args: [uri]
  });
  const bottleManufacturerEscrow = await deployWithUpgrades({
    name: bottleManufacturerEscrowContractName,
    signer
  });
  const bottleManufacturer = await deployWithUpgrades({
    name: bottleManufacturerContractName,
    signer,
    args: [bottleManufacturerBottle.proxy.address, bottleManufacturerEscrow.proxy.address],
    opts
  });
  // transfer ownerships
  await bottleManufacturerBottle.proxy.transferOwnership(bottleManufacturer.proxy.address);
  await bottleManufacturerEscrow.proxy.transferOwnership(bottleManufacturer.proxy.address);
  return { bottleManufacturer, bottleManufacturerBottle, bottleManufacturerEscrow };
}

export async function deployBottlingPlantAndDeps(
  bottlingPlantContractName: string,
  bottlingPlantOilBottleContractName: string,
  bottlingPlantPalletContractName: string,
  bottlingPlantEscrowContractName: string,
  validationLib: string,
  uri: string,
  signer: Signer,
  opts: DeployProxyOptions
): Promise<{
  bottlingPlant: IDeploymentWithUpgrades;
  bottlingPlantOilBottle: IDeploymentWithUpgrades;
  bottlingPlantPallet: IDeploymentWithUpgrades;
  bottlingPlantEscrow: IDeploymentWithUpgrades;
}> {
  // deploy token, escrow and actor
  const bottlingPlantOilBottle = await deployWithUpgrades({
    name: bottlingPlantOilBottleContractName,
    signer,
    args: [uri]
  });
  const bottlingPlantPallet = await deployWithUpgrades({
    name: bottlingPlantPalletContractName,
    signer,
    args: [uri]
  });
  const bottlingPlantEscrow = await deployWithUpgrades({
    name: bottlingPlantEscrowContractName,
    signer
  });
  const bottlingPlant = await deployWithUpgrades({
    name: bottlingPlantContractName,
    signer,
    args: [bottlingPlantOilBottle.proxy.address, bottlingPlantPallet.proxy.address, bottlingPlantEscrow.proxy.address],
    opts,
    libs: [validationLib]
  });
  // transfer ownerships
  await bottlingPlantOilBottle.proxy.transferOwnership(bottlingPlant.proxy.address);
  await bottlingPlantPallet.proxy.transferOwnership(bottlingPlant.proxy.address);
  await bottlingPlantEscrow.proxy.transferOwnership(bottlingPlant.proxy.address);
  return { bottlingPlant, bottlingPlantOilBottle, bottlingPlantPallet, bottlingPlantEscrow };
}

export async function deployCertifierAndDeps(
  certifierContractName: string,
  certifierCertificateContractName: string,
  uri: string,
  signer: Signer,
  opts: DeployProxyOptions
): Promise<{
  certifier: IDeploymentWithUpgrades;
  certifierCertificate: IDeploymentWithUpgrades;
}> {
  // deploy certificate and certifier
  const certifierCertificate = await deployWithUpgrades({
    name: certifierCertificateContractName,
    signer,
    args: [uri],
    opts
  });
  const certifier = await deployWithUpgrades({
    name: certifierContractName,
    signer,
    args: [certifierCertificate.proxy.address],
    opts
  });
  // transfer ownerships
  await certifierCertificate.proxy.transferOwnership(certifier.proxy.address);
  return { certifier, certifierCertificate };
}

export async function deployDistributorAndDeps(
  distributorContractName: string,
  distributorPalletContractName: string,
  distributorEscrowContractName: string,
  uri: string,
  signer: Signer,
  opts: DeployProxyOptions
): Promise<{
  distributor: IDeploymentWithUpgrades;
  distributorPallet: IDeploymentWithUpgrades;
  distributorEscrow: IDeploymentWithUpgrades;
}> {
  const distributorPallet = await deployWithUpgrades({
    name: distributorPalletContractName,
    args: [uri],
    signer
  });
  const distributorEscrow = await deployWithUpgrades({
    name: distributorEscrowContractName,
    signer
  });
  const distributor = await deployWithUpgrades({
    name: distributorContractName,
    signer,
    args: [distributorPallet.proxy.address, distributorEscrow.proxy.address],
    opts
  });
  // transfer ownerships
  await distributorPallet.proxy.transferOwnership(distributor.proxy.address);
  await distributorEscrow.proxy.transferOwnership(distributor.proxy.address);
  return { distributor, distributorPallet, distributorEscrow };
}

export async function deployOliveGrowerAndDeps(
  oliveGrowerContractName: string,
  oliveGrowerOlivesContractName: string,
  oliveGrowerEscrowContractName: string,
  uri: string,
  signer: Signer,
  opts: DeployProxyOptions
): Promise<{
  oliveGrower: IDeploymentWithUpgrades;
  oliveGrowerOlives: IDeploymentWithUpgrades;
  oliveGrowerEscrow: IDeploymentWithUpgrades;
}> {
  const oliveGrowerOlives = await deployWithUpgrades({
    name: oliveGrowerOlivesContractName,
    signer,
    args: [uri]
  });
  const oliveGrowerEscrow = await deployWithUpgrades({
    name: oliveGrowerEscrowContractName,
    signer
  });
  const oliveGrower = await deployWithUpgrades({
    name: oliveGrowerContractName,
    signer,
    args: [oliveGrowerOlives.proxy.address, oliveGrowerEscrow.proxy.address],
    opts
  });
  // transfer ownerships
  await oliveGrowerOlives.proxy.transferOwnership(oliveGrower.proxy.address);
  await oliveGrowerEscrow.proxy.transferOwnership(oliveGrower.proxy.address);
  return { oliveGrower, oliveGrowerOlives, oliveGrowerEscrow };
}

export async function deployOliveOilMillAndDeps(
  oliveOilMillContractName: string,
  oliveOilMillOilContractName: string,
  oliveOilMillEscrowContractName: string,
  validationLib: string,
  uri: string,
  signer: Signer,
  opts: DeployProxyOptions
): Promise<{
  oliveOilMill: IDeploymentWithUpgrades;
  oliveOilMillOil: IDeploymentWithUpgrades;
  oliveOilMillEscrow: IDeploymentWithUpgrades;
}> {
  const oliveOilMillOil = await deployWithUpgrades({
    name: oliveOilMillOilContractName,
    signer,
    args: [uri]
  });
  const oliveOilMillEscrow = await deployWithUpgrades({
    name: oliveOilMillEscrowContractName,
    signer
  });
  const oliveOilMill = await deployWithUpgrades({
    name: oliveOilMillContractName,
    signer,
    args: [oliveOilMillOil.proxy.address, oliveOilMillEscrow.proxy.address],
    opts,
    libs: [validationLib]
  });
  // transfer ownerships
  await oliveOilMillOil.proxy.transferOwnership(oliveOilMill.proxy.address);
  await oliveOilMillEscrow.proxy.transferOwnership(oliveOilMill.proxy.address);
  return { oliveOilMill, oliveOilMillOil, oliveOilMillEscrow };
}

export async function deployRetailerAndDeps(
  retailerContractName: string,
  retailerEscrowContractName: string,
  signer: Signer
): Promise<{
  retailer: IDeploymentWithUpgrades;
  retailerEscrow: IDeploymentWithUpgrades;
}> {
  const retailerEscrow = await deployWithUpgrades({
    name: retailerEscrowContractName,
    signer
  });
  const retailer = await deployWithUpgrades({
    name: retailerContractName,
    signer,
    args: [retailerEscrow.proxy.address]
  });
  // transfer ownerships
  await retailerEscrow.proxy.transferOwnership(retailer.proxy.address);
  return { retailer, retailerEscrow };
}
