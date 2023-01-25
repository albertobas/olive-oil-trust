import { Module } from 'next-app/src/shared/utils/interfaces';

export const brandName = 'Olive Oil Trust';

export const roles = {
  OliveGrower: 'Olive Grower',
  BottleManufacturer: 'Bottle Manufacturer',
  OliveOilMill: 'Olive Oil Mill',
  BottlingPlant: 'Bottling Plant',
  Distributor: 'Distributor',
  Retailer: 'Retailer'
};

export const modules = {
  BOTTLE_MANUFACTURER: 'BottleManufacturerUpgradeable',
  BOTTLING_PLANT: 'BottlingPlantUpgradeable',
  CERTIFIER: 'CertifierUpgradeable',
  DISTRIBUTOR: 'DistributorUpgradeable',
  OLIVE_GROWER: 'OliveGrowerUpgradeable',
  OLIVE_OIL_MILL: 'OliveOilMillUpgradeable',
  RETAILER: 'RetailerUpgradeable'
} as const;

export const isBottleManufacturer = (moduleId: Module): boolean => moduleId === modules.BOTTLE_MANUFACTURER;
export const isBottlingPlant = (moduleId: Module): boolean => moduleId === modules.BOTTLING_PLANT;
export const isCertifier = (moduleId: Module): boolean => moduleId === modules.CERTIFIER;
export const isDistributor = (moduleId: Module): boolean => moduleId === modules.DISTRIBUTOR;
export const isOliveGrower = (moduleId: Module): boolean => moduleId === modules.OLIVE_GROWER;
export const isOliveOilMill = (moduleId: Module): boolean => moduleId === modules.OLIVE_OIL_MILL;
export const isRetailer = (moduleId: Module): boolean => moduleId === modules.RETAILER;

export const isIndependentCreator = (moduleId: Module): boolean =>
  moduleId == modules.OLIVE_GROWER || moduleId == modules.BOTTLE_MANUFACTURER;

export const isDependentCreator = (moduleId: Module): boolean =>
  moduleId == modules.OLIVE_OIL_MILL || moduleId == modules.BOTTLING_PLANT;

export const isCreator = (moduleId: Module): boolean => isIndependentCreator(moduleId) || isDependentCreator(moduleId);

export const isBaseSeller = (moduleId: Module): boolean =>
  moduleId === modules.DISTRIBUTOR || moduleId === modules.RETAILER;

export const isPacker = (moduleId: Module): boolean => isBottlingPlant(moduleId) || isDistributor(moduleId);

export const isUnpacker = (moduleId: Module): boolean =>
  isBottlingPlant(moduleId) || isDistributor(moduleId) || isRetailer(moduleId);

export const isManufacturedUnitSeller = (moduleId: Module): boolean =>
  isBottleManufacturer(moduleId) || isOliveOilMill(moduleId);

export const isIndustrialUnitSeller = (moduleId: Module): boolean =>
  isBottlingPlant(moduleId) || isDistributor(moduleId);

export const isSeller = (moduleId: Module): boolean => isCreator(moduleId) || isBaseSeller(moduleId);

export const isMember = (moduleId: Module): boolean =>
  isCreator(moduleId) || isBaseSeller(moduleId) || isCertifier(moduleId);

export const pages = {
  EXPLORE: { title: 'Explore', url: '/explore' },
  CERTIFICATES: { title: 'Certificates', url: '/explore/certificates' },
  ESCROWS: { title: 'Escrows', url: '/explore/escrows' },
  TOKENS: { title: 'Tokens', url: '/explore/tokens' },
  TOKEN_TYPES: { title: 'Token Types', url: '/explore/token-types' },
  HOME: { title: 'Home', url: '/' },
  LOGIN: { title: 'Login', url: '/login' },
  MANAGEMENT: { title: 'Management', url: '/management' },
  MY_CERTIFICATES: { title: 'My Certificates', url: '/management/my-certificates' },
  MY_ESCROWS: { title: 'My Escrows', url: '/management/my-escrows' },
  MY_PARTICIPATIONS: { title: 'My Participations', url: '/management/my-participations' },
  MY_TOKENS: { title: 'My Tokens', url: '/management/my-tokens' },
  MY_TOKEN_TYPES: { title: 'My Token Types', url: '/management/my-token-types' }
};
