import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import TokenTypesRepository from 'next-app/src/features/explore/core/repositories/TokenTypes.repository';
import allTokenTypesAdapter from 'next-app/src/features/explore/core/adapters/allTokenTypes.adapter';

const queryAllTokenTypes =
  (repository: TokenTypesRepository) => async (): Promise<{ error: boolean; data: ITokenTypes | null }> => {
    try {
      const { errors, data } = await repository.getAll();
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? allTokenTypesAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryAllTokenTypes;
