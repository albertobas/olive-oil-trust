import { BottleCompany } from 'next-app/src/generated/types/contracts/members/BottleCompany';
import { BottlingCompany } from 'next-app/src/generated/types/contracts/members/BottlingCompany';
import { CertifierCompany } from 'next-app/src/generated/types/contracts/members/CertifierCompany';
import { DistributorCompany } from 'next-app/src/generated/types/contracts/members/DistributorCompany';
import { OliveGrowerOne } from 'next-app/src/generated/types/contracts/members/OliveGrowerOne';
import { OliveOilMillCompany } from 'next-app/src/generated/types/contracts/members/OliveOilMillCompany';
import { RetailerCompany } from 'next-app/src/generated/types/contracts/members/RetailerCompany';
import { BottlingCompanyEscrow } from 'next-app/src/generated/types/contracts/escrows/BottlingCompanyEscrow';
import { BottlingCompanyOliveOilBottle } from 'next-app/src/generated/types/contracts/tokens/BottlingCompanyOliveOilBottle';
import { roles } from 'next-app/src/shared/utils/constants';
import { Module } from 'next-app/src/shared/utils/interfaces';
import { ICertificates } from 'next-app/src/features/shared/core/entities/Certificates';
import { IEscrow, IEscrows } from 'next-app/src/features/shared/core/entities/Escrows';
import { ITokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { ITokenType, ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';

export interface IItem {
  label: string;
  value: string;
}

export interface IGroupedItems {
  label: string;
  options: IItem[];
}

export interface IItemNum {
  label: string;
  value: number;
}

export type Certifier = CertifierCompany;

export type OliveGrower = OliveGrowerOne;

type BottleManufacturer = BottleCompany;

export type OliveOilMill = OliveOilMillCompany;

export type BottlingPlant = BottlingCompany;

export type Distributor = DistributorCompany;

export type Retailer = RetailerCompany;

export type OliveOilBottle = BottlingCompanyOliveOilBottle;

export type OliveOilBottleEscrow = BottlingCompanyEscrow;

export type DependentCreator = OliveOilMill | BottlingPlant;

export type IndependentCreator = OliveGrower | BottleManufacturer;

export type IndustrialUnitsPaymentGatewayContract = Distributor | Retailer;

export type ManufacturedUnitSeller = BottleManufacturer | OliveOilMill;

export type IndustrialUnitSeller = BottlingPlant | Distributor;

export type Seller = OliveGrower | ManufacturedUnitSeller | IndustrialUnitSeller | Retailer;

export type Buyer = OliveOilMill | BottlingPlant | Distributor | Retailer;

export type Role = keyof typeof roles;

export type EscrowSate =
  | 'NonActive'
  | 'Active'
  | 'RevertedBeforePayment'
  | 'EtherDeposited'
  | 'RevertedAfterPayment'
  | 'Closed';

export interface IMemberOOT {
  id: string;
  name: string | null;
  role: string | null;
}

export interface IMember {
  id: string;
  name: string | null;
  role: Role | null;
}

export interface IContract {
  address: string;
  moduleId: Module | null;
  name: string;
}

export interface ICertificatesStateData {
  certificates: ICertificates | null;
  lastUpdated: number;
}

export interface ICertificatesState {
  error: boolean | null;
  data: ICertificatesStateData | null;
}
export interface IEscrowsStateData {
  escrows: IEscrows | null;
  lastUpdated: number;
}

export interface IEscrowsState {
  error: boolean | null;
  data: IEscrowsStateData | null;
}
export interface ITokensStateData {
  tokens: ITokens | null;
  lastUpdated: number;
}

export interface ITokensState {
  error: boolean | null;
  data: ITokensStateData | null;
}

export interface ITokenTypesStateData {
  tokenTypes: ITokenTypes | null;
  lastUpdated: number;
}

export interface ITokenTypesState {
  error: boolean | null;
  data: ITokenTypesStateData | null;
}

export type FilterOption = {
  key: keyof ITokenType | 'packer' | 'manufacturer' | 'selfProduced' | 'type' | keyof IEscrow;
  items: IItem[] | IItem | null;
};
