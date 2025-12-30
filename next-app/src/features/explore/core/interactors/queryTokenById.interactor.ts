import { Token } from '@features/shared/core/entities/Tokens';
import TokensRepository from '@features/explore/core/repositories/Tokens.repository';
import tokenByIdAdapter from '@features/explore/core/adapters/tokenById.adapter';

const queryTokenById =
  (repository: TokensRepository) =>
  async (id: string): Promise<{ error: boolean; data: Token | null }> => {
    try {
      const { errors, data } = await repository.getById(id);
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? tokenByIdAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryTokenById;
