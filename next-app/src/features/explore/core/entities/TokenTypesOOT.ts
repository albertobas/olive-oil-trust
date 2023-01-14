import { ITokenTypeOOT } from 'next-app/src/features/shared/core/entities/TokenTypesOOT';

export interface IAllTokenTypesOOT {
  tokenTypes: ITokenTypeOOT[] | null;
}

export interface ITokenTypeByIdOOT {
  tokenType: ITokenTypeOOT | null;
}
