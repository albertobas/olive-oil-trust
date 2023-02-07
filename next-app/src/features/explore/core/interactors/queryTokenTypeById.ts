import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import TokenTypesRepository from 'next-app/src/features/explore/core/repositories/TokenTypes.repository';
import tokenTypeByIdAdapter from 'next-app/src/features/explore/core/adapters/tokenTypeById.adapter';

const queryTokenTypeById =
  (repository: TokenTypesRepository) =>
  async (id: string): Promise<{ error: boolean; data: ITokenType | null }> => {
    try {
      const { errors, data } = await repository.getById(id);
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? tokenTypeByIdAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryTokenTypeById;
