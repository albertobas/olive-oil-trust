import { ITokens } from 'next-app/src/features/shared/core/entities/Tokens';
import TokensRepository from 'next-app/src/features/shared/core/repositories/Tokens.repository';
import AllTokensAdapter from 'next-app/src/features/explore/core/adapters/allTokens.adapter';

const queryAllTokens =
  (repository: TokensRepository) =>
  async (endpoint: string): Promise<{ error: boolean; data: ITokens | null }> => {
    try {
      const data = await repository.getAll(endpoint);
      return { error: false, data: AllTokensAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryAllTokens;
