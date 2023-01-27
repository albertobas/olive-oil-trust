import {
  IEscrowsByAccountOOT,
  IEscrowsByBuyerOOT,
  IEscrowsByMemberOOT
} from 'next-app/src/features/management/core/entities/MyEscrowsOOT';

interface MyEscrowsRepository {
  getByAccount(endpoint: string, account: string): Promise<IEscrowsByAccountOOT | undefined>;
  getByBuyer(endpoint: string, member: string): Promise<IEscrowsByBuyerOOT | undefined>;
  getByMember(endpoint: string, member: string): Promise<IEscrowsByMemberOOT | undefined>;
}

export default MyEscrowsRepository;
