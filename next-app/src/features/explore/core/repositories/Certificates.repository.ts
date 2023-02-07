import { AllCertificatesQuery, CertificateByIdQuery } from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

interface CertificatesRepository {
  getAll(): Promise<ExecutionResult<AllCertificatesQuery>>;
  getById(id: string): Promise<ExecutionResult<CertificateByIdQuery>>;
}

export default CertificatesRepository;
