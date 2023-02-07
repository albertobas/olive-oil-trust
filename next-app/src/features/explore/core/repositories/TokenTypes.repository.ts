import { AllTokenTypesQuery, TokenTypeByIdQuery } from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

interface TokenTypesRepository {
  getAll(): Promise<ExecutionResult<AllTokenTypesQuery>>;
  getById(id: string): Promise<ExecutionResult<TokenTypeByIdQuery>>;
}

export default TokenTypesRepository;
