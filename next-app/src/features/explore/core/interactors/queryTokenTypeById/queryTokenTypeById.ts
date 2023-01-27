import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import TokenTypesRepository from 'next-app/src/features/explore/core/repositories/TokenTypes.repository';
import tokenTypeByIdAdapter from 'next-app/src/features/explore/core/adapters/tokenTypeById.adapter';

const queryTokenTypeById =
  (repository: TokenTypesRepository) =>
  async (endpoint: string, id: string): Promise<{ error: boolean; data: ITokenType | null }> => {
    try {
      const data = await repository.getById(endpoint, id);
      return { error: false, data: tokenTypeByIdAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryTokenTypeById;
