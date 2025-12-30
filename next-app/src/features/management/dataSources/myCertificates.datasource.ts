import MyCertificatesRepository from '@features/management/core/repositories/MyCertificates.repository';
import { execute, CertificatesByMemberDocument, CertificatesByMemberQuery } from '.graphclient';
import { ExecutionResult } from 'graphql';

class MyCertificatesDataSource implements MyCertificatesRepository {
  public async getByMember(member: string): Promise<ExecutionResult<CertificatesByMemberQuery>> {
    return execute(CertificatesByMemberDocument, { member });
  }
}

export default MyCertificatesDataSource;
