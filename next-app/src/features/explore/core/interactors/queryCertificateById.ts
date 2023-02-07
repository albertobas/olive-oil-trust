import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import CertificatesRepository from 'next-app/src/features/explore/core/repositories/Certificates.repository';
import certificateByIdAdapter from 'next-app/src/features/explore/core/adapters/certificateById.adapter';

const queryCertificateById =
  (repository: CertificatesRepository) =>
  async (id: string): Promise<{ error: boolean; data: ICertificate | null }> => {
    try {
      const { errors, data } = await repository.getById(id);
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? certificateByIdAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryCertificateById;
