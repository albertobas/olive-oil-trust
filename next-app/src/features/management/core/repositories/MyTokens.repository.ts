import { TokensAndTokenTypesByMemberQuery, TokensByAccountQuery } from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

interface MyTokensRepository {
  getTokensAndTokenTypesByMember(member: string): Promise<ExecutionResult<TokensAndTokenTypesByMemberQuery>>;
  getTokensByAccount(account: string): Promise<ExecutionResult<TokensByAccountQuery>>;
}

export default MyTokensRepository;
