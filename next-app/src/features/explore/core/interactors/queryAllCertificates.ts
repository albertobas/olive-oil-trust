import { ICertificates } from 'next-app/src/features/shared/core/entities/Certificates';
import CertificatesRepository from 'next-app/src/features/explore/core/repositories/Certificates.repository';
import allCertificatesAdapter from 'next-app/src/features/explore/core/adapters/allCertificates.adapter';

const queryAllCertificates =
  (repository: CertificatesRepository) => async (): Promise<{ error: boolean; data: ICertificates | null }> => {
    try {
      const { errors, data } = await repository.getAll();
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? allCertificatesAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryAllCertificates;
