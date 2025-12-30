import { CertificatesByMemberQuery } from '.graphclient';
import { ExecutionResult } from 'graphql';

interface MyCertificatesRepository {
  getByMember(member: string): Promise<ExecutionResult<CertificatesByMemberQuery>>;
}

export default MyCertificatesRepository;
