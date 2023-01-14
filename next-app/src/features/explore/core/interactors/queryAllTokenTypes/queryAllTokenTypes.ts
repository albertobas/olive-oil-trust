import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import TokenTypesRepository from 'next-app/src/features/shared/core/repositories/TokenTypes.repository';
import allTokenTypesAdapter from 'next-app/src/features/explore/core/adapters/allTokenTypes.adapter';

const queryAllTokenTypes =
  (repository: TokenTypesRepository) =>
  async (endpoint: string): Promise<{ error: boolean; data: ITokenTypes | null }> => {
    try {
      const data = await repository.getAll(endpoint);
      return { error: false, data: allTokenTypesAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryAllTokenTypes;
