import CertificatesRepository from '@features/explore/core/repositories/Certificates.repository';
import {
  execute,
  AllCertificatesDocument,
  AllCertificatesQuery,
  CertificateByIdDocument,
  CertificateByIdQuery
} from '.graphclient';
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
