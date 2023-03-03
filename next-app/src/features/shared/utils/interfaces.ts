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
import { Certificate, Certificates } from 'next-app/src/features/shared/core/entities/Certificates';
import { Escrow, Escrows } from 'next-app/src/features/shared/core/entities/Escrows';
import { Token, Tokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { TokenType, TokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import {
  AllCertificatesQuery,
  AllEscrowsQuery,
  AllTokensQuery,
  AllTokenTypesAndCertificatesQuery,
  AllTokenTypesQuery,
  CertificateByIdQuery,
  CertificatesByMemberQuery,
  EscrowsByBuyerQuery,
  EscrowsByMemberQuery,
  MemberContract,
  TokenByIdQuery,
  TokensAndTokenTypesByMemberQuery,
  TokensByAccountQuery,
  TokenTypeByIdQuery
} from 'next-app/.graphclient';

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

export interface CertificatesStateData {
  certificates: Certificates | null;
  lastUpdated: number;
}

export interface CertificatesState {
  error: boolean | null;
  data: CertificatesStateData | null;
}

export interface CertificateState {
  error: boolean | null;
  data: Certificate | null;
}

export interface EscrowsStateData {
  escrows: Escrows | null;
  lastUpdated: number;
}

export interface EscrowsState {
  error: boolean | null;
  data: EscrowsStateData | null;
}
export interface TokensStateData {
  tokens: Tokens | null;
  lastUpdated: number;
}

export interface TokensState {
  error: boolean | null;
  data: TokensStateData | null;
}

export interface TokenState {
  error: boolean | null;
  data: Token | null;
}

export interface TokenTypesStateData {
  tokenTypes: TokenTypes | null;
  lastUpdated: number;
}

export interface TokenTypesState {
  error: boolean | null;
  data: TokenTypesStateData | null;
}

export interface TokenTypeState {
  error: boolean | null;
  data: TokenType | null;
}

export type FilterOption = {
  key: keyof TokenType | 'packer' | 'manufacturer' | 'selfProduced' | 'type' | keyof Escrow;
  items: IItem[] | IItem | null;
};

export type CertificateRawType =
  | AllCertificatesQuery['certificates'][0]
  | NonNullable<AllTokenTypesQuery['tokenTypes'][0]['certificates']>[0]['certificate']
  | NonNullable<CertificateByIdQuery['certificate']>
  | NonNullable<NonNullable<TokenTypeByIdQuery['tokenType']>['certificates']>[0]['certificate']
  | NonNullable<AllTokenTypesAndCertificatesQuery['tokenTypes'][0]['certificates']>[0]['certificate']
  | AllTokenTypesAndCertificatesQuery['certificates'][0]
  | NonNullable<
      NonNullable<
        CertificatesByMemberQuery['memberContract']
      >['asAccount']['ownerOfCertificateContract'][0]['certificates']
    >[0]
  | NonNullable<CertificatesByMemberQuery['tokenTypes'][0]['certificates']>[0]['certificate']
  | NonNullable<
      NonNullable<
        NonNullable<
          TokensAndTokenTypesByMemberQuery['memberContract']
        >['asAccount']['ownerOfTokenContract'][0]['tokenTypes']
      >[0]['certificates']
    >[0]['certificate'];

export type EscrowRawType =
  | AllEscrowsQuery['escrows'][0]
  | NonNullable<TokenRawType['escrows']>[0]['escrow']
  | EscrowsByBuyerQuery['escrows'][0]
  | NonNullable<
      NonNullable<EscrowsByMemberQuery['memberContract']>['asAccount']['ownerOfEscrowContract'][0]['escrows']
    >[0];

export type MemberRawType = Pick<MemberContract, 'id' | 'name' | 'role'>;

export type MetadataRawType = CertificateRawType | TokenTypeRawType;

export type TokenTypeRawType =
  | AllTokenTypesQuery['tokenTypes'][0]
  | NonNullable<AllCertificatesQuery['certificates'][0]['tokenTypes']>[0]['tokenType']
  | NonNullable<NonNullable<CertificateByIdQuery['certificate']>['tokenTypes']>[0]['tokenType']
  | NonNullable<TokenTypeByIdQuery['tokenType']>
  | NonNullable<NonNullable<NonNullable<EscrowRawType['escrowBalance']['escrowTokens']>[0]>['tokenType']>
  | NonNullable<NonNullable<NonNullable<TokenRawType['ancestry']>[0]['token']['ancestry']>[0]['token']['tokenType']>
  | AllTokenTypesAndCertificatesQuery['tokenTypes'][0]
  | NonNullable<AllTokenTypesAndCertificatesQuery['certificates'][0]['tokenTypes']>[0]['tokenType']
  | NonNullable<TokenRawType['tokenType']>
  | CertificatesByMemberQuery['tokenTypes'][0]
  | NonNullable<
      NonNullable<
        NonNullable<
          CertificatesByMemberQuery['memberContract']
        >['asAccount']['ownerOfCertificateContract'][0]['certificates']
      >[0]['tokenTypes']
    >[0]['tokenType']
  | NonNullable<
      NonNullable<
        TokensAndTokenTypesByMemberQuery['memberContract']
      >['asAccount']['ownerOfTokenContract'][0]['tokenTypes']
    >[0];

export type TokenRawType =
  | AllTokensQuery['tokens'][0]
  | NonNullable<TokenByIdQuery['token']>
  | NonNullable<
      NonNullable<
        NonNullable<TokensAndTokenTypesByMemberQuery['memberContract']>['asAccount']['tokenBalances']
      >[0]['tokenToken']
    >
  | NonNullable<NonNullable<NonNullable<TokensByAccountQuery['account']>['tokenBalances']>[0]['tokenToken']>;

export type TokenInfoRawType = NonNullable<TokenRawType['industrialUnitTokenInfo']>;

export type EventRawType =
  | NonNullable<TokenTypeRawType['tokenTypeInstructionsSet']>
  | NonNullable<CertificateRawType['certification']>[0];

export type TransactionRawType = EscrowRawType['tokenDeposits'][0]['transaction'];
