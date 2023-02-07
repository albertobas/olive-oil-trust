import MyCertificatesRepository from 'next-app/src/features/management/core/repositories/MyCertificates.repository';
import certificatesByMemberAndAllTokenTypesAdapter from 'next-app/src/features/management/core/adapters/certificatesByMemberAndAllTokenTypes.adapter';
import { ICertificatesByMemberAndAllTokenTypes } from 'next-app/src/features/management/core/entities/MyCertificates';

const queryCertificatesByMemberAndAllTokenTypes =
  (repository: MyCertificatesRepository) =>
  async (member: string): Promise<{ error: boolean; data: ICertificatesByMemberAndAllTokenTypes | null }> => {
    try {
      const { errors, data } = await repository.getByMember(member);
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? certificatesByMemberAndAllTokenTypesAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryCertificatesByMemberAndAllTokenTypes;
