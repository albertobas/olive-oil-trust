import { Certificates } from '@features/shared/core/entities/Certificates';
import CertificatesRepository from '@features/explore/core/repositories/Certificates.repository';
import allCertificatesAdapter from '@features/explore/core/adapters/allCertificates.adapter';

const queryAllCertificates =
  (repository: CertificatesRepository) => async (): Promise<{ error: boolean; data: Certificates | null }> => {
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
