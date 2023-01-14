import { ITokenOOT } from 'next-app/src/features/shared/core/entities/TokensOOT';

export interface IAllTokensOOT {
  tokens: ITokenOOT[] | null;
}

export interface ITokenByIdOOT {
  token: ITokenOOT | null;
}
