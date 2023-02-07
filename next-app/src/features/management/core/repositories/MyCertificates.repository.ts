import { CertificatesByMemberQuery } from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

interface MyCertificatesRepository {
  getByMember(member: string): Promise<ExecutionResult<CertificatesByMemberQuery>>;
}

export default MyCertificatesRepository;
