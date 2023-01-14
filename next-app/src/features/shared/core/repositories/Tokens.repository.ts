import { IAllTokensOOT, ITokenByIdOOT } from 'next-app/src/features/explore/core/entities/TokensOOT';
import {
  ITokensAndTokenTypesByMemberOOT,
  ITokensByAccountOOT
} from 'next-app/src/features/management/core/entities/TokensOOT';

interface TokensRepository {
  getById(endpoint: string, id: string): Promise<ITokenByIdOOT | undefined>;
  getAll(endpoint: string): Promise<IAllTokensOOT | undefined>;
  getTokensAndTokenTypesByMember(
    endpoint: string,
    member: string
  ): Promise<ITokensAndTokenTypesByMemberOOT | undefined>;
  getTokensByAccount(endpoint: string, account: string): Promise<ITokensByAccountOOT | undefined>;
}

export default TokensRepository;
