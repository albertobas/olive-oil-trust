import { AllEscrowsQuery } from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

interface EscrowsRepository {
  getAll(): Promise<ExecutionResult<AllEscrowsQuery>>;
}

export default EscrowsRepository;
