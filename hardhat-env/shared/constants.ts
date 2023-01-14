import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';

export const baseUri = 'ipfs://ipfsHash/{id}.json';

export const uupsOpts: DeployProxyOptions = { kind: 'uups' };
export const uupsLibOpts: DeployProxyOptions = { ...uupsOpts, unsafeAllow: ['external-library-linking'] };

export const dictChainActorsNames = {
  certifier: { id1: 'Certifier Company' },
  oliveGrower: { id1: 'Olive Grower One' },
  bottleManufacturer: { id1: 'Bottle Company' },
  oliveOilMill: { id1: 'Olive Oil Mill Company' },
  bottlingPlant: { id1: 'Bottling Company' },
  distributor: { id1: 'Distributor Company' },
  retailer: { id1: 'Retailer Company' }
};

export const dictContracts = {
  certifier: { v1: 'CertifierUpgradeable' },
  oliveGrower: { v1: 'OliveGrowerUpgradeable' },
  bottleManufacturer: { v1: 'BottleManufacturerUpgradeable' },
  oliveOilMill: { v1: 'OliveOilMillUpgradeable' },
  bottlingPlant: { v1: 'BottlingPlantUpgradeable' },
  distributor: { v1: 'DistributorUpgradeable' },
  retailer: { v1: 'RetailerUpgradeable' },
  endCustomer: { v1: 'EndCustomerUpgradeable' },
  certificate: { v1: 'CertificateUpgradeable' },
  dependentToken: { v1: 'DependentTokenUpgradeable' },
  independentToken: { v1: 'IndependentTokenUpgradeable' },
  industrialUnitToken: { v1: 'IndustrialUnitTokenUpgradeable' },
  agriculturalEscrow: { v1: 'AgriculturalEscrowUpgradeable' },
  commercialUnitsEscrow: { v1: 'CommercialUnitsEscrowUpgradeable' },
  industrialUnitsEscrow: { v1: 'IndustrialUnitsEscrowUpgradeable' },
  certifierWithInit: { v1: 'CertifierUpgradeableWithInit' },
  oliveGrowerWithInit: { v1: 'OliveGrowerUpgradeableWithInit' },
  bottleManufacturerWithInit: { v1: 'BottleManufacturerUpgradeableWithInit' },
  oliveOilMillWithInit: { v1: 'OliveOilMillUpgradeableWithInit' },
  bottlingPlantWithInit: { v1: 'BottlingPlantUpgradeableWithInit' },
  distributorWithInit: { v1: 'DistributorUpgradeableWithInit' },
  retailerWithInit: { v1: 'RetailerUpgradeableWithInit' },
  endCustomerWithInit: { v1: 'EndCustomerUpgradeableWithInit' },
  certificateWithInit: { v1: 'CertificateUpgradeableWithInit' },
  dependentTokenWithInit: { v1: 'DependentTokenUpgradeableWithInit' },
  independentTokenWithInit: { v1: 'IndependentTokenUpgradeableWithInit' },
  industrialUnitTokenWithInit: { v1: 'IndustrialUnitTokenUpgradeableWithInit' },
  agriculturalEscrowWithInit: { v1: 'AgriculturalEscrowUpgradeableWithInit' },
  commercialUnitsEscrowWithInit: { v1: 'CommercialUnitsEscrowUpgradeableWithInit' },
  industrialUnitsEscrowWithInit: { v1: 'IndustrialUnitsEscrowUpgradeableWithInit' },
  certifierCompany: { v1: 'CertifierCompany' },
  certifierCompanyCertificate: { v1: 'CertifierCompanyCertificate' },
  oliveGrowerOne: { v1: 'OliveGrowerOne' },
  oliveGrowerOneOlives: { v1: 'OliveGrowerOneOlives' },
  oliveGrowerOneEscrow: { v1: 'OliveGrowerOneEscrow' },
  bottleCompany: { v1: 'BottleCompany' },
  bottleCompanyBottle: { v1: 'BottleCompanyBottle' },
  bottleCompanyEscrow: { v1: 'BottleCompanyEscrow' },
  bottleCompany2: { v1: 'BottleCompany2' },
  bottleCompany2Bottle: { v1: 'BottleCompany2Bottle' },
  bottleCompany2Escrow: { v1: 'BottleCompany2Escrow' },
  oliveOilMillCompany: { v1: 'OliveOilMillCompany' },
  oliveOilMillCompanyOliveOil: { v1: 'OliveOilMillCompanyOliveOil' },
  oliveOilMillCompanyEscrow: { v1: 'OliveOilMillCompanyEscrow' },
  bottlingCompany: { v1: 'BottlingCompany' },
  bottlingCompanyOliveOilBottle: { v1: 'BottlingCompanyOliveOilBottle' },
  bottlingCompanyPallet: { v1: 'BottlingCompanyPallet' },
  bottlingCompanyEscrow: { v1: 'BottlingCompanyEscrow' },
  distributorCompany: { v1: 'DistributorCompany' },
  distributorCompanyPallet: { v1: 'DistributorCompanyPallet' },
  distributorCompanyEscrow: { v1: 'DistributorCompanyEscrow' },
  retailerCompany: { v1: 'RetailerCompany' },
  retailerCompanyEscrow: { v1: 'RetailerCompanyEscrow' },
  endCustomerOne: { v1: 'EndCustomerOne' },
  validation: { v1: 'Validation' }
};

export const dictInheritedModules = {
  certifierCompany: { v1: { certifier: dictContracts.certifier.v1, certificate: dictContracts.certificate.v1 } },
  oliveGrowerOne: {
    v1: {
      oliveGrower: dictContracts.oliveGrower.v1,
      independentToken: dictContracts.independentToken.v1,
      agriculturalEscrow: dictContracts.agriculturalEscrow.v1
    }
  },
  bottleCompany: {
    v1: {
      bottleManufacturer: dictContracts.bottleManufacturer.v1,
      independentToken: dictContracts.independentToken.v1,
      commercialUnitsEscrow: dictContracts.commercialUnitsEscrow.v1
    }
  },
  bottleCompany2: {
    v1: {
      bottleManufacturer: dictContracts.bottleManufacturer.v1,
      independentToken: dictContracts.independentToken.v1,
      commercialUnitsEscrow: dictContracts.commercialUnitsEscrow.v1
    }
  },
  oliveOilMillCompany: {
    v1: {
      oliveOilMill: dictContracts.oliveOilMill.v1,
      dependentToken: dictContracts.dependentToken.v1,
      commercialUnitsEscrow: dictContracts.commercialUnitsEscrow.v1
    }
  },
  bottlingCompany: {
    v1: {
      bottlingPlant: dictContracts.bottlingPlant.v1,
      dependentToken: dictContracts.dependentToken.v1,
      industrialUnitToken: dictContracts.industrialUnitToken.v1,
      industrialUnitsEscrow: dictContracts.industrialUnitsEscrow.v1
    }
  },
  distributorCompany: {
    v1: {
      distributor: dictContracts.distributor.v1,
      industrialUnitToken: dictContracts.industrialUnitToken.v1,
      industrialUnitsEscrow: dictContracts.industrialUnitsEscrow.v1
    }
  },
  retailerCompany: {
    v1: {
      retailer: dictContracts.retailer.v1,
      commercialUnitsEscrow: dictContracts.commercialUnitsEscrow.v1
    }
  }
};

export const dictAccounts = {
  BottleCompany: 0,
  BottlingCompany: 1,
  CertifierCompany: 2,
  DistributorCompany: 3,
  OliveGrowerOne: 4,
  OliveOilMillCompany: 5,
  RetailerCompany: 6,
  EndCustomerOne: 7,
  BottleCompany2: 8
};
