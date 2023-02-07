import { IMember } from 'next-app/src/features/shared/utils/interfaces';
import { IEscrow } from 'next-app/src/features/shared/core/entities/Escrows';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';

export interface ITokensInfo {
  [tokenId: string]: {
    amount: number;
    token: ITokenFields;
  };
}

export interface IIndustrialUnitTokenInfo {
  id: string;
  commercialUnits: ITokensInfo | null;
  industrialUnit: ITokenFields;
  member: IMember | null;
}

export interface ITokenFields {
  id: string;
  identifier: string;
  contract: string;
  industrialUnitTokenInfo: IIndustrialUnitTokenInfo | null;
  mintingDate: number | null;
  selfProduced: boolean | null;
  tokenType: ITokenType | null;
  title: string;
  totalSupply: {
    id: string;
    value: number | null;
    valueExact: number | null;
  };
}

export interface ITokens {
  [tokenId: string]: IToken;
}

export interface IToken extends ITokenFields {
  ancestry: IFirstAncestry[] | null;
  escrows: IEscrow[] | null;
  balance: number | null;
}

export interface IFirstAncestry {
  amount: number;
  token: ITokenFirstAncestry;
}

export interface ITokenFirstAncestry extends ITokenFields {
  ancestry: ISecondAncestry[] | null;
}

export interface ISecondAncestry {
  amount: number;
  token: ITokenFields;
}
