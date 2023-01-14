import { IMemberOOT } from 'next-app/src/features/shared/utils/interfaces';
import { IEscrowOOT } from 'next-app/src/features/shared/core/entities/EscrowsOOT';
import { ITokenTypeOOT } from 'next-app/src/features/shared/core/entities/TokenTypesOOT';

export interface IBasicTokenFieldsOOT {
  id: string;
  identifier: string;
  contract: {
    id: string;
    owner: {
      asMemberContract: IMemberOOT | null;
    } | null;
  };
  tokenType: ITokenTypeOOT | null;
  mintingDate: string | null;
  totalSupply: {
    id: string;
    value: string | null;
    valueExact: string | null;
  };
}

export interface ITokenFieldsOOT extends IBasicTokenFieldsOOT {
  industrialUnitTokenInfo: IIndustrialUnitTokenInfoOOT | null;
}

export interface IIndustrialUnitTokenInfoOOT {
  id: string;
  amounts: string[] | null;
  industrialUnit: IBasicTokenFieldsOOT;
  commercialUnits: IBasicTokenFieldsOOT[];
}

export interface ITokenFirstAncestryOOT extends ITokenFieldsOOT {
  ancestry?:
    | {
        id: string;
        descendant: ITokenOOT;
        token: ITokenOOT;
        amount: number;
      }[]
    | null;
}

export interface ITokenOOT extends ITokenFieldsOOT {
  ancestry?:
    | {
        id: string;
        descendant: ITokenFirstAncestryOOT;
        token: ITokenOOT;
        amount: number;
      }[]
    | null;
  escrows?: { escrow: IEscrowOOT }[] | null;
}
