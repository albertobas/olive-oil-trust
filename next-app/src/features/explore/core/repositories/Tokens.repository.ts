import { AllTokensQuery, TokenByIdQuery } from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

interface TokensRepository {
  getAll(): Promise<ExecutionResult<AllTokensQuery>>;
  getById(id: string): Promise<ExecutionResult<TokenByIdQuery>>;
}

export default TokensRepository;
