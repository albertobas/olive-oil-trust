import { Fixture } from 'ethereum-waffle';
import { BigNumber, Wallet } from 'ethers';
import {
  IndependentTokenUpgradeableWithInit,
  DependentTokenUpgradeableWithInit,
  CertificateUpgradeableWithInit,
  CertifierUpgradeableWithInit,
  AgriculturalEscrowUpgradeableWithInit,
  OliveGrowerUpgradeableWithInit,
  OliveOilMillUpgradeableWithInit,
  BottlingPlantUpgradeableWithInit,
  BottleManufacturerUpgradeableWithInit,
  IndustrialUnitTokenUpgradeableWithInit,
  DistributorUpgradeableWithInit,
  RetailerUpgradeableWithInit,
  IndustrialUnitsEscrowUpgradeableWithInit,
  CommercialUnitsEscrowUpgradeableWithInit,
  BottleCompany,
  BottlingCompany,
  CertifierCompany,
  DistributorCompany,
  OliveGrowerOne,
  OliveOilMillCompany,
  RetailerCompany,
  CertifierCompanyCertificate,
  BottleCompanyEscrow,
  BottlingCompanyEscrow,
  DistributorCompanyEscrow,
  OliveGrowerOneOlives,
  OliveGrowerOneEscrow,
  OliveOilMillCompanyOliveOil,
  OliveOilMillCompanyEscrow,
  RetailerCompanyEscrow,
  BottleCompanyBottle,
  BottlingCompanyOliveOilBottle,
  BottlingCompanyPallet,
  DistributorCompanyPallet
} from '@types';

declare module 'mocha' {
  export interface Context {
    token: Tokens;
    contracts: Contracts;
    signers: Signers;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
  }
}

export interface Contracts {
  olivesToken: IndependentTokenUpgradeableWithInit;
  bottleToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  oliveOilTokenCertificate: DependentTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  oliveOilBottleTokenCertificate: DependentTokenUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  agriculturalEscrow: AgriculturalEscrowUpgradeableWithInit;
  industrialUnitsEscrow: IndustrialUnitsEscrowUpgradeableWithInit;
  commercialUnitsEscrow: CommercialUnitsEscrowUpgradeableWithInit;
  certificate: CertificateUpgradeableWithInit;
  certifier: CertifierUpgradeableWithInit;
  oliveGrower: OliveGrowerUpgradeableWithInit;
  bottleManufacturer: BottleManufacturerUpgradeableWithInit;
  oliveOilMill: OliveOilMillUpgradeableWithInit;
  oliveOilMillCertificate: OliveOilMillUpgradeableWithInit;
  bottlingPlant: BottlingPlantUpgradeableWithInit;
  bottlingPlantCertificate: BottlingPlantUpgradeableWithInit;
  distributor: DistributorUpgradeableWithInit;
  retailer: RetailerUpgradeableWithInit;
  bottleCompany: BottleCompany;
  bottlingCompany: BottlingCompany;
  certifierCompany: CertifierCompany;
  distributorCompany: DistributorCompany;
  oliveGrowerOne: OliveGrowerOne;
  oliveOilMillCompany: OliveOilMillCompany;
  retailerCompany: RetailerCompany;
  certifierCompanyCertificate: CertifierCompanyCertificate;
  bottleCompanyEscrow: BottleCompanyEscrow;
  bottlingCompanyEscrow: BottlingCompanyEscrow;
  distributorCompanyEscrow: DistributorCompanyEscrow;
  oliveGrowerOneEscrow: OliveGrowerOneEscrow;
  oliveOilMillCompanyEscrow: OliveOilMillCompanyEscrow;
  retailerCompanyEscrow: RetailerCompanyEscrow;
  bottleCompanyBottle: BottleCompanyBottle;
  bottlingCompanyOliveOilBottle: BottlingCompanyOliveOilBottle;
  bottlingCompanyPallet: BottlingCompanyPallet;
  distributorCompanyPallet: DistributorCompanyPallet;
  oliveGrowerOneOlives: OliveGrowerOneOlives;
  oliveOilMillCompanyOliveOil: OliveOilMillCompanyOliveOil;
}

export interface Signers {
  deployer: Wallet;
  acc2: Wallet;
  acc3: Wallet;
}

export interface Tokens {
  addresses: string[];
  addressesCertificate: string[];
  ids: BigNumber[];
  ids2d: BigNumber[][];
}

export interface MyIndustrialUnitToken {
  addr: string;
  id: string;
  amount: number;
}

export type IndustrialUnitsSellerContract = 'bottlingPlant' | 'distributor';

export type ManufacturedUnitsSellerContract = 'bottleManufacturer' | 'oliveOilMill';

export type BaseSellerContract =
  | 'oliveGrower'
  | ManufacturedUnitsSellerContract
  | IndustrialUnitsSellerContract
  | 'retailer';

export type MemberContract = BaseSellerContract | 'certifier';

type IndustrialUnitsPaymentGatewayContract = 'distributor' | 'retailer';

export type IndustrialOrCommercialUnitsPaymentGatewayContract = IndustrialUnitsPaymentGatewayContract | 'bottlingPlant';

export type IndependentCreatorContract = 'oliveGrower' | 'bottleManufacturer';

export type DependentCreatorContract =
  | 'oliveOilMill'
  | 'oliveOilMillCertificate'
  | 'bottlingPlant'
  | 'bottlingPlantCertificate';

export type IndependentTokenUpgradeableContract = 'olivesToken' | 'bottleToken';

export type DependentTokenUpgradeableContract =
  | 'oliveOilToken'
  | 'oliveOilTokenCertificate'
  | 'oliveOilBottleToken'
  | 'oliveOilBottleTokenCertificate';

export type CreationTokenContract = IndependentTokenUpgradeableContract | DependentTokenUpgradeableContract;

export type IndustrialOrCommercialTokenContract = DependentTokenUpgradeableContract | 'palletToken';

type AgriculturalEscrowUpgradeableContract = 'agriculturalEscrow';

type IndustrialUnitsEscrowUpgradeableContract = 'industrialUnitsEscrow';

type CommercialUnitsEscrowUpgradeableContract = 'commercialUnitsEscrow';

export type BaseEscrowContract = AgriculturalEscrowUpgradeableContract | CommercialUnitsEscrowUpgradeableContract;

export type IndustrialOrCommercialUnitsEscrowContract =
  | IndustrialUnitsEscrowUpgradeableContract
  | CommercialUnitsEscrowUpgradeableContract;
