import { Tokens } from '@features/shared/core/entities/Tokens';
import MyTokensRepository from '@features/management/core/repositories/MyTokens.repository';
import tokensByAccountAdapter from '@features/management/core/adapters/tokensByAccount.adapter';

const queryTokensByAccount =
  (repository: MyTokensRepository) =>
  async (account: string): Promise<{ error: boolean; data: Tokens | null }> => {
    try {
      const { errors, data } = await repository.getTokensByAccount(account);
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? tokensByAccountAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryTokensByAccount;
