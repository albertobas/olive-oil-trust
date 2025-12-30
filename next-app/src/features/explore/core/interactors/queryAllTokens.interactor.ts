import { Tokens } from '@features/shared/core/entities/Tokens';
import TokensRepository from '@features/explore/core/repositories/Tokens.repository';
import allTokensAdapter from '@features/explore/core/adapters/allTokens.adapter';

const queryAllTokens = (repository: TokensRepository) => async (): Promise<{ error: boolean; data: Tokens | null }> => {
  try {
    const { errors, data } = await repository.getAll();
    if (errors) {
      throw errors;
    }
    return { error: false, data: data ? allTokensAdapter(data) : null };
  } catch (e) {
    if (Array.isArray(e)) {
      e.forEach((error) => console.error(error));
    } else {
      console.error(e);
    }
    return { error: true, data: null };
  }
};

export default queryAllTokens;
