import { IAllEscrowsOOT } from 'next-app/src/features/explore/core/entities/EscrowsOOT';
import {
  IEscrowsByAccountOOT,
  IEscrowsByBuyerOOT,
  IEscrowsByMemberOOT
} from 'next-app/src/features/management/core/entities/EscrowsOOT';

interface EscrowsRepository {
  getAll(endpoint: string): Promise<IAllEscrowsOOT | undefined>;
  getByAccount(endpoint: string, account: string): Promise<IEscrowsByAccountOOT | undefined>;
  getByBuyer(endpoint: string, member: string): Promise<IEscrowsByBuyerOOT | undefined>;
  getByMember(endpoint: string, member: string): Promise<IEscrowsByMemberOOT | undefined>;
}

export default EscrowsRepository;
