import { IAllCertificatesOOT, ICertificateByIdOOT } from 'next-app/src/features/explore/core/entities/CertificatesOOT';

interface CertificatesRepository {
  getById(endpoint: string, id: string): Promise<ICertificateByIdOOT | undefined>;
  getAll(endpoint: string): Promise<IAllCertificatesOOT | undefined>;
}

export default CertificatesRepository;
