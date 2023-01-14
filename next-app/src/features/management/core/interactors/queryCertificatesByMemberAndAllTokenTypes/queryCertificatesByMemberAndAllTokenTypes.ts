import CertificatesRepository from 'next-app/src/features/shared/core/repositories/Certificates.repository';
import certificatesByMemberAndAllTokenTypesAdapter from 'next-app/src/features/management/core/adapters/certificatesByMemberAndAllTokenTypes.adapter';
import { ICertificatesByMemberAndAllTokenTypes } from 'next-app/src/features/management/core/entities/Certificates';

const queryCertificatesByMemberAndAllTokenTypes =
  (repository: CertificatesRepository) =>
  async (
    endpoint: string,
    member: string
  ): Promise<{ error: boolean; data: ICertificatesByMemberAndAllTokenTypes | null }> => {
    try {
      const data = await repository.getByMember(endpoint, member);
      return { error: false, data: certificatesByMemberAndAllTokenTypesAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryCertificatesByMemberAndAllTokenTypes;
