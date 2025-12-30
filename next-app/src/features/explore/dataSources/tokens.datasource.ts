import TokensRepository from '@features/explore/core/repositories/Tokens.repository';
import { AllTokensDocument, AllTokensQuery, execute, TokenByIdDocument, TokenByIdQuery } from '.graphclient';
import { ExecutionResult } from 'graphql';

class TokensDataSource implements TokensRepository {
  public async getAll(): Promise<ExecutionResult<AllTokensQuery>> {
    return execute(AllTokensDocument, {});
  }

  public async getById(id: string): Promise<ExecutionResult<TokenByIdQuery>> {
    return execute(TokenByIdDocument, { id });
  }
}

export default TokensDataSource;
