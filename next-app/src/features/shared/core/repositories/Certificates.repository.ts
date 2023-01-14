import { IAllCertificatesOOT, ICertificateByIdOOT } from 'next-app/src/features/explore/core/entities/CertificatesOOT';
import { ICertificatesAndTokenTypesByMemberOOT } from 'next-app/src/features/management/core/entities/CertificatesOOT';

interface CertificatesRepository {
  getById(endpoint: string, id: string): Promise<ICertificateByIdOOT | undefined>;
  getAll(endpoint: string): Promise<IAllCertificatesOOT | undefined>;
  getByMember(endpoint: string, member: string): Promise<ICertificatesAndTokenTypesByMemberOOT | undefined>;
}

export default CertificatesRepository;
