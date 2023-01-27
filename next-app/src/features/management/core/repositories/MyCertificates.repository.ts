import { ICertificatesAndTokenTypesByMemberOOT } from 'next-app/src/features/management/core/entities/MyCertificatesOOT';

interface MyCertificatesRepository {
  getByMember(endpoint: string, member: string): Promise<ICertificatesAndTokenTypesByMemberOOT | undefined>;
}

export default MyCertificatesRepository;
