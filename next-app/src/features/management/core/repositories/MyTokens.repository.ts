import {
  ITokensAndTokenTypesByMemberOOT,
  ITokensByAccountOOT
} from 'next-app/src/features/management/core/entities/MyTokensOOT';

interface MyTokensRepository {
  getTokensAndTokenTypesByMember(
    endpoint: string,
    member: string
  ): Promise<ITokensAndTokenTypesByMemberOOT | undefined>;
  getTokensByAccount(endpoint: string, account: string): Promise<ITokensByAccountOOT | undefined>;
}

export default MyTokensRepository;
