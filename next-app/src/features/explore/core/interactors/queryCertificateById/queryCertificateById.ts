import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import CertificatesRepository from 'next-app/src/features/shared/core/repositories/Certificates.repository';
import certificateByIdAdapter from 'next-app/src/features/explore/core/adapters/certificateById.adapter';

const queryCertificateById =
  (repository: CertificatesRepository) =>
  async (endpoint: string, id: string): Promise<{ error: boolean; data: ICertificate | null }> => {
    try {
      const data = await repository.getById(endpoint, id);
      return { error: false, data: certificateByIdAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryCertificateById;
