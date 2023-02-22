import MyEscrowsRepository from 'next-app/src/features/management/core/repositories/MyEscrows.repository';
import {
  execute,
  EscrowsByBuyerDocument,
  EscrowsByBuyerQuery,
  EscrowsByMemberDocument,
  EscrowsByMemberQuery
} from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

class MyEscrowsDataSource implements MyEscrowsRepository {
  public async getByBuyer(member: string): Promise<ExecutionResult<EscrowsByBuyerQuery>> {
    return execute(EscrowsByBuyerDocument, { member });
  }

  public async getByMember(member: string): Promise<ExecutionResult<EscrowsByMemberQuery>> {
    return execute(EscrowsByMemberDocument, { member });
  }
}

export default MyEscrowsDataSource;
