import { ITokenOOT } from 'next-app/src/features/shared/core/entities/TokensOOT';
import { ITokenTypeOOT } from 'next-app/src/features/shared/core/entities/TokenTypesOOT';

export interface ITokensAndTokenTypesByMemberOOT {
  memberContract: {
    id: string;
    name: string | null;
    role: string | null;
    asAccount: {
      tokenBalances:
        | {
            valueExact: string;
            tokenToken: ITokenOOT;
          }[]
        | null;
      ownerOfTokenContract: {
        tokens:
          | {
              id: string;
            }[]
          | null;
        tokenTypes: ITokenTypeOOT[] | null;
      }[];
    };
  } | null;
}

export interface ITokensByAccountOOT {
  account: {
    tokenBalances:
      | {
          valueExact: string;
          tokenToken: ITokenOOT;
        }[]
      | null;
  } | null;
}
