import TokenTypesRepository from 'next-app/src/features/shared/core/repositories/TokenTypes.repository';
import allTokenTypesAndCertificatesAdapter from 'next-app/src/features/management/core/adapters/allTokenTypesAndCertificates.adapter';
import { IAllTokenTypesAndCertificates } from 'next-app/src/features/management/core/entities/TokenTypes';

const queryAllTokenTypesAndCertificates =
  (repository: TokenTypesRepository) =>
  async (
    endpoint: string
  ): Promise<{
    error: boolean;
    data: IAllTokenTypesAndCertificates | null;
  }> => {
    try {
      const data = await repository.getAllTokenTypesAndCertificates(endpoint);
      return { error: false, data: allTokenTypesAndCertificatesAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryAllTokenTypesAndCertificates;
