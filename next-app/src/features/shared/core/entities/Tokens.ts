import { IMember } from '@features/shared/utils/interfaces';
import { Escrow } from '@features/shared/core/entities/Escrows';
import { TokenType } from '@features/shared/core/entities/TokenTypes';

export interface TokensInfo {
  [tokenId: string]: {
    amount: number;
    token: TokenFields;
  };
}

export interface IndustrialUnitTokenInfo {
  id: string;
  commercialUnits: TokensInfo | null;
  industrialUnit: TokenFields;
  member: IMember | null;
}

export interface TokenFields {
  id: string;
  identifier: string;
  contract: string;
  industrialUnitTokenInfo: IndustrialUnitTokenInfo | null;
  mintingDate: number | null;
  selfProduced: boolean | null;
  tokenType: TokenType | null;
  title: string;
  totalSupply: {
    id: string;
    value: number | null;
    valueExact: number | null;
  };
}

export interface Tokens {
  [tokenId: string]: Token;
}

export interface Token extends TokenFields {
  ancestry: FirstAncestry[] | null;
  escrows: Escrow[] | null;
  balance: number | null;
}

export interface FirstAncestry {
  amount: number;
  token: TokenFirstAncestry;
}

export interface TokenFirstAncestry extends TokenFields {
  ancestry: SecondAncestry[] | null;
}

export interface SecondAncestry {
  amount: number;
  token: TokenFields;
}
