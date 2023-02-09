import EscrowsRepository from 'next-app/src/features/explore/core/repositories/Escrows.repository';
import { execute, AllEscrowsDocument, AllEscrowsQuery } from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

class EscrowsDataSource implements EscrowsRepository {
  public async getAll(): Promise<ExecutionResult<AllEscrowsQuery>> {
    return execute(AllEscrowsDocument, {});
  }
}
export default EscrowsDataSource;
