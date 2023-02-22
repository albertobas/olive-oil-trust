import CertificatesRepository from 'next-app/src/features/explore/core/repositories/Certificates.repository';
import {
  execute,
  AllCertificatesDocument,
  AllCertificatesQuery,
  CertificateByIdDocument,
  CertificateByIdQuery
} from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

class CertificatesDataSource implements CertificatesRepository {
  public async getAll(): Promise<ExecutionResult<AllCertificatesQuery>> {
    return execute(AllCertificatesDocument, {});
  }

  public async getById(id: string): Promise<ExecutionResult<CertificateByIdQuery>> {
    return execute(CertificateByIdDocument, { id });
  }
}

export default CertificatesDataSource;
