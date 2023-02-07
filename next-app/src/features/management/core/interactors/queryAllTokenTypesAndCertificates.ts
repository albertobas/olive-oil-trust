import MyTokenTypesRepository from 'next-app/src/features/management/core/repositories/MyTokenTypes.repository';
import allTokenTypesAndCertificatesAdapter from 'next-app/src/features/management/core/adapters/allTokenTypesAndCertificates.adapter';
import { IAllTokenTypesAndCertificates } from 'next-app/src/features/management/core/entities/MyTokenTypes';

const queryAllTokenTypesAndCertificates =
  (repository: MyTokenTypesRepository) =>
  async (): Promise<{
    error: boolean;
    data: IAllTokenTypesAndCertificates | null;
  }> => {
    try {
      const { errors, data } = await repository.getAllTokenTypesAndCertificates();
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? allTokenTypesAndCertificatesAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryAllTokenTypesAndCertificates;
