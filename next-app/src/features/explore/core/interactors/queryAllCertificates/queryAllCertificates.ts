import { ICertificates } from 'next-app/src/features/shared/core/entities/Certificates';
import CertificatesRepository from 'next-app/src/features/explore/core/repositories/Certificates.repository';
import AllCertificatesAdapter from 'next-app/src/features/explore/core/adapters/allCertificates.adapter';

const queryAllCertificates =
  (repository: CertificatesRepository) =>
  async (endpoint: string): Promise<{ error: boolean; data: ICertificates | null }> => {
    try {
      const data = await repository.getAll(endpoint);
      return { error: false, data: AllCertificatesAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryAllCertificates;
