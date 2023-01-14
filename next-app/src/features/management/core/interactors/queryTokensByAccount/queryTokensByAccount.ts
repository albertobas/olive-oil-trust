import { ITokens } from 'next-app/src/features/shared/core/entities/Tokens';
import TokensRepository from 'next-app/src/features/shared/core/repositories/Tokens.repository';
import tokensByAccountAdapter from 'next-app/src/features/management/core/adapters/tokensByAccount.adapter';

const queryTokensByAccount =
  (repository: TokensRepository) =>
  async (endpoint: string, account: string): Promise<{ error: boolean; data: ITokens | null }> => {
    try {
      const rawData = await repository.getTokensByAccount(endpoint, account);
      const data = tokensByAccountAdapter(rawData);
      return { error: false, data };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryTokensByAccount;
