import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';
import TokensRepository from 'next-app/src/features/shared/core/repositories/Tokens.repository';
import tokenByIdAdapter from 'next-app/src/features/explore/core/adapters/tokenById.adapter';

const queryTokenById =
  (repository: TokensRepository) =>
  async (endpoint: string, id: string): Promise<{ error: boolean; data: IToken | null }> => {
    try {
      const data = await repository.getById(endpoint, id);
      return { error: false, data: tokenByIdAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryTokenById;
