import { EscrowsByBuyerQuery, EscrowsByMemberQuery } from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

interface MyEscrowsRepository {
  getByBuyer(member: string): Promise<ExecutionResult<EscrowsByBuyerQuery>>;
  getByMember(member: string): Promise<ExecutionResult<EscrowsByMemberQuery>>;
}

export default MyEscrowsRepository;
