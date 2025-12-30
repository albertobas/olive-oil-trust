import { EscrowsByBuyerQuery, EscrowsByMemberQuery } from '.graphclient';
import { ExecutionResult } from 'graphql';

interface MyEscrowsRepository {
  getByBuyer(member: string): Promise<ExecutionResult<EscrowsByBuyerQuery>>;
  getByMember(member: string): Promise<ExecutionResult<EscrowsByMemberQuery>>;
}

export default MyEscrowsRepository;
