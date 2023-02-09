import TokenTypesRepository from 'next-app/src/features/explore/core/repositories/TokenTypes.repository';
import {
  execute,
  AllTokenTypesDocument,
  AllTokenTypesQuery,
  TokenTypeByIdDocument,
  TokenTypeByIdQuery
} from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

class TokenTypesDataSource implements TokenTypesRepository {
  public async getAll(): Promise<ExecutionResult<AllTokenTypesQuery>> {
    return execute(AllTokenTypesDocument, {});
  }

  public async getById(id: string): Promise<ExecutionResult<TokenTypeByIdQuery>> {
    return execute(TokenTypeByIdDocument, { id });
  }
}

export default TokenTypesDataSource;
