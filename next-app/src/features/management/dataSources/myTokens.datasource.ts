import MyTokensRepository from '@features/management/core/repositories/MyTokens.repository';
import {
  execute,
  TokensAndTokenTypesByMemberDocument,
  TokensAndTokenTypesByMemberQuery,
  TokensByAccountDocument,
  TokensByAccountQuery
} from '.graphclient';
import { ExecutionResult } from 'graphql';

class MyTokensDataSource implements MyTokensRepository {
  public async getTokensAndTokenTypesByMember(
    member: string
  ): Promise<ExecutionResult<TokensAndTokenTypesByMemberQuery>> {
    return execute(TokensAndTokenTypesByMemberDocument, { member });
  }

  public async getTokensByAccount(account: string): Promise<ExecutionResult<TokensByAccountQuery>> {
    return execute(TokensByAccountDocument, { account });
  }
}

export default MyTokensDataSource;
